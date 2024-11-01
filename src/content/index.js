import privacyHtml from "./privacyPolicyHtml"
import cookieHtml from "./cookieHtml"

class Content {
    contact = {
        heading: "Lets talk about everything!",
        email: "admin@domain.com"
    }
    privacyPolicyHtml = privacyHtml
    cookieHtml = cookieHtml
    FAQs = require("./FAQ")
}

export default new Content()