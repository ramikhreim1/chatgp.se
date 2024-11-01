const { Configuration, OpenAIApi } = require("openai");
const { v2: cloudinary } = require('cloudinary');
const sharp = require("sharp")

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = async (req) => {
    const { prompt, n, size } = req.imageInfo
    try {
        console.log("creating image");
        const aiResponse = await openai.createImage({
            prompt: prompt,
            n: n || 1,
            size: size || '1024x1024',
            model: 'dall-e-3',
            quality: 'hd', // or 'standard'
            style: 'vivid', // or 'natural'
            response_format: 'b64_json',
        });
        var transformer = await sharp(Buffer.from(aiResponse.data.data[0].b64_json, 'base64')).toFormat("jpeg").toBuffer();
        const b64 = await transformer.toString("base64")
        const photoUrl = await cloudinary.uploader.upload("data:image/jpeg;base64," + b64);
        console.log(photoUrl);
        req.images = [{ url: photoUrl.secure_url, public_id: photoUrl.public_id }];
    } catch (error) {
        console.log("error:  ", error);
        req.images = []
    }
}
