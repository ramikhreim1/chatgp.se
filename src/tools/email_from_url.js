import {
    ClipboardListIcon,
} from '@heroicons/react/solid'


const obj = {

    title: "Create an Email From URL",
    desc: `Enter a URL or TOPIC To
Generate Your Marketing Emails
Instantly With OpenAI GPT-4`,
    category: "Business",
    Icon: ClipboardListIcon,
    // tags: [],
    permissions: ['user'],

    to: "/ai/business/email_from_url",
    api: "/ai/business/email_from_url",

    fromColor: "blue-600",
    toColor: "yellow-500",

    output: {
        title: "Here is a preview of an email template:",
        desc: "Here is an example of a potential email template",
        // Icon: RefreshIcon,
        // color: "",
    },

    prompts: [{
        title: "Basic Email",
        desc: "Enter a URL to generate highly peronalized emails that sell your product or service.",
        // n: 1,
        prompts: [
            {
                title: "URL",
                attr: "url",
                value: "",
                placeholder: "https://chatgp.se/",
                label: "",
                type: "text",
                maxLength: 200,
                required: true,
                error: "",
                example: "https://chatgp.se/",
            },
            {
                title: "Type",
                attr: "type",
                value: "Simple Pitch",
                placeholder: "Simple Pitch",
                label: "",
                type: "dropdown",
                options: [
                    { value: 'Abandoned cart email', label: 'Abandoned cart' },
                    { value: 'Simple Pitch email', label: 'Simple Pitch' },
                    { value: 'Curiosity email', label: 'Curiosity' },
                    { value: 'Emotional story email', label: 'Emotional story' },
                    { value: 'Friendly email', label: 'Friendly' },
                    { value: 'Asking Feedback email', label: 'Asking Feedback' },
                    { value: 'Introduction email', label: 'Introduction' },
                    { value: 'special offer email', label: 'special offer' },
                    { value: 'Follow-up email', label: 'Follow-up' },
                    { value: 'Urgency email', label: 'Urgency' },
                ],
                required: true,
                error: "",
                example: "Asking Feedback",
            }
        ],
        example: {
            output: `Subject: Unlock the Power of AI Powered by OpenAI ChatGPT , GPT-4 API.

Dear [Name],

Are you looking to unlock the power of AI? Look no further than ChatGP.se Powerd by OpenAI. This revolutionary chatbot is designed to respond to text-based queries and generate natural language responses.

 is powered by OpenAI's language model, DALL·E, GPT-4, and more. With this advanced AI chatbot, you can easily create an AI assistant for your business.

Take advantage of this powerful technology and unlock the power of AI with Chat GP Turbo Plus.
            
Sincerely,
[Your Name]`,
        }
    },
    // {
    //     title: "Sale email",
    //     desc: "write a url.",
    //     prompts: [
    //         {
    //             title: "URL",
    //             attr: "url",
    //             value: "",
    //             placeholder: "https://example.com",
    //             label: "",
    //             type: "text",
    //             maxLength: 200,
    //             required: true,
    //             error: "",
    //             example: "https://example.com",
    //         },
    //         {
    //             title: "Type",
    //             attr: "type",
    //             value: "Abandoned cart",
    //             placeholder: "Asking Feedback",
    //             label: "",
    //             type: "dropdown",
    //             options: [
    //                 { value: 'Abandoned cart', label: 'Abandoned cart' },
    //                 { value: 'Simple Pitch', label: 'Simple Pitch' },
    //                 { value: 'Curiosity', label: 'Curiosity' },
    //                 { value: 'Emotional story', label: 'Emotional story' },
    //                 { value: 'Friendly', label: 'Friendly' },
    //                 { value: 'Asking Feedback', label: 'Asking Feedback' },
    //                 { value: 'Introduction', label: 'Introduction' },
    //                 { value: 'special offer', label: 'special offer' },
    //                 { value: 'Follow-up', label: 'Follow-up' },
    //                 { value: 'Urgency', label: 'Urgency' },
    //             ],
    //             required: true,
    //             error: "",
    //             example: "Asking Feedback",
    //         }
    //     ],
    //     example: {
    //         output: `Smith & Co is looking for a Junior Accoun.`,
    //     }
    // }
]

}

export default obj

