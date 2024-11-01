import {
    ViewListIcon,
} from '@heroicons/react/solid'

// IN this array you can add as many tools with categories and other information
// what are the limitation
//
const all = [
    {

        title: "Education: Create Engaging and Effective Educational Content with OpenAI AI.",
        desc: "Introducing our Education prompt templates for OpenAI AI! Our templates are designed to help you create engaging and effective educational content for your audience. Whether you're an educator, trainer, or expert in a particular field, our user-friendly interface makes it easy to produce high-quality materials that help people learn and acquire knowledge. Our templates are ideal for those with expertise in a particular subject, as well as communication skills and knowledge of multimedia content creation and instructional design principles. With our Education prompt templates, you can make an impact in the world of education and share your knowledge with others!",
        category: "Education",
        Icon: ViewListIcon,
        // tags: [],
        permissions: ['user'],

        fromColor: "yellow-400",
        toColor: "yellow-400",

        to: "/ai/all/educational_content_creator",//change this for every tool
        api: "/ai/all/educational_content_creator",//change this for every tool

        output: {
            title: "Educational Content",
            desc: "",
            Icon: false,
            color: "blue",
        },

        prompts: [{
            title: "Write a question",
            desc: "",
            prompts: [{
                title: "Content",
                attr: "content",
                value: "",
                placeholder: "I need help developing a lesson plan on renewable energy sources for high school students.",
                label: "",
                type: "textarea",
                required: true,
                error: "",
                example: "I need help developing a lesson plan on renewable energy sources for high school students..",
            },
            ],
            example: {
                output: "Here is a sample lesson plan on renewable energy sources for high school students:\n\nTitle: Exploring Renewable Energy Sources\n\nObjective: Students will be able to identify and describe different renewable energy sources and their benefits.\n\nMaterials:\n\n- PowerPoint presentation on renewable energy sources\n- Handouts on renewable energy sources\n- Internet access\n- Writing materials\n\nIntroduction (10 minutes):\n\n- Start the lesson by asking students what they know about renewable energy sources.\n- Present a brief overview of renewable energy sources and why they are important.\n- Provide an outline of the lesson and what will be covered.\n\nInstruction (30 minutes):\n\n- Introduce different renewable energy sources, including solar, wind, hydro, geothermal, and biomass.\n- Provide a detailed explanation of each energy source, including how it works and its benefits.\n- Show examples of renewable energy sources being used in different settings, such as solar panels on roofs, wind turbines in fields, and hydroelectric power plants.\n\nActivity (20 minutes):\n\n- Break students into groups of three or four.\n- Assign each group a renewable energy source to research and create a poster about.\n- Provide handouts with guiding questions and instructions for the poster.\n\nConclusion (10 minutes):\n\n- Ask each group to present their poster to the class.\n- Summarize the main points of the lesson, emphasizing the importance of renewable energy sources.\n- Provide a brief overview of future lessons and how they will build on what students have learned.\n\nAssessment:\n\n- Students will be assessed based on their participation in the group activity and their poster presentation.\n- Students can also be given a short quiz to test their knowledge of renewable energy sources.\n\nExtensions:\n\n- Students can research and write a short essay on a specific renewable energy source.\n- Students can conduct experiments or build models to demonstrate how renewable energy sources work.\n- Students can research current events related to renewable energy and present their findings to the class.",
                color: "blue",
            }
        }]

    }, {


        title: "Emails, Content Grammar Correction: Improving Your Multilingual Communications.",
        desc: " Emails, Content Grammar Correction prompt templates for OpenAI AI! Our templates are designed to help you communicate more clearly and effectively in multiple languages. Our AI-powered system can correct sentences, emails, and content in standard English, Swedish, French, Spanish, and Japanese, ensuring that your message is grammatically correct and easy to understand.",
        category: "Business",
        Icon: ViewListIcon,
        // tags: [],
        permissions: ['user'],

        fromColor: "blue-600",
        toColor: "yellow-500",

        to: "/ai/all/Emails_Content_Grammar_correction",//change this for every tool
        api: "/ai/all/Emails_Content_Grammar_correction",//change this for every tool

        output: {
            title: "Correcting Grammar...",
            desc: "",
            Icon: false,
            color: "blue",
        },

        prompts: [{
            title: "Write a question or past content",
            desc: "",
            prompts: [{
                title: "Content",
                attr: "content",
                value: "",
                placeholder: "Correct this to standard English: She no went to the market. Skriv detta på korrekt svenska: She no went to the market ",
                label: "",
                type: "textarea",
                required: true,
                error: "",
                example: "Correct this to standard Swedish: Hello, Me no speak English so good but me try. Me need help with something. Can you help me, please? Me sorry for bad English.Thank you.",
            },
            ],
            example: {
                output: "Hej, Jag talar inte så bra engelska men jag försöker. Jag behöver hjälp med något. Kan du hjälpa mig, snälla? Jag ber om ursäkt för dålig engelska. Tack.",
                color: "blue",
            }
        }]
    }, {

        title: "Marketing Campaign Development Prompts.",
        desc: " Use these prompts to develop effective marketing campaigns that utilize email newsletters, social media posts, digital ads and more. Whether you're promoting a new product or building brand awareness, these prompts will help you create campaigns that resonate with your target audience and achieve your marketing goals.",
        category: "Marketing, Finance",
        Icon: ViewListIcon,
        // tags: [],
        permissions: ['user'],

        fromColor: "pink-600",
        toColor: "yellow-500",

        to: "/ai/all/marketing_developing",//change this for every tool
        api: "/ai/all/marketing_developing",//change this for every tool

        output: {
            title: "Marketing..",
            desc: "The following key points detected",
            Icon: false,
            color: "blue",
        },

        prompts: [{
            title: "Ask to create newsletters, social media posts, digital ads",
            desc: "",
            prompts: [{
                title: "Content",
                attr: "content",
                value: "",
                placeholder: " Create a social media post to promote our new product launch. Our target audience is women aged 25-35 who are interested in fitness and wellness.",
                label: "",
                type: "textarea",
                required: true,
                error: "",
                example: "Create a social media post to promote our upcoming event. The event is a music festival and we want to attract a young audience aged 18-30. The post should include the date, location, and lineup.",
            },
            ],
            example: {
                output: "Thank you for your request!\n\nHere is a social media post you can use to promote your upcoming music festival:\n\nGet ready to rock at our upcoming music festival on August 21st!\n\nWe've got an incredible lineup of artists, including XYZ, ABC, and DEF.\n\nJoin us at Central Park for a day of music, food, and fun with your friends.\n\nTickets are selling fast, so grab yours now!\n\n #musicfestival #summerfun #goodvibes",
                color: "blue",
            }
        }]


    }, {

        title: "Sales Prompts: Crafting Effective Sales Pitches, Proposals, and Presentations.",
        desc: "The Sales Prompts template is designed to help users develop effective sales pitches, proposals, and presentations. With a focus on clear and persuasive communication, this template provides prompts for crafting engaging messages that resonate with potential customers. Whether you're pitching a new product or service, responding to a request for proposal, or delivering a presentation to stakeholders, these prompts will guide you in creating a compelling message that highlights your unique value proposition and addresses the needs of your target audience.",
        category: "Business",
        Icon: ViewListIcon,
        // tags: [],
        permissions: ['user'],

        fromColor: "blue-600",
        toColor: "yellow-500",

        to: "/ai/all/sales",//change this for every tool
        api: "/ai/all/sales",//change this for every tool

        output: {
            title: "Sales",
            desc: "The follwing points detected",
            Icon: false,
            color: "blue",
        },

        prompts: [{
            title: "Sales Prompts ",
            desc: "",
            prompts: [{
                title: "Content",
                attr: "content",
                value: "",
                placeholder: "I need a sales pitch for our new product to present to potential investors. Our product is a mobile app that helps users manage their finances",
                label: "",
                type: "textarea",
                required: true,
                error: "",
                example: "I need a sales pitch for our new product to present to potential investors. Our product is a mobile app that helps users manage their finances",
            },
            ],
            example: {
                output: "Thank you for your request! Here's a sales pitch you can use to present your new product to potential investors:\n\nIntroducing our revolutionary new mobile app that helps users manage their finances! With our app, you can easily track your expenses, set financial goals, and receive personalized tips on how to save money.\n\nOur user-friendly interface and powerful analytics make it easy to manage your finances on-the-go.\n\nPlus, our app is secure and reliable, so you can trust that your information is safe.\n\nJoin the millions of users who are already seeing success with our app, and take control of your finances today!",
                color: "blue",
            }
        }]

    }, {

        title: "Customer Service: Responding to Inquiries and Complaints.",
        desc: " Introducing our Customer Service prompt templates for OpenAI AI! Our templates are designed to help you respond to customer inquiries and complaints in a timely and professional manner. Our user-friendly interface allows you to easily generate responses that address common customer concerns, such as order tracking, refunds, and product information. With our prompt templates, you can provide high-quality customer service that exceeds expectations and builds customer loyalty.",
        category: "Business",
        Icon: ViewListIcon,
        // tags: [],
        permissions: ['user'],

        fromColor: "blue-600",
        toColor: "yellow-500",

        to: "/ai/all/customer_service",//change this for every tool
        api: "/ai/all/customer_service",//change this for every tool

        output: {
            title: " Customer Service Responding ...",
            desc: "",
            Icon: false,
            color: "blue",
        },

        prompts: [{
            title: "Past Customer Inquiries or Complaints",
            desc: "",
            prompts: [{
                title: "Content",
                attr: "content",
                value: "",
                placeholder: "Hello, I placed an order on your website two days ago and I haven't received any shipping information yet. Can you please provide an update on my order?",
                label: "",
                type: "textarea",
                required: true,
                error: "",
                example: "Reply : Hello, I received my order and there was a problem with the product. It arrived damaged and I would like to request a replacement or a refund.",
            },
            ],
            example: {
                output: "Hello! Thank you for bringing this to our attention. We are sorry to hear that your order arrived damaged. We would be happy to offer you a replacement or a refund for the product. To help us process your request as quickly as possible, please provide us with a photo of the damaged product and your order number. You can send this information to our customer service email at [insert email address]. Once we receive this information, we will be happy to process your request. Thank you for your understanding and we apologize for any inconvenience this may have caused.",
                color: "blue",
            }
        }]

    }, {

        title: "Efficiently Respond to Emails in Different Languages with Emails Writer.",
        desc: "Say goodbye to language barriers with our Emails Writer prompt templates for OpenAI AI! Our user-friendly interface makes responding to emails in a different language simple and efficient. Just provide the past email and your desired response in your own language, and our AI-powered system will generate a clear and concise response in the desired language. Try it now and communicate effectively with customers and colleagues worldwide!",
        category: "Business",
        Icon: ViewListIcon,
        // tags: [],
        permissions: ['user'],

        fromColor: "blue-600",
        toColor: "yellow-500",

        to: "/ai/all/Email_Writer",//change this for every tool
        api: "/ai/all/Email_Writer",//change this for every tool

        output: {
            title: "Writing/Reply email...",
            desc: "",
            Icon: false,
            color: "blue",
        },

        prompts: [{
            title: "Write Request: Past Email ",
            desc: "",
            prompts: [{
                title: "Content",
                attr: "content",
                value: "",
                placeholder: "Reply this email : Past the email here  or Reply this email in swedish: Past the email here ",
                label: "",
                type: "textarea",
                required: true,
                error: "",
                example: "Reply this email ask to reschedule the meeting till tomorrow: Dear Lars,\n\nI hope this email finds you well. I wanted to follow up on the offer I sent you last week and see if we can schedule a meeting to discuss the pricing further. Are you available to meet today after 1 PM?\n\nI believe that it would be beneficial for both of us to sit down and review the offer together. During the meeting, I can go over any questions you may have and provide more information about our products and services.\n\nPlease let me know if this time works for you or if you would like to schedule for a different time. I'm looking forward to discussing the offer with you and hopefully, we can come to a mutually beneficial agreement.\n\nThank you for considering our services and I look forward to hearing back from you soon.\n\nBest regards,\nJohn",
            },
            ],
            example: {
                output: "Dear John,\n\nThank you for your email.\n\nI apologize for the delay in responding. Unfortunately, I am tied up with another meeting today, but I am available tomorrow at any time convenient for you.\n\nCan we reschedule the meeting for tomorrow? Thank you for your understanding and I look forward to our meeting tomorrow.\n\nBest regards,\n\nJohn",
                color: "blue",
            }
        }]
    }, {

        title: "Social Media Influencer",
        desc: "Social Media Influencer will create content for various platforms such as Instagram, Twitter or YouTube and engage with followers in order to increase brand awareness and promote products or services.",
        category: "Marketing, Finance",
        Icon: ViewListIcon,
        // tags: [],
        permissions: ['user'],

        fromColor: "pink-600",
        toColor: "yellow-400",

        to: "/ai/all/social_media_influencer",//change this for every tool
        api: "/ai/all/social_media_influencer",//change this for every tool

        output: {
            title: "Social Media Influencer",
            desc: "",
            Icon: false,
            color: "blue",
        },

        prompts: [{
            title: "Write a question",
            desc: "",
            prompts: [{
                title: "Content",
                attr: "content",
                value: "",
                placeholder: "You are a Social Media Influencer hired by a beauty company to promote their latest makeup line.\n\nYour task is to create content for various platforms such as Instagram, Twitter, or YouTube and engage with followers in order to increase brand awareness and promote the products.\n\nWrite a 150-word post that you can use on any platform of your choice to promote the makeup line.",
                label: "",
                type: "textarea",
                required: true,
                error: "",
                example: "I need help creating an engaging campaign on Instagram to promote a new line of athleisure clothing.",
            },
            ],
            example: {
                output: `My suggestion is to create an eye-catching visual that showcases the athleisure clothing. Utilize bright colors, unique patterns, and interesting poses to draw in viewers. Additionally, create a hashtag for the campaign so that followers can join in on the conversation.
Once the visual is created, post it on Instagram and use captivating captions to explain the athleisure clothing. Make sure to include a link to the website so followers can purchase the items.
Engage with followers by responding to comments, running giveaways and contests, and creating polls. Encourage followers to post pictures of themselves wearing the athleisure clothing and use the hashtag. This will create more brand awareness and increase engagement.
Finally, use Instagram stories, IGTV, and other features to promote the athleisure clothing. Utilize influencers, if possible, to help spread the word.
By creating an engaging visual and utilizing the various features of Instagram, you can successfully promote your new line of athleisure clothing.`,
                color: "blue",
            }
        }]

    },
    {

        title: "Social Media Manager",
        desc: "A social media manager is responsible for creating, implementing, and managing an organization's social media strategy in order to increase brand awareness, engagement, and ultimately drive business results.",
        category: "Marketing, Finance",
        Icon: ViewListIcon,
        // tags: [],
        permissions: ['user'],

        fromColor: "pink-600",
        toColor: "yellow-400",

        to: "/ai/all/social_media_manager",//change this for every tool
        api: "/ai/all/social_media_manager",//change this for every tool

        output: {
            title: "Marketing",
            desc: "The following key points detected",
            Icon: false,
            color: "blue",
        },

        prompts: [{
            title: "Write a question",
            desc: "",
            prompts: [{
                title: "Content",
                attr: "content",
                value: "",
                placeholder: "primary goal is to boost brand awareness, engagement, and ultimately drive business results through effective management of social media channels. What steps will you take to achieve this?",
                label: "",
                type: "textarea",
                required: true,
                error: "",
                example: "As a social media manager, you are tasked with increasing the social media presence of a new e-commerce brand in the market. The brand operates in a niche industry with minimal social media presence. What steps will you take to create a social media strategy that increases brand awareness and drives sales?",
            },
            ],
            example: {
                output: "To achieve the goal of boosting brand awareness, engagement, and driving business results, I will take the following steps:\n\n1. Conduct a thorough assessment of the target audience and determine the most effective social media channels to target them.\n\n2. Develop a content strategy that aligns with the brand values and caters to the needs of the target audience.\n\n3. Create a content calendar that reflects the content strategy and ensures a constant flow of content across different social media channels.\n\n4. Monitor and analyze the performance of the social media channels to identify areas of improvement and opportunities to engage with the target audience.\n\n5. Engage with the audience through comments, replies, and other social media activities to cultivate a community around the brand.\n\n6. Collaborate with other stakeholders in the organization to ensure that the social media strategy aligns with the overall business strategy.\n\n7. Keep abreast of the latest trends and best practices in social media marketing to continually optimize the social media strategy.\n\nBy following these steps, I aim to create a comprehensive and effective social media strategy that boosts brand awareness, engagement, and drives business results for the organization.",
                color: "blue",
            }
        }]

    },

    {

        title: "Storyteller",
        desc: "An educational content creator is someone who produces educational materials to help people learn and acquire knowledge. They need expertise in a particular subject, communication skills, and knowledge of multimedia content creation and instructional design principles.",
        category: "Education",
        Icon: ViewListIcon,
        // tags: [],
        permissions: ['user'],

        fromColor: "yellow-400",
        toColor: "yellow-400",

        to: "/ai/all/storyteller",//change this for every tool
        api: "/ai/all/storyteller",//change this for every tool

        output: {
            title: "Storyteller",
            desc: "",
            Icon: false,
            color: "blue",
        },

        prompts: [{
            title: "Ask a story.",
            desc: "",
            prompts: [{
                title: "Content",
                attr: "content",
                value: "",
                placeholder: "Ask here.",
                label: "",
                type: "textarea",
                required: true,
                error: "",
                example: "Jungle book",
            },
            ],
            example: {
                output: `Once upon a time, in a distant jungle, lived a small boy named Mowgli. He was raised by a pack of wolves, and despite the fact that he was not a wolf himself, he was accepted and loved by the pack.
One day, a fierce tiger named Shere Khan came to the jungle. He was furious that the wolves were protecting Mowgli and vowed to kill him.
The wolves were scared and wanted Mowgli to leave the jungle, but Mowgli was determined to stay and fight. He gathered his courage and set out to confront Shere Khan.
Mowgli was brave, but he was no match for the powerful tiger. Shere Khan easily overpowered him and was about to kill him when a huge bear named Baloo came to Mowgli's rescue.
Baloo and Shere Khan fought fiercely, but in the end, Baloo was victorious. Shere Khan was defeated and ran away from the jungle, never to be seen again.
 Mowgli was safe, and the wolves accepted him as one of their own. From then on, Mowgli was known for his courage and perseverance in the face of danger. He had proven that even the smallest creature can stand up to the biggest threat when they have the courage and determination to do so.`,
                color: "blue",
            }
        }]

    },
    {

        title: "läxhjälpen",
        desc: "En GPT-4 Powered mall kan hjälpa dig i Matte, kemi, fysik, SO, svenska och historia på läxhjälpen hos nya GPT-4 Powered www.Chatgp.se i Stockholm.",
        category: "Content",
        Icon: ViewListIcon,
        // tags: [],
        permissions: ['user'],

        fromColor: "yellow-400",
        toColor: "yellow-400",

        to: "/ai/all/läxhjälpen",//change this for every tool
        api: "/ai/all/läxhjälpen",//change this for every tool

        output: {
            title: "Educational Content",
            desc: "",
            Icon: false,
            color: "blue",
        },

        prompts: [{
            title: "Kopiera dessa promptexempel för att få hjälp med dina läxor. Använd dem sedan i Chat GP på https://chatgp.se/ai/ChatGPT.",
            desc: "",
            prompts: [{
                title: "Content",
                attr: "content",
                value: "",
                placeholder: "Jag förstår inte hur man löser ekvationer med två okända med exempel",
                label: "",
                type: "textarea",
                required: true,
                error: "",
                example: "Jag förstår inte hur man löser ekvationer med två okända med exempel.\n\n",
            },
            ],
            example: {
                output: "Student: Hej, kan du hjälpa mig med matte?\n\nChat GP: Absolut! Vad är det du behöver hjälp med?\n\nStudent: Jag förstår inte hur man \n\nlöser ekvationer med två okända.\n\nChat GP: Visst, jag kan hjälpa dig med det. Kan du ge mig ett exempel på en ekvation med två\n\nokända som du har svårt att lösa?\n\nStudent: Sure, jag har svårt med den här ekvationen: 2x + 3y = 12 och 4x - 2y = 6.\n\nChat GP: Okej, för att lösa denna typ av ekvationer med två okända, kan vi använda substitution eller elimination. Vilken metod vill \n\ndu använda?\n\nStudent: Jag är inte säker, vilken metod är enklare?\n\nChat GP: Det beror på ekvationerna själva och vilken som \n\npassar dig bäst. Men i det här fallet kan vi använda elimination. Om vi multiplicerar den första ekvationen med 2 och den andra \n\ned 3, så kan vi eliminera y. Det ger oss 4x + 6y = 24 och 12x - 6y = 18. Om vi nu adderar dessa två ekvationer får vi 16x = 42, \n\nvilket ger oss x = 2.625. Nu kan vi använda x-värdet för att lösa för y. Om vi sätter in x = 2.625 i den första ekvationen, så får \n\nvi 2 * 2.625 + 3y = 12, vilket ger oss y = 1.25.\n\nStudent: Tack så mycket, nu förstår jag det mycket bättre!\n\nChat GP: Det var så lite så! Hör av dig igen om du behöver mer hjälp.",
                color: "blue",
            }
        }]

    },
    {

        title: "Financial Planning and Budgeting Prompts.",
        desc: "These GPT-4 Powered prompts will help you plan and manage your finances, whether you're a business owner looking to create a budget or an individual seeking to better manage your personal finances. Simply provide some basic information about your financial situation and goals, and receive personalized prompts to help you develop a solid financial plan and make informed financial decisions. What is your main financial goal or concern right now?",
        category: "Business",
        Icon: ViewListIcon,
        // tags: [],
        permissions: ['user'],

        fromColor: "blue-600",
        toColor: "yellow-500",

        to: "/ai/all/finance",//change this for every tool
        api: "/ai/all/finance",//change this for every tool

        output: {
            title: "Finance: Budgeting and Financial Planning",
            desc: "The following key points detected",
            Icon: false,
            color: "blue",
        },

        prompts: [{
            title: "Write prompts to help you plan and manage your finances",
            desc: "",
            prompts: [{
                title: "Content",
                attr: "content",
                value: "",
                placeholder: "I need help creating a budget for my small business. I have expenses for rent, utilities, supplies, and payroll. Can you help me create a budget that will allow me to track my expenses and ensure profitability?",
                label: "",
                type: "textarea",
                required: true,
                error: "",
                example: "Create a monthly budget for my business. We have a revenue of $50,000 and our expenses include rent, utilities, payroll, and supplies.",
            },
            ],
            example: {
                output: "Thank you for your request! Here is a monthly budget for your business based on the information provided:\n\nRevenue: $50,000\n\nExpenses:\n\nRent: $10,000\n\nUtilities: $2,000\n\nPayroll: $25,000\n\nSupplies: $5,000\n\nTotal Expenses: $42,000\n\nProfit: $8,000\n\nBased on this budget, you have a profit of $8,000 each month. However, you may want to consider reducing your expenses to increase your profit margin. Let us know if you need any further assistance with your finances!",
                color: "blue",
            }
        }]

    },
    // {

    //     title: "Educational Content Creator",
    //     desc: "An educational content creator is someone who produces educational materials to help people learn and acquire knowledge. They need expertise in a particular subject, communication skills, and knowledge of multimedia content creation and instructional design principles.",
    //     category: "High Ticket Selling",
    //     Icon: ViewListIcon,
    //     // tags: [],
    //     permissions: ['user'],

    //     fromColor: "yellow-400",
    //     toColor: "yellow-400",

    //     to: "/ai/all/educational_content_creator",//change this for every tool
    //     api: "/ai/all/educational_content_creator",//change this for every tool

    //     output: {
    //         title: "Educational Content",
    //         desc: "",
    //         Icon: false,
    //         color: "blue",
    //     },

    //     prompts: [{
    //         title: "Write a question",
    //         desc: "",
    //         prompts: [{
    //             title: "Content",
    //             attr: "content",
    //             value: "",
    //             placeholder: "Educational Content Creator",
    //             label: "",
    //             type: "textarea",
    //             required: true,
    //             error: "",
    //             example: "Give an example of an educational content creator.",
    //         },
    //         ],
    //         example: {
    //             output: "An example of an educational content creator is Crash Course, a YouTube channel that produces engaging and informative video lessons on a wide range of topics, including science, history, economics, and more. The creators of Crash Course use their expertise in these subjects to create high-quality video content that is accessible and enjoyable for learners of all levels.",
    //             color: "blue",
    //         }
    //     }]

    // },
    // {

    //     title: "Educational Content Creator",
    //     desc: "An educational content creator is someone who produces educational materials to help people learn and acquire knowledge. They need expertise in a particular subject, communication skills, and knowledge of multimedia content creation and instructional design principles.",
    //     category: "Marketing Strategy",
    //     Icon: ViewListIcon,
    //     // tags: [],
    //     permissions: ['user'],

    //     fromColor: "yellow-400",
    //     toColor: "yellow-400",

    //     to: "/ai/all/educational_content_creator",//change this for every tool
    //     api: "/ai/all/educational_content_creator",//change this for every tool

    //     output: {
    //         title: "Educational Content",
    //         desc: "",
    //         Icon: false,
    //         color: "blue",
    //     },

    //     prompts: [{
    //         title: "Write a question",
    //         desc: "",
    //         prompts: [{
    //             title: "Content",
    //             attr: "content",
    //             value: "",
    //             placeholder: "Educational Content Creator",
    //             label: "",
    //             type: "textarea",
    //             required: true,
    //             error: "",
    //             example: "Give an example of an educational content creator.",
    //         },
    //         ],
    //         example: {
    //             output: "An example of an educational content creator is Crash Course, a YouTube channel that produces engaging and informative video lessons on a wide range of topics, including science, history, economics, and more. The creators of Crash Course use their expertise in these subjects to create high-quality video content that is accessible and enjoyable for learners of all levels.",
    //             color: "blue",
    //         }
    //     }]

    // },
    // {

    //     title: "Educational Content Creator",
    //     desc: "An educational content creator is someone who produces educational materials to help people learn and acquire knowledge. They need expertise in a particular subject, communication skills, and knowledge of multimedia content creation and instructional design principles.",
    //     category: "Management",
    //     Icon: ViewListIcon,
    //     // tags: [],
    //     permissions: ['user'],

    //     fromColor: "yellow-400",
    //     toColor: "yellow-400",

    //     to: "/ai/all/educational_content_creator",//change this for every tool
    //     api: "/ai/all/educational_content_creator",//change this for every tool

    //     output: {
    //         title: "Educational Content",
    //         desc: "",
    //         Icon: false,
    //         color: "blue",
    //     },

    //     prompts: [{
    //         title: "Write a question",
    //         desc: "",
    //         prompts: [{
    //             title: "Content",
    //             attr: "content",
    //             value: "",
    //             placeholder: "Educational Content Creator",
    //             label: "",
    //             type: "textarea",
    //             required: true,
    //             error: "",
    //             example: "Give an example of an educational content creator.",
    //         },
    //         ],
    //         example: {
    //             output: "An example of an educational content creator is Crash Course, a YouTube channel that produces engaging and informative video lessons on a wide range of topics, including science, history, economics, and more. The creators of Crash Course use their expertise in these subjects to create high-quality video content that is accessible and enjoyable for learners of all levels.",
    //             color: "blue",
    //         }
    //     }]

    // },
    // {

    //     title: "Educational Content Creator",
    //     desc: "An educational content creator is someone who produces educational materials to help people learn and acquire knowledge. They need expertise in a particular subject, communication skills, and knowledge of multimedia content creation and instructional design principles.",
    //     category: "Ad Copy",
    //     Icon: ViewListIcon,
    //     // tags: [],
    //     permissions: ['user'],

    //     fromColor: "yellow-400",
    //     toColor: "yellow-400",

    //     to: "/ai/all/educational_content_creator",//change this for every tool
    //     api: "/ai/all/educational_content_creator",//change this for every tool

    //     output: {
    //         title: "Educational Content",
    //         desc: "",
    //         Icon: false,
    //         color: "blue",
    //     },

    //     prompts: [{
    //         title: "Write a question",
    //         desc: "",
    //         prompts: [{
    //             title: "Content",
    //             attr: "content",
    //             value: "",
    //             placeholder: "Educational Content Creator",
    //             label: "",
    //             type: "textarea",
    //             required: true,
    //             error: "",
    //             example: "Give an example of an educational content creator.",
    //         },
    //         ],
    //         example: {
    //             output: "An example of an educational content creator is Crash Course, a YouTube channel that produces engaging and informative video lessons on a wide range of topics, including science, history, economics, and more. The creators of Crash Course use their expertise in these subjects to create high-quality video content that is accessible and enjoyable for learners of all levels.",
    //             color: "blue",
    //         }
    //     }]

    // }
]
export default all;