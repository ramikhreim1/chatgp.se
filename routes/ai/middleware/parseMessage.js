const openai = require("../../middlewares/openai");

module.exports = async (req) => {
    try {
        const messages = [
            {
                role: 'system',
                content: 'Classify the user request. Return only JSON: {"type":"image|text","realtime":false,"urls":[]} with no extra text.'
            },
            {
                role: 'user',
                content: req.query.message,
            }
        ];

        const { data } = await openai.chatComplete({
            model: 'gpt-3.5-turbo',
            messages,
            temperature: 0,
            user: req.user._id,
        });

        const raw = data?.choices?.[0]?.message?.content || '{}';
        const parsed = JSON.parse(raw);
        return {
            type: parsed?.type || 'text',
            realtime: Boolean(parsed?.realtime),
            urls: Array.isArray(parsed?.urls) ? parsed.urls : [],
        };
    } catch (error) {
        return null;
    }
};
