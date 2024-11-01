import {
    ViewListIcon,
} from '@heroicons/react/solid'


const obj = {

    title: "Skriv innehåll eller argumenterande text",
    desc: "Skriv ämnet för ditt innehåll eller argumenterande text, GPT-4 Powered kommer att skriva ett upphovsrättsskyddat unikt innehåll åt dig!",
    category: "Content",
    Icon: ViewListIcon,
    // tags: [],
    permissions: ['user'],

	fromColor: "green-500",
	toColor: "blue-500",

    to: "/ai/blog",
    api: "/ai/blog",

    output: {
        title: "Ämne",
        desc: "Följande nyckelpunkter har upptäckts",
        Icon: false,
        color: "blue",
    },

    prompts: [{
        title: "Inmatningstext",
        desc: "En mening eller ett stycke som du vill skriva en artikel eller bloggformulär.",
        // n: 1,
        prompts: [{
            title: "Content",
            attr: "content",
            value: "",
            placeholder: "Skriv en argumenterande text om svenska språket",
            label: "",
            type: "textarea",
            maxLength: 600,
            // max: 100,
            min: 3,
            required: true,
            error: "",
            example: "Skriv en argumenterande text om svenska språket ",
        },
        ],
        example: {
            output: "Svenska språket är en av de officiella språken i Sverige och talas av cirka 10 miljoner människor i hela världen. Det är ett rikt språk med en lång och intressant historia. I denna argumenterande text ska jag diskutera varför svenska språket är viktigt och varför det är viktigt att bevara det, För det första är det viktigt att värna om svenska språket för att bevara vår kultur och vårt kulturarv. Språket har utvecklats över tid och har påverkats av historiska händelser och samhälleliga förändringar. Det är en del av vårt nationella arv och vår identitet. Genom att bevara och använda svenska språket, bidrar vi till att bevara vår kultur och historia för framtida generationer. ",
            // outputs: [
            // 	"The sun is very old, over 4.5 billion years",
            // 	"At 10,000 degrees, sun is also very hot",
            // 	"Gasses called coronal mass ejections erupt from the sun",
            // ],
            // Icon: RefreshIcon,
            color: "blue",
        }
    }]

}

export default obj

