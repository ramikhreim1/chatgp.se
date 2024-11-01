import React, { Component } from 'react';
import { observer, inject, } from 'mobx-react';
import { observable, makeObservable, action, } from 'mobx'
import { withRouter } from 'react-router-dom';
import { DuplicateIcon, ExclamationCircleIcon } from '@heroicons/react/outline'
import Select from 'react-select';
import { useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import ReactMarkdown from 'react-markdown'
import "./Chat_v2.css"
import styled from 'styled-components';
import Popup from 'reactjs-popup';
import { ChatGPProvider } from './Content/Provider';
import Sidebar from './chat_v2/sidebar';
import Input from './chat_v2/input';
import CurrentChat from './chat_v2/CurrentChat';
import remarkGfm from 'remark-gfm'
import { useEffect } from 'react';
import rehypeRaw from "rehype-raw";

import hljs from 'highlight.js';
import 'highlight.js/styles/base16/dracula.css'
import { useRef } from 'react';
import { useMemo } from 'react';
import toast from 'react-hot-toast';


@inject('store')
@observer
class Chat_v2 extends Component {

    @observable model = null;
    @observable plugin = null;
    @observable PreMessage = "";
    @observable conversations = [];
    @observable currentConversation = null;
    @observable typing = false
    @observable error = ""
    @observable message = ""
    @observable autoThink = false
    @observable welcomePopup = false
    controller;

    constructor(props) {
        super(props)
        makeObservable(this)
        const modelFromParam = new URLSearchParams(window.location.search).get("model")
        const chat_id = new URLSearchParams(window.location.search).get("current_chat")
        if (modelFromParam) {
            this.setModel({ value: modelFromParam })
        }
        if (this.props.store.isLoggedIn)
            this.props.store.api.get("/chat").then(conversations => {
                this.conversations = conversations.data
                if (chat_id) {
                    const index = this.findIndexOfMatchingElement(conversations.data, (obj) => obj._id === chat_id)
                    if (index !== -1)
                        this.currentConversation = index
                }
            })
    }

    findIndexOfMatchingElement(arr, condition) {
        for (let i = 0; i < arr.length; i++) {
            if (condition(arr[i])) {
                return i; // Return the index of the matching element
            }
        }
        return -1; // Return -1 if no matching element is found
    }

    setModel = (model) => {
        if (model.value === 'gpt-3.5-turbo-with-internet') {
            this.plugin = 'internet_access'
            this.model = { value: 'gpt-3.5-turbo' }
        } else if (model.value === 'gpt-4-with-internet') {
            this.plugin = 'internet_access'
            this.model = { value: 'gpt-3.5-turbo' }
        } else {
            // no plugin 
            this.plugin = null
            this.model = model
        }
    };

    newChat = () => { this.currentConversation = null }

    setCurrentConversation = (conversation) => this.currentConversation = conversation

    editConversationById = (id, updates) => {
        if (!this.props.store.ensurePlan()) return
        this.props.store.api.patch(`/chat/${id}`, {
            name: updates.name
        }).then(res => {
            if (this.conversations[this.currentConversation])
                this.conversations[this.currentConversation].name = updates.name
        }).catch(er => {

        })
    }
    @action
    setConversations = (conversations) => { this.conversations = conversations; this.currentConversation = null }

    stopGenerateAnswer = () => {
        if (this.controller) {
            this.controller.abort();
        }
    }
    @action
    generateAnswer = async (e) => {
        let text = ""
        let currentConversation = null
        try {
            console.log(e);
            e.preventDefault();
            const plugins = []
            if (e.doc_query) plugins.push('DOC_QUERY')
            this.error = ""
            if (!this.props.store.ensurePlan()) return
            if (this.typing) return
            if (!e.inputMessage) return this.error = "Please provide a message"
            this.PreMessage = e.inputMessage;
            if (this.currentConversation === null && this.currentConversation !== 0) {
                this.conversations.unshift({
                    name: "New chat",
                    type: "temp",
                    _id: null,
                    user: this.props.store.profile._id,
                    messages: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
                this.currentConversation = 0
            }
            currentConversation = this.currentConversation
            if (!this.model?.value) {
                this.model = { value: 'gpt-3.5-turbo' }
            }

            this.conversations[currentConversation]?.messages.push({
                "sender": this.props.store.profile._id,
                "recipient": "GPT",
                "text": e.inputMessage,
                "_id": "randomMessaage id",
                "timestamp": new Date()
            })
            const gptMessage = {
                "recipient": this.props.store.profile._id,
                "sender": "GPT",
                loading: true,
                typing: false,
                "text": "",
                "type": "",
                "_id": "randomMessaage id",
                "timestamp": new Date(),
                references: []
            }
            this.conversations[currentConversation]?.messages.push(gptMessage)


            const provider = new ChatGPProvider("access Token", { plugin: this.plugin, plugins: plugins, model: this.model?.value, chatId: this.conversations[currentConversation]?._id })
            this.controller = new AbortController();
            const signal = this.controller.signal;

            let result = provider.generateAnswer({
                prompt: e.inputMessage,
                realtime: e.realtime,
                autoThink: e.autoThink,
                plugins: ["DOC_QUERY"],
                signal,
                onEvent: event => {
                    if (event.type === "answer") {
                        if (!this.typing) this.typing = true
                        this.conversations[currentConversation]._id = event.data.conversationId
                        text = event.data.answer
                        this.conversations[currentConversation].messages[this.conversations[currentConversation].messages.length - 1].typing = true
                        this.conversations[currentConversation].messages[this.conversations[currentConversation].messages.length - 1].loading = false
                        this.conversations[currentConversation].messages[this.conversations[currentConversation].messages.length - 1].text = text
                    } else if (event.type === "images") {
                        if (!this.typing) this.typing = true
                        this.conversations[currentConversation]._id = event.data.conversationId
                        this.conversations[currentConversation].messages[this.conversations[currentConversation].messages.length - 1].loading = false
                        this.conversations[currentConversation].messages[this.conversations[currentConversation].messages.length - 1].images = event.data.images
                        this.conversations[currentConversation].messages[this.conversations[currentConversation].messages.length - 1].text = "\n"
                    } else if (event.type === "done") {
                        this.conversations[currentConversation].messages[this.conversations[currentConversation].messages.length - 1].typing = false
                        this.typing = false
                        const substring = text?.substring(0, 30);
                        if (substring && this.conversations[currentConversation].name !== 'PDF_QUERY') {
                            this.editConversationById(this.conversations[currentConversation]._id, { name: substring })
                            this.conversations[currentConversation].name = substring
                        }
                    } else if (event.type === "error") {
                        this.conversations[currentConversation].messages[this.conversations[currentConversation].messages.length - 1].loading = false
                        this.conversations[currentConversation].messages[this.conversations[currentConversation].messages.length - 1].text = event.data.message
                    } else if (event.type === "reference") {
                        this.conversations[currentConversation].messages[this.conversations[currentConversation].messages.length - 1].loading = false
                        this.conversations[currentConversation].messages[this.conversations[currentConversation].messages.length - 1].references = event.data.references
                    } else {
                        this.typing = false
                    }
                }
            })
            result = await result
            if (result.data?.success === false) {
                if (result.data.error) {
                    throw new Error(MESSAGES.noCredits)
                } else {
                    throw new Error(result.data.message)
                }
            }
        } catch (error) {
            if (error.name === "AbortError") {
                // user aborted request
                const substring = text?.substring(0, 30);
                this.editConversationById(this.conversations[currentConversation]._id, { name: substring })
                this.conversations[currentConversation].name = substring
            } else if (this.conversations[currentConversation].messages[this.conversations[currentConversation].messages.length - 1]) {
                this.conversations[currentConversation].messages[this.conversations[currentConversation].messages.length - 1].type = "error"
                this.conversations[currentConversation].messages[this.conversations[currentConversation].messages.length - 1].text = error.message
                this.conversations[currentConversation].messages[this.conversations[currentConversation].messages.length - 1].loading = false
                this.error = " "
            } else {
                this.error = error.message
            }
            this.typing = false
            return
        }
    }

    onfileUpload = async (data) => {
        try {
            const formdata = new FormData();
            formdata.append('file', data.file)
            const conversation = this.conversations[this.currentConversation]
            let URI = "/upload"
            if (conversation)
                URI = URI + `?chat_id=${conversation._id}`
            let result = this.props.store.doc_query_api.post(URI, formdata);

           toast.promise(result, {
               loading: 'Uploading document...',
               success: (data) => data.data?.message || "Document uploaded successfully", // Fallback message
               error: (error) => {
                   return error.response?.data?.message || "Please Upgrade your subscription.";
               },
           });

            result = await result
            if (result.data?.chat && !conversation) {
                this.conversations.unshift(result.data.chat)
                this.currentConversation = 0
            }
        } catch (error) {

        }
    }
    onLinkCrawl = async (link) => {
        try {
            const conversation = this.conversations[this.currentConversation]
            let URI = "/crawl"
            if (conversation)
                URI = URI + `?chat_id=${conversation._id}`
            let result = this.props.store.doc_query_api.post(URI, {
                "url": link,
                "js": false,
                "depth": 1,
                "max_pages": 100,
                "max_time": 60,
                "enable_summarization": false
            });
            toast.promise(result, {
                loading: 'uploading URI',
                success: (data) => data.data?.message,
                error: (data) => data.data?.message,
            });
            result = await result
            if (result.data?.chat && !conversation) {
                this.conversations.unshift(result.data.chat)
                this.currentConversation = 0
            }
        } catch (error) {

        }
    }

    @action pushTextToANewChat = (text, options) => {
        console.log(text, options);
        if (options.action) {
            text = `${options.action}:\n` + text
        } else {
            text = `summarize :\n` + text
        }
        this.generateAnswer({
            preventDefault: () => { },
            inputMessage: text
        })
    }

    timeout = null;
    handleWelcomePopup() {
        if (this.props.store.isLoggedIn === true && window.localStorage.getItem("visited") !== "true") {
            this.time = setTimeout(() => {
                window.localStorage.setItem("visited", true)
                this.welcomePopup = true
            }, 2000)
        }
    }
    componentDidMount() {
        this.handleWelcomePopup()
    }
    componentDidUpdate() {
        this.handleWelcomePopup()
    }
    componentWillUnmount() {
        clearTimeout(this.timeout)
    }

    render() {

        return (
            <div className="overflow-hidden w-full h-full relative flex" style={{ height: "calc(100% - 58px)" }}>
                <Popup
                    open={this.welcomePopup}
                    onClose={() => { this.welcomePopup = false }}
                >
                    <div onClick={() => { this.welcomePopup = false }} className='w-full md:w-2/3 md:h-2/3 m-auto'>
                        <img src="/popup-gpt-4-chatgpt-plus.png" alt="" />
                    </div>
                </Popup>
                <Sidebar setConversations={this.setConversations} editConversationById={this.editConversationById} conversations={this.conversations} currentConversation={this.currentConversation} newChat={this.newChat} setCurrentConversation={this.setCurrentConversation} />
                <div className="flex h-full max-w-full flex-1 flex-col">
                    <main className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
                        <div className="flex-1 overflow-hidden">
                            <ScrollToBottom className='h-full dark:bg-gray-800' initialScrollBehavior="auto">
                                <div className="flex flex-col items-center text-sm dark:bg-gray-800">
                                    {this.currentConversation === null && <Welcome setAutoThink={(v) => this.autoThink = v} setPrompt={prompt => this.message = prompt} setModel={this.setModel} />}
                                    {(this.currentConversation || this.currentConversation === 0) && <CurrentChat typing={this.typing} conversation={this.conversations[this.currentConversation]} />}
                                    <div className="w-full h-20 md:h-32 flex-shrink-0" data-answer={this.conversations[this.currentConversation]?.messages[this.conversations[this.currentConversation].messages.length - 1]?.text} />
                                </div>
                            </ScrollToBottom >
                        </div>
                        <div className="absolute bottom-0 left-0 w-full border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient pt-2" style={{ boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px" }}>
                            <Input pushTextToANewChat={this.pushTextToANewChat} conversation={this.conversations[this.currentConversation]} onfileUpload={this.onfileUpload} autoThink={this.autoThink} mgn={this.message} stopGenerateAnswer={this.stopGenerateAnswer} typing={this.typing} generateAnswer={this.generateAnswer} onLinkCrawl={this.onLinkCrawl} />

                            {this.error && <div className="mt-4"><ReactMarkdown
                                className="text-red-700 stretch mx-2 flex flex-row gap-3 pt-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl lg:pt-6" style={{ width: "85%" }}
                                components={{
                                    a: ({ href, children }) => <a className='underline font-bold' href={href} target='__black'>{children}</a>
                                }} children={this.error} /></div>}
                            <div className="px-3 pt-2 pb-3 text-center text-xs text-gray-600 dark:text-gray-300 md:px-4 md:pt-3 md:pb-6">
                            </div>
                        </div>
                    </main>
                </div>
            </div>

        )
    }
}



// select model
const MODELS = [
    { value: 'gpt-3.5-turbo', label: 'gpt-4' },
    { value: 'gpt-3.5-turbo-with-internet', label: 'GPT-3.5 With Internet' },
    { value: 'gpt-3.5-turbo', label: 'gpt-4' },
    { value: 'gpt-4-with-internet', label: 'GPT-4 With Internet' }
]

const SelectModel = (props) => {
    const [model, setModel] = useState(MODELS[0]);
    const handleModel = (model) => {
        window.store.history.replace(`/ai/ChatGPT?model=${model.value}`)
        setModel(model)
        props.onSelect(model)
    }
    useEffect(() => {
        // const modelFromParam = new URLSearchParams(window.location.search).get("model")
        // if (modelFromParam) {
        //     setModel(MODELS.find(v => v.value === modelFromParam))
        // }
        handleModel(MODELS[0])
    }, [])
    return (
        <Select styles={{
            container: (baseStyles) => ({
                ...baseStyles,
                margin: "auto",
                minWidth: window.innerWidth <= 420 ? "140px" : "200px",
                maxWidth: window.innerWidth <= 420 ? "140px" : "200px"
            }),
            singleValue: (baseStyles) => ({
                ...baseStyles,
                color: "black",
            })
        }} onChange={handleModel} options={MODELS} value={model} />
    )
}


const Welcome = ({ setModel, setPrompt: sa, setAutoThink }) => {
    const setPrompt = (prompt) => {
        sa(prompt)
        if (prompt === prompts[0]) {
            setAutoThink(true)
        } else if (prompt === prompts[1]) {
            setAutoThink(true)
        } else {
            setAutoThink(false)
        }
    }
    // const prompts = ['Explain quantum computing in simple terms', 'Got any creative ideas for a 10 year old’s birthday?', 'How do I make an HTTP request in Javascript?']
    const prompts = ['Who won the Academy Award for best Original Sing in the year 2023?', 'Create an HD image of a super cool sport car racing on the track', 'How do I make an HTTP request in Javascript?']
    return (
        <div className="text-gray-800 w-full md:max-w-2xl lg:max-w-3xl md:h-full md:flex md:flex-col px-6 dark:text-gray-100">
            <h1 className="text-4xl font-semibold text-center mt-6 sm:mt-[20vh] ml-auto mr-auto mb-3 sm:mb-5 flex gap-2 items-center justify-center">

                Built on ChatGPT API <div className='text-xl font-bold p-3 text-slate-300'>
                    Turbo
                    <span className='ml-2 text-gray-700 bg-yellow-200 font-medium rounded text-lg px-2 py-1 text-center'>PLUS</span>
                </div>
            </h1>
            <div className='mb-3 sm:mb-6 text-black'>
                <SelectModel onSelect={setModel} />
            </div>
            <div className="md:flex items-start text-center gap-3">
                <div className="flex flex-col mb-8 md:mb-auto gap-3 flex-1">
                    <h2 className="flex gap-1 items-center m-auto text-xm font-normal md:flex-col md:gap-2">
                        <svg
                            stroke="currentColor"
                            fill="none"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-6 w-6"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle cx={12} cy={12} r={5} />
                            <line x1={12} y1={1} x2={12} y2={3} />
                            <line x1={12} y1={21} x2={12} y2={23} />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                            <line x1={1} y1={12} x2={3} y2={12} />
                            <line x1={21} y1={12} x2={23} y2={12} />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </svg>
                        Examples
                    </h2>
                    <ul className="flex flex-col gap-3.5 w-full sm:max-w-md m-auto">
                        {prompts.map(prompt => (<button key={prompt} onClick={() => setPrompt(prompt)} className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900">
                            "{prompt}" →
                        </button>))}
                    </ul>
                </div>
                <div className="flex flex-col mb-8 md:mb-auto gap-2 flex-1">
                    <h2 className="flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                            className="h-6 w-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                            />
                        </svg>
                        Capabilities
                    </h2>
                    <ul className="flex flex-col gap-3.5 w-full sm:max-w-md m-auto">
                        <li className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">
                            Up-to-date content, Not Limited to 2021
                        </li>
                        <li className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">
                            Realistic images, Art Generator, DALL·E 3 AI system Integrated
                        </li>
                        <li className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">
                            Google Data-Driven, Making your queries more comprehensive and precise
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col mb-8 md:mb-auto gap-3.5 flex-1">
                    <h2 className="flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="1em"
                            width="1em"
                            fill="none"
                            stroke="currentColor"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path d="M22 8.862a5.95 5.95 0 01-1.654 4.13c-2.441 2.531-4.809 5.17-7.34 7.608-.581.55-1.502.53-2.057-.045l-7.295-7.562c-2.205-2.286-2.205-5.976 0-8.261a5.58 5.58 0 018.08 0l.266.274.265-.274A5.612 5.612 0 0116.305 3c1.52 0 2.973.624 4.04 1.732A5.95 5.95 0 0122 8.862z"></path>
                        </svg>
                        New Features
                    </h2>
                    <ul className="flex flex-col gap-3.5 w-full sm:max-w-md m-auto">
                        <li className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">
                            Powered by ChatGPT API - GPT-4 with Internet Access
                        </li>
                        <li className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">
                            Create content with the latest information, and more creativity
                        </li>
                        <li className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">
                            {/* Powered by GPT-4 most advanced model, available to all subscribers */}
                            Text to Art Feature, AI art generator, able to create stunning images
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

const Code = ({ typingText, children, className }) => {
    const codeRef = useRef(null);
    // console.log(className);
    className = !className?.includes("<span") && className
    codeRef.current = useMemo(() => hljs.highlight(String(className).split("-")?.[1] || "javascript", (String(children).replace(/\n$/, '')).replace(typingText, "")).value, [children, className])
    return <>
        <div className="overflow-y-auto p-3 md:p-4">
            {/* <code className={className}>{children}</code> */}
            <code className={className} dangerouslySetInnerHTML={{ __html: codeRef?.current || "" }}></code>
        </div>
        <QuickTools className="bg-black flex px-3 py-1 rounded-md" message={{ text: (String(children).replace(/\n$/, '')).replace(typingText, "") }} />
    </>
}


export const MarkDownMessage = (props) => {
    const typingIndigator = ` <span class="typing-blinker" style="position:relative" ></span>`
    const typingText = props.message.typing ? typingIndigator : ""
    return (
        <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            className={`markDown w-100-90`}
            remarkPlugins={[remarkGfm]}
            children={props.message.text + typingText}
            components={{
                code({ node, inline, className, children, ...props }) {
                    if (inline) {
                        return <code className={`code-inline font-extrabold ${className} `}>`{children}`</code>
                    } else {
                        return <div style={{ background: "#0d0d0d" }} className="rounded-md mb-4">
                            <div>
                                <Code typingText={typingText} children={children} className={className} />
                            </div>
                        </div>


                        // <Code children={children} />
                        // return <>
                        //     <SyntaxHighlighter
                        //         customStyle={{ background: "#0d0d0d", color: "white", textShadow: "none", marginBottom: 0 }}
                        //         {...props}
                        //         language={String(className).split("-")?.[1] || "javascript"}>
                        //         {String(children).replace(/\n$/, '')}
                        //     </SyntaxHighlighter>
                        //     {/* <code className={`${ 'language-javascript' } `}>console.log("hello")</code> */}
                        //     <QuickTools className="bg-black flex px-3 py-1" message={{ text: String(children).replace(/\n$/, '') }} />
                        // </>
                    }
                },
                h2: ({ children }) => <h2 className="text-xl font-extrabold dark:text-white">{children}</h2>,
                table: ({ children }) => (<table className='table-auto' style={{ borderCollapse: 'collapse', border: '1px solid black' }}>
                    {children}
                </table>
                ),
                thead: ({ children }) => (
                    <thead style={{ backgroundColor: 'lightgray' }}>{children}</thead>
                ),
                tbody: ({ children }) => <tbody>{children}</tbody>,
                tr: ({ children }) => <tr>{children}</tr>,
                th: ({ children }) => (
                    <th style={{ padding: '8px', textAlign: 'left' }}>{children}</th>
                ),
                td: ({ children }) => (
                    <td style={{ padding: '8px', border: '1px solid black' }}>{children}</td>
                ),
                a: ({ href, children }) => <a className='underline font-bold' href={href} target='__black'>{children}</a>,
                ol: ({ children }) => <ol className=''>{children?.filter(v => v !== "\n")}</ol>,
                ul: ({ children }) => <ul className=''>{children?.filter(v => v !== "\n")}</ul>,
                li: ({ children }) => <li className=''>{children?.filter(v => v !== "\n")}</li>,
            }}
        />
    )
}


export const QuickTools = inject('store')(observer(({ store, message, ...props }) => {
    return (
        <>
            <div className={`flex`}{...props}>

                <Shortcut className="p-1 rounded-lg cursor-pointer hover:bg-green-200 hover:text-green-700 relative group flex flex-col items-center group text-gray-300"
                    onClick={() => store.copyToClipboard(message.text)}
                >
                    <DuplicateIcon className="w-5 h-5" />

                </Shortcut>
                <div className="flex-1"></div>
                <Shortcut className="p-1 rounded-lg cursor-pointer hover:bg-red-200 hover:text-red-700 relative group flex flex-col items-center group text-gray-300" onClick={() => store.reportToFeedback(message.text)}>
                    <ExclamationCircleIcon className="w-5 h-5" />
                </Shortcut>
            </div>
        </>
    )
}))


const Tooltip = styled.div`
display: none;
white - space: nowrap;
`
const Shortcut = styled.div`
    &:hover ${Tooltip} {
    display: flex;
}
`
export const Loading = () => {
    return <svg
        style={{
            display: "inline-block",
            verticalAlign: "baseline"
        }}
        height="1.4em"
        width="1.4em"
        version="1.1"
        id="L4"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 70 70"
        enableBackground="new 0 0 0 0"
        xmlSpace="preserve"
    >
        <circle stroke="none" cx={6} cy={50} r={6}>
            <animate
                attributeName="opacity"
                dur="1s"
                values="0;1;0"
                repeatCount="indefinite"
                begin="0.1"
            />
        </circle>
        <circle stroke="none" cx={26} cy={50} r={6}>
            <animate
                attributeName="opacity"
                dur="1s"
                values="0;1;0"
                repeatCount="indefinite"
                begin="0.2"
            />
        </circle>
        <circle stroke="none" cx={46} cy={50} r={6}>
            <animate
                attributeName="opacity"
                dur="1s"
                values="0;1;0"
                repeatCount="indefinite"
                begin="0.3"
            />
        </circle>
    </svg>
}

const MESSAGES = {
    noCredits: `English: Congratulations! You have used up all your free credits for chats with our powerful ChatBot Powered by ChatGPT API. - 4 model.We hope you have enjoyed the experience so far.To continue chatting, please visit our Premium Plans page: [Pricing](/my-profile/pricing).Or you can simply top up your account on the profile page: [Buy Credits](/my-profile) with just $5 and you will receive another 250 credits. Thank you for choosing Chat Turbo! Have fun chatting!\n\nSwedish: Grattis! Du har använt upp alla dina gratis krediter för chattar med vår kraftfulla Powered by ChatGPT API Turbo GPT-4-modell. Vi hoppas att du hittills har uppskattat upplevelsen. För att fortsätta chatta, vänligen besök vår sida för Premium Planer: [Prissättning](/my - profile / pricing).Eller du kan helt enkelt fylla på ditt konto på profilsidan: [Köp Krediter](/my-profile) med bara $5 och du kommer att få ytterligare 250 krediter. Tack för att du valde Chat Turbo! Trevlig chatt!\n\nGerman: Herzlichen Glückwunsch! Sie haben alle Ihre kostenlosen Credits für Chats mit unserem leistungsstarken Chat Turbo Plus Turbo GPT-4-Modell aufgebraucht. Wir hoffen, dass Ihnen die Erfahrung bisher gefallen hat. Um weiter zu chatten, besuchen Sie bitte unsere Seite Premium-Tarife: [Preisgestaltung](/my - profile / pricing).Oder Sie können einfach Ihr Konto auf der Profilseite aufladen: [Credits kaufen](/my-profile) für nur $5 und Sie erhalten weitere 250 Credits. Vielen Dank, dass Sie sich für Chat Turbo entschieden haben! Viel Spaß beim Chatten!\n\nItalian: Congratulazioni! Hai esaurito tutti i tuoi crediti gratuiti per le chat con il nostro potente modello Chat Turbo Plus Turbo GPT-4. Speriamo che tu abbia apprezzato l'esperienza finora. Per continuare a chattare, visita la nostra pagina dei Piani Premium: [Prezzi](/my - profile / pricing).Oppure, puoi semplicemente ricaricare il tuo account sulla pagina del profilo: [Acquista Crediti](/my-profile) con soli $5 e riceverai altri 250 crediti. Grazie per aver scelto Chat Turbo! Buon divertimento con la chat!\n\n"`
}


export default withRouter(Chat_v2)
