const openai = require("../../middlewares/openai");

module.exports = async (req) => {
    try {
        const prompt = `define this in to a JSON data:

Example: create an 3D render of a floating futuristic castle in a clear sky, digital art.
Output: {"type":"image","realtime":false,"urls":[]}
Example: what is the meaning of life?.
Output: {"type":"text","realtime":false,"urls":[]}
${req.query.message}`
        const { data } = await openai.complete({
            engine: 'gpt-3.5-turbo-instruct',
            prompt: prompt,
            maxTokens: 777,
            temperature: 0,
            topP: 1,
            frequencyPenalty: 0,
            presencePenalty: 0,
            bestOf: 1,
            n: 1,
            user: req.user._id,
            stream: false,
            stop: ["###", "<|endoftext|>",],
        });
        console.log("data.choices[0].text", data.choices[0].text);
        return JSON.parse(data.choices[0].text.split("Output: ")[1])
    } catch (error) {
        console.log(error);
        return null;
    }
}
