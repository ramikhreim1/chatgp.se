const express = require('express');
const app = express.Router();
const { conversationApiSchema } = require('../utils/schemas');
const { fetchSSE } = require('./middleware/SSE');
const axios = require('axios');
const redisClient = require('../utils/redis');
const getAndUpdateChat = require('./middleware/updateChat');
const innternet_plugin = require("./middleware/internet_plugin");
const { creditPayment } = require('./middleware/index');
const { saveToHistory } = require('./middleware/index');
const parseMessage = require('./middleware/parseMessage');
const createImage = require('./middleware/createImage');
const getAccessToken = require("../utils/getaccesstoken");

const apiKeys = [process.env.OPENAI_API_KEY_1, process.env.OPENAI_API_KEY_2, process.env.OPENAI_API_KEY_3].filter(Boolean);

app.get('/conversation', async (req, res) => {
    res.set({ 'Cache-Control': 'no-cache', 'Content-Type': 'event-stream', 'Connection': 'keep-alive' });
    res.flushHeaders();

    try {
        req.query = JSON.parse(req.query?.data);
        await conversationApiSchema.validateAsync(req.query);

        const { message, id, realtime, autoThink } = req.query;
        const plugins = Array.isArray(req.query.plugins) ? req.query.plugins : [];
        const plugin = req.query.plugin;

        let parsedMessage = null;
        if (autoThink) {
            parsedMessage = await parseMessage(req, res);
        }

        let updatableMessage = message;

        if (plugin === 'internet_access') {
            updatableMessage = await innternet_plugin(updatableMessage);
        }

        let chat = await getAndUpdateChat(id, req.user._id, []);
        let chatCompletion = '';
        let finalized = false;

        const source = axios.CancelToken.source();
        const apiKey = apiKeys.length ? apiKeys[Math.floor(Math.random() * apiKeys.length)] : process.env.OPENAI_API_KEY;

        const done = async (data = {}, options = {}) => {
            if (finalized) return;
            finalized = true;

            if (options.aborted) {
                return;
            }

            const result = await getAndUpdateChat(chat._id, req.user._id, [{
                sender: req.user._id,
                recipient: 'GPT',
                text: message,
            }, {
                sender: 'GPT',
                recipient: req.user._id,
                images: data?.images || [],
                text: data?.chatCompletion,
                references: data?.references,
            }]);

            req.locals.input = updatableMessage;
            req.locals.inputRaw = message;
            req.locals.output = data?.chatCompletion;

            await new Promise((resolve) => creditPayment(req, res, resolve));
            await new Promise((resolve) => saveToHistory(req, res, resolve));

            await chatToRedisCache(result);

            if (!res.writableEnded) {
                res.write(`data: [DONE]\n\n`);
                res.end();
            }
        };

        const startSSE = async ({ references = [], prompt, resource = 'https://api.openai.com/v1/chat/completions', model, data }) => {
            await fetchSSE(resource, {
                method: 'POST',
                cancelToken: source.token,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                data: data || {
                    model: model || 'gpt-3.5-turbo',
                    stream: true,
                    messages: [
                        ...chat.messages.slice(-5).map(v => ({ role: v.sender === 'GPT' ? 'assistant' : 'user', content: v.text })),
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.2,
                    user: req.user._id,
                },
                onMessage: async (event) => {
                    if (event.data === '[DONE]') {
                        if (references.length) {
                            res.write(`data: ${JSON.stringify({ type: 'reference', references })}\n\n`);
                        }
                        await done({ chatCompletion, references });
                        return;
                    }

                    const chunk = JSON.parse(event.data || '{}');
                    const part = chunk?.choices?.[0]?.delta?.content || chunk?.choices?.[0]?.text || '';
                    chatCompletion += part;
                    res.write(`data: ${JSON.stringify({
                        id: 'chatcmpl-stream',
                        conversation_id: chat._id,
                        object: 'chat.completion.chunk',
                        model: 'gpt-3.5-turbo',
                        choices: [{ delta: { content: part }, index: 0, finish_reason: null }]
                    })}\n\n`);
                }
            });
        };

        if (parsedMessage?.type === 'image') {
            req.imageInfo = { prompt: message, n: 1 };
            await createImage(req);
            req.locals.imageUrls = req.images;
            res.write(`data: ${JSON.stringify({ type: 'image', images: req.images, conversation_id: chat._id })}\n\n`);
            await done({ images: req.images });
        } else if (realtime) {
            try {
                req.locals.creditsCost = 2;
                const results = await performSearch(message);
                const safeResults = Array.isArray(results) ? results : [];

                let prompt = `${message} for the context: `;
                for (let i = 0; i < safeResults.length; i++) {
                    prompt += `${safeResults[i].snippet || ''}\n`;
                }
                updatableMessage = prompt;
                await startSSE({ prompt, references: safeResults.map(result => result.link).filter(Boolean).slice(0, 4) });
            } catch {
                updatableMessage = message;
                await startSSE({ prompt: updatableMessage });
            }
        } else if (plugins.includes('DOC_QUERY')) {
            const token = getAccessToken({
                _id: req.user._id,
                email: req.user.email,
                customerId: req.user.customerId,
                accountType: req.user.accountType,
            });

            const query = await axios.post(`${process.env.DOC_QUERY_API_DOMAIN}/document/chat`, {
                model: 'gpt-3.5-turbo',
                question: updatableMessage,
                temperature: 0.5,
                chat_id: chat._id,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            const ans = query?.data?.answer || '';
            if (ans) {
                res.write(`data: ${JSON.stringify({
                    id: 'chatcmpl-doc-query',
                    conversation_id: chat._id,
                    object: 'chat.completion.chunk',
                    model: 'gpt-3.5-turbo',
                    choices: [{ delta: { content: ans }, index: 0, finish_reason: null }]
                })}\n\n`);
            }
            await done({ chatCompletion: ans });
        } else {
            await startSSE({ prompt: updatableMessage });
        }

        req.on('aborted', async () => {
            source.cancel();
            await done({ chatCompletion }, { aborted: true });
        });
    } catch (error) {
        const errorObj = {
            message: error?.message || 'Unexpected error',
            type: error?.type || 'internal_server_error',
        };

        if (!res.writableEnded) {
            res.write(`data: ${JSON.stringify({ error: errorObj })}\n\n`);
            res.write(`data: [DONE]\n\n`);
            res.end();
        }
    }
});

const chatToRedisCache = async (chat) => redisClient.set(`chat_gpt_${chat._id}`, JSON.stringify(chat));

async function performSearch(q) {
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: {
            q,
            cx: process.env.SEARCH_ENGINE_ID,
            key: process.env.GOOGLE_SEARCH_API_KEY,
            device: 'desktop'
        },
    });
    return response?.data?.items || [];
}

module.exports = app;
