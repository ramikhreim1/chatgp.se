import {
    ViewListIcon,
} from '@heroicons/react/solid'


const chatGpt = {
    title: "Powered by ChatGPT API Turbo Plus",
    desc: "GPT-4 with super powers with OpenAI API, Like Chat Turbo Plus Plus but with internet access, references, AI image generation and not limited to 2021, integrates with Google/Bing Search to create content with the latest information, GPT-4 is OpenAI’s most advanced system, producing safer and more useful responses, GPT-4 can solve difficult problems with greater accuracy.",
    category: "Powered by ChatGPT API",
    Icon: ViewListIcon,
    // tags: [],
    permissions: ['user'],

    fromColor: "gray-500",
    toColor: "gray-500",

    to: "/ai/ChatGPT?model=gpt-3.5-turbo",
    api: "/ai/ChatGPT?model=gpt-3.5-turbo",

    output: {
        title: "Example",
        desc: "The following key points detected",
        Icon: false,
        color: "blue",
    },

    prompts: [{
        title: "chat",
        desc: "A message",
        min: 1,
        prompts: [{
            title: "Content",
            attr: "content",
            value: "",
            placeholder: "Write here...",
            label: "",
            type: "text",
            min: 1,
            required: true,
            error: "",
            example: "Hello World ",
        },
        ],
        example: {
            output: "Hello World Hello World Hello World Hello World Hello World Hello World Hello World ",
            outputs: [
            	"The sun is very old, over 4.5 billion years",
            	"At 10,000 degrees, sun is also very hot",
            	"Gasses called coronal mass ejections erupt from the sun",
            ],
            // Icon: RefreshIcon,
            color: "blue",
        }
    }]

}

export default chatGpt

