const  {getInformationFromUrl}=require("../../utils/getInfoFromUrl");

const plugin = async (message) => {
    try {
        // Check if the user's input contains a URL
        const urls = message.match(/(https?:\/\/[^\s]+)/g);
        if (urls) {
            for (const url of urls) {
                const websiteInfo = await getInformationFromUrl(url);
                if (!websiteInfo) throw new Error("failed to get information")
                // You can customize this message based on the extracted information
                const websiteSummary = `I found the following information about the website located at ${url}:
          Title: "${websiteInfo.title}"
          Meta Description: "${websiteInfo.meta}"
          H1 Tag: "${websiteInfo.h1}"
          H2 Tags: "${websiteInfo.h2}"
          Strong Tags: "${websiteInfo.strongTags}"
          
          Please create a completion tailored for individuals based on the provided website information.`;
                // Add the summary to the user's input before sending it to GPT-3
                message = message.replace(url, `${url} (${websiteSummary})`);
            }
            return message;
        } else {
            throw new Error("Plugin or url not available")
        }
    } catch (error) {
        return message
    }
}

module.exports = plugin