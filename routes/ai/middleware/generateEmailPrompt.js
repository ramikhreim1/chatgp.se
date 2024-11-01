const {getInformationFromUrl} = require("../../utils/getInfoFromUrl")


const generateEmailPrompt = async (req, res, next) => {
    try {
        const { url, type, currentPrompt } = req.body

        if (!url) throw new Error("URL required")
        if (!type) throw new Error("Type required")

        if (currentPrompt === "Basic Email") {
            let infoObject =await getInformationFromUrl(url)

            if (!infoObject) throw new Error("failed to get information")

            req.prompt = `Generate an email for ${type} using the following website content:\n title is ${infoObject.title}, meta tags are ${infoObject.meta}, h1 tag is ${infoObject.h1}, strong tags are ${infoObject.strongTags}   \n. Please make sure the email has an appropriate tone, style, and purpose for the given type of email.`
        } else if (currentPrompt === "Sale email") {
            req.prompt = ""
        } else {
            req.prompt = ""
        }
        next()
    } catch (error) {
        console.log("error generating prompt for email:", error);
        res.status(500).json({
            success: false,
            message: error.message || "something went wrong!"
        });
        return
    }
}

module.exports = generateEmailPrompt;