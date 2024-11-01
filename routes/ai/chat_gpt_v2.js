const express = require('express');
const app = express.Router();
const { conversationApiSchema } = require('../utils/schemas');
const { fetchSSE } = require('./middleware/SSE');
const { default: axios } = require('../../node_modules/axios/index');
const redisClient = require('../utils/redis');
const getAndUpdateChat = require('./middleware/updateChat');
const innternet_plugin = require("./middleware/internet_plugin");
const { creditPayment } = require('./middleware/index');
const { saveToHistory } = require('./middleware/index');
const parseMessage = require('./middleware/parseMessage');
const createImage = require('./middleware/createImage');
const { queryUrl } = require('../utils/getInfoFromUrl');
const getAccessToken = require("../utils/getaccesstoken")

// load distributing to three apis
const apiKeys = [process.env.OPENAI_API_KEY_1, process.env.OPENAI_API_KEY_2, process.env.OPENAI_API_KEY_3];

app.get('/conversation', async (req, res) => {
    // setting headers for SSE
    console.log(req.query);
    res.set({ 'Cache-Control': 'no-cache', 'Content-Type': 'event-stream', 'Connection': 'keep-alive' });
    res.flushHeaders();
    console.log(`${req.user.email} initiated event-stream`)
    try {
        req.query = JSON.parse(req.query?.data)
        await conversationApiSchema.validateAsync(req.query);
        const { message, model, id, realtime, autoThink, plugins } = req.query;
        let parsedMessage = null
        if (autoThink) {
            parsedMessage = await parseMessage(req, res)
        }
        console.log(plugins);

        console.log("parsedMessage: ", parsedMessage);

        let updatableMessage = message

        if (req.query.plugin === "internet_access") {
            updatableMessage = await innternet_plugin(updatableMessage)
        }

        let chat = null
        // redish cache
        try {
            console.log(`${req.user.email} requesting redis cache`)
            // const redishChat = await getChatFromRedisCache(id);
            // if (!redishChat) throw new Error("Chat from redish cache not found");
            // chat = JSON.parse(redishChat)
        } catch (error) {
            console.error("Error from redis cache: ", error)
        }
        if (!chat) {
            console.log(`${req.user.email} requesting Chat from database`)
            chat = await getAndUpdateChat(id, req.user._id, []);
        }


        let chatCompletion = "";
        var done = async (data) => {
            console.log(data?.images);
            try {
                const result = await getAndUpdateChat(chat._id, req.user._id, [{
                    sender: req.user._id,
                    recipient: "GPT",
                    text: message
                }, {
                    sender: "GPT",
                    recipient: req.user._id,
                    images: data?.images || [],
                    text: data?.chatCompletion,
                    references: data?.references
                }])
                // save to history
                // make credit payment
                req.locals.input = updatableMessage
                req.locals.inputRaw = message
                req.locals.output = data?.chatCompletion
                creditPayment(req, res, () => { console.log(`${req.user.email} payed credits`) })
                saveToHistory(req, res, () => { console.log(`${req.user.email} saved to history`) })
                chatToRedisCache(result);
                console.log(`${req.user.email} saved to redis`)
                res.write(`data: [DONE]\n\n`)
                res.end()
            } catch (error) {
                throw new Error(error)
            }
        }

        console.log(`${req.user.email} prompt: ${message}`)
        console.log(`${req.user.email} input prompt: ${updatableMessage}`)
        const apiKey = apiKeys[Math.floor(Math.random() * 3)]
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        const startSSE = async ({ type, references = [], prompt, recource = 'https://api.openai.com/v1/chat/completions', model, data }) => { // resource default to chat
            console.log(`${req.user.email} using api key: ${apiKey}`)
            await fetchSSE(recource, {
                method: 'POST',
                cancelToken: source.token,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                data: data || {
                    model: model || "gpt-3.5-turbo",
                    stream: true,
                    messages: [...chat.messages.slice(-5).map(v => ({ role: v.sender === "GPT" ? "system" : "user", content: v.text })), { role: "user", content: prompt }],
                    temperature: 0.2,
                    user: req.user._id,
                },
                onMessage: (event) => {
                    if (event.data === '[DONE]') {
                        if (references.length) {
                            res.write(`data: ${JSON.stringify({
                                type: "reference",
                                references
                            })}\n\n`)
                        }
                        console.log(`${req.user.email} Event sream ended with response: ${chatCompletion}`)
                        done({
                            chatCompletion, type: type, references: references
                        })
                    } else {
                        const data = JSON.parse(event.data)
                        if (data) {
                            const part = data?.choices?.[0]?.delta?.content || data?.choices?.[0]?.text || ""
                            chatCompletion += part
                            res.write(`data: ${JSON.stringify({ "id": "chatcmpl-7Lp5FpUT2IA0fmSkAU8xcD1Tn3bae", "conversation_id": chat._id, "object": "chat.completion.chunk", "created": 1685435609, "model": "gpt-3.5-turbo", "choices": [{ "delta": { "content": part }, "index": 0, "finish_reason": null }] })}\n\n`)
                        }
                    }
                }
            })
        }

        if (parsedMessage?.type === 'image') {
            req.imageInfo = { prompt: message, n: 1 } // n=1 for 1 image 
            // res.write(`data: ${JSON.stringify({ type: "action", message: "Generating image..." })}\n\n`);
            await createImage(req);
            req.locals.imageUrls = req.images
            res.write(`data: ${JSON.stringify({ type: "image", images: req.images, conversation_id: chat._id })}\n\n`);
            done({ images: req.images })
        } else if (realtime) {
            try {
                // req.locals.creditsCost = 2 // 2 times more cost
                // res.write(`data: ${JSON.stringify({ type: "action", message: "Searching Live..." })}\n\n`);
                // // handle realtime generation 
                // const results = await performSearch(message)
                // const resultsSlices = results.slice(0, 4)
                // console.log("started");
                // const result = await new Promise((resolve, reject) => {
                //     const scrapedData = []
                //     const index = { j: 0 }
                //     for (let i = 0; i <= resultsSlices.length - 1; i++) {
                //         const result = resultsSlices[i];
                //         getLivePrompt(result, message, scrapedData, resultsSlices.length - 1, index, resolve, reject)
                //     }
                // })
                // console.log("ended :", result);
                // const bestMatch = await axios.post(`${process.env.QUERY_PDF_URL}/query-text`, {
                //     n: 10,
                //     query: message,
                //     word_length: 100,
                //     chunks: result
                // }, {
                //     headers: {
                //         'Content-Type': 'application/json',
                //         'x-api-key':process.env.QUERY_PDF_KEY
                //     }
                // });
                // let prompt = ''
                // bestMatch.data?.top_10_chunks?.push(...results.map(v => v.snippet))
                // bestMatch.data?.top_10_chunks?.forEach((match) => {
                //     prompt = prompt + `${match}\n`
                // })
                // updatableMessage = `google search result: ${prompt}\n\nanswer based on the google search result\n\n${message}`;
                // console.log(updatableMessage);
                // await startSSE({ prompt: `google search result: ${prompt}\n\nanswer based on the google search result\n\n${message}`, references: resultsSlices.map(result => result.link) })

                req.locals.creditsCost = 2 // 2 times more cost
                const results = await performSearch(message)
                let prompt = message + " for the context: "
                for (let i = 0; i < results.length; i++) {
                    const { snippet } = results[i];
                    prompt += snippet + "\n"
                }
                updatableMessage = prompt;
                await startSSE({ prompt: prompt, references: results.map(result => result.link).slice(0, 4) })

            } catch (error) {
                console.log(error);
                updatableMessage = message;
                // res.write(`data: ${JSON.stringify({ type: "action", message: "Asking chatgpt..." })}\n\n`);
                await startSSE({ prompt: updatableMessage })
            }

        } else if (plugins.includes('DOC_QUERY')) {
            const token = getAccessToken({
                _id: req.user._id,
                email: req.user.email,
                customerId: req.user.customerId,
                accountType: req.user.accountType
            })

            const query = await axios.post(`${process.env.DOC_QUERY_API_DOMAIN}/document/chat`,
                {
                    "model": "gpt-3.5-turbo",
                    "question": updatableMessage,
                    "temperature": 0.5,
                    "chat_id": chat._id
                }
                , {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
            const ans = query.data.answer
            if (query.data) {
                res.write(`data: ${JSON.stringify({ "id": "chatcmpl-7Lp5FpUT2IA0fmSkAU8xcD1Tn3bae", "conversation_id": chat._id, "object": "chat.completion.chunk", "created": 1685435609, "model": "gpt-3.5-turbo", "choices": [{ "delta": { "content": ans }, "index": 0, "finish_reason": null }] })}\n\n`)
            }
            done({
                chatCompletion:ans
            })

        } else {
            await startSSE({ prompt: updatableMessage })
        }

        req.on('aborted', () => {
            source.cancel()
            done({ chatCompletion })
            console.log(`${req.user.email} canceled request`)
        })

        return
    } catch (error) {
        console.log(error);
        let errorObj = {}
        if (error.response) {
            await error.response.data.on('data', (e) => {
                errorObj = JSON.parse(e.toString());
                console.log("error: ", errorObj);
                res.write(`data: ${JSON.stringify({ error: errorObj })}\n\n`)
                res.write(`data: [DONE]\n\n`)
                res.end()
            });
        } else if (error.error) {
            console.log("got");
            errorObj.message = error.error.message
            errorObj.type = error.error.type
            res.write(`data: ${JSON.stringify({ error: errorObj })}\n\n`)
            res.write(`data: [DONE]\n\n`)
            res.end()
        } else {
            console.log("error: ", errorObj);
            errorObj.message = error.message
            errorObj.type = "internal_server_error"
            res.write(`data: ${JSON.stringify({ error: errorObj })}\n\n`)
            res.write(`data: [DONE]\n\n`)
            res.end()
        }
        return
    }
});

const chatToRedisCache = async (chat) => redisClient.set(`chat_gpt_${chat._id}`, JSON.stringify(chat));

const getChatFromRedisCache = async (chatId) => await redisClient.get(`chat_gpt_${chatId}`);

async function performSearch(q) {
    try {
        const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
            params: {
                q: q,
                cx: process.env.SEARCH_ENGINE_ID,
                key: process.env.GOOGLE_SEARCH_API_KEY,
                device: "desktop"
            },
        });
        const results = response.data.items;
        return results
    } catch (error) {
        throw error
    }
}


const getLivePrompt = async (googleResult, query, allDataRecord, length, index, resolve, reject) => {
    try {
        const bestMatches = await queryUrl(googleResult.formattedUrl, query)
        allDataRecord.push(...bestMatches)
        if (length === index.j) {
            resolve(allDataRecord)
        }
        index.j++
    } catch (error) {
        reject(error)
    }
}

module.exports = app;
