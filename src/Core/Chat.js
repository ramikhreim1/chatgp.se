import React, { Component } from 'react';

import { Helmet } from "react-helmet";

import { Link, withRouter } from 'react-router-dom'

import { observable, makeObservable, computed, } from 'mobx'
import { observer, inject, } from 'mobx-react'

import styled from 'styled-components'

import Filter from 'bad-words'
import { ChatOutput } from '../Components/ChatOutput';
import SideMenu from '../Components/SideMenu';
import ReactMarkdown from 'react-markdown';
import Select from 'react-select'
let filterBadWords = new Filter()


@inject('store')
@observer
class Tool extends Component {

    @observable tool = {}

    @observable.deep prompts = []
    @observable currentPrompt = 0
    @observable currentOption = "Start Using"
    @observable currentChat = {}


    @observable error = ""


    @observable code = ""
    @observable output = ""
    @observable outputs = []
    @observable temperature = 0
    @observable currentModel = "gpt-3.5-turbo-instruct"
    @observable models = []
    @observable chats = []
    @observable fulltextareaHeight = 1
    @observable typing = false
    @observable errMessage = null


    @observable loading = false

    @observable date = Date.now() + 1000
    countdown = []
    setCurrentChat = (currentChat) => {
        this.errMessage = null
        this.currentChat = currentChat
    }
    constructor(props) {
        super(props)
        makeObservable(this)
        this.tool = this.props.store.getToolByUrl(this.props.location.pathname)
        if (!this.tool) {
            window.location.href = '/';
        } else {
            this.prompts = [...this.tool.prompts]
        }
        if (window.store.isLoggedIn)
            this.props.store.api.get("/chat").then(v => {
                this.chats = v.data

            }).catch(er => { })
    }


    // @computed get currentChat() {
    //     const chat = this.chats.find(v => this.currentChatId === v._id);

    //     if (chat) {
    //         console.log(JSON.parse(JSON.stringify(chat)));
    //         // this.messages = chat.messages
    //         return chat
    //     }
    //     else {
    //         return this.chats.length ? this.chats[0] : {}
    //     }
    // }
    // clearChat = () => this.messages = []
    clearChat = () => this.chats = []
    filterChatByid = (id) => this.chats = this.chats.filter(v => v._id !== id)
    setTemperature = (v) => this.temperature = v
    setCurrentModel = (v) => this.currentModel = v
    SetTyping = (val) => this.typing = val

    handleCurrentPrompt = (val) => {
        this.currentPrompt = val
    }

    @computed get isGenerateButtonDisabled() {
        if (this.loading) {
            return true
        }
        return false
    }

    @computed get disabled() {

        if (this.prompts[this.currentPrompt].prompts[0].value.length < 1) {
            return true
        }


        // this.prompts[this.currentPrompt].prompts[promptIndex].value
        return false
    }

    @computed get isMinLength() {

        if (!this.props.prompt.min) {
            return false
        }
        if (!this.props.prompt.type === "number") {
            return false
        }

        return false
    }
    model = new URLSearchParams(window.location.search).get("model") || "gpt-3.5-turbo"

    setModel = (value) => {
        localStorage.setItem("model", value)
        window.store.history.replace(`/ai/ChatGPT?model=${value}`)
        this.model = value
    }

    checkMinimumPrompts = () => {

        let shouldReturn = false

        this.prompts[this.currentPrompt].prompts.forEach((prompt, promptIndex) => {
            if (prompt.min) {
                if (prompt.value.length < prompt.min) {
                    shouldReturn = true
                    prompt.error = `${prompt.title} needs to meet the minimum ${prompt.min} characters`;
                }
            }
        })

        return shouldReturn
    }


    clearExampleTimeout = []

    onStartUsing = async () => {
        this.loading = false
        this.error = ""
        this.clearExampleTimeout.forEach((item, index) => {
            clearTimeout(this.clearExampleTimeout[index])
        })
        this.currentOption = "Start Using"
    }

    onExample = async () => {
        this.loading = true
        this.error = ""
        this.output = ""
        this.outputs = []
        this.code = ``

        this.currentOption = "Example"

        let totalLength = 0;

        this.clearExampleTimeout.forEach((item, index) => {
            clearTimeout(this.clearExampleTimeout[index])
        })

        this.prompts[this.currentPrompt].prompts.forEach((prompt, promptIndex) => {
            this.prompts[this.currentPrompt].prompts[promptIndex].value = ""
        })

        this.prompts[this.currentPrompt].prompts.forEach((prompt, promptIndex) => {
            for (let timeoutIndex = 0; timeoutIndex < prompt.example.length; timeoutIndex++) {
                totalLength++
                this.clearExampleTimeout[totalLength] = setTimeout(() => {
                    this.prompts[this.currentPrompt].prompts[promptIndex].value += prompt.example[timeoutIndex]
                }, 7 * totalLength)
            }
        })



        totalLength++

        if (this.prompts[this.currentPrompt].example.output) {
            this.clearExampleTimeout[totalLength] = setTimeout(() => {
                this.output = this.prompts[this.currentPrompt].example.output
                totalLength++
                this.clearExampleTimeout[totalLength] = setTimeout(() => {
                    this.loading = false
                    this.currentOption = "Start Using"
                    this.prompts[this.currentPrompt].prompts[0].value += " "
                }, 7 * totalLength + this.prompts[this.currentPrompt].example.output.length * 7 + 500)

            }, (7 * totalLength) + 500)
        }

        if (this.prompts[this.currentPrompt].example.code) {
            totalLength++
            this.clearExampleTimeout[totalLength] = setTimeout(() => {
                this.code = `${this.prompts[this.currentPrompt].example.code}`
            }, (7 * totalLength) + 500)
        }

        if (this.prompts[this.currentPrompt].example.outputs) {
            this.clearExampleTimeout[totalLength] = setTimeout(() => {
                this.outputs = this.prompts[this.currentPrompt].example.outputs

                totalLength++
                this.clearExampleTimeout[totalLength] = setTimeout(() => {
                    this.loading = false
                    this.currentOption = "Start Using"
                    // this.prompts[this.currentPrompt].prompts[0].value += " "
                }, 7 * totalLength + 500)

            }, (7 * totalLength) + 500)
        }
    }

    createChat = async (obj) => {
        if (!window.store.ensurePlan()) return
        return await this.props.store.api.post('/chat', {
            name: obj?.name || "New Chat"
        }).then(chat => {
            this.chats = [chat.data, ...this.chats]
            this.setCurrentChat(chat.data)
            return chat.data
        })
    }

    sanitizeAllPrompts = () => {
        this.prompts[this.currentPrompt].prompts.forEach((prompt) => {
            if (!prompt.value) {
                return false;
            }
            if (prompt.type === "number") {
                return false;
            }

            prompt.value = prompt.value.trim()

            if (filterBadWords.isProfane(prompt.value)) {
                prompt.error = "Unsafe content , please try different language"
                throw Error("Unsafe content")
            }
        })
    }

    contentFilterFlagged = async (response) => {
        this.error = response.message

        this.date = Date.now() + 5000
        this.countdown.forEach(countdown => {
            if (countdown) {
                countdown.stop()
                countdown.start()
            }
        })
        this.loading = false
    }

    checkOutput = (output) => {
        if (output) {
            output = output.replace(/^\s+|\s+$/g, '')
            // output = output.replace(/\s{2,}/g, ' ')
        }
        return output
    }

    @computed get language() {
        let language = ""
        this.prompts[this.currentPrompt].prompts.forEach(prompt => {
            if (prompt.attr === "language") {
                language = `${prompt.value}`
            }
        })
        return language
    }

    deleteChat = (id) => {
        if (!window.store.ensurePlan()) return
        this.props.store.api.delete(`/chat/${id}`).then(v => {
            this.filterChatByid(id)
            this.setCurrentChat({})
        }).catch(er => {
        })
    }

    onGenerateClick = async (e, re) => {
        try {
            this.errMessage = null
            e.preventDefault()
            this.error = ""
            if (!window.store.ensurePlan()) return
            if (!Object.entries(this.currentChat).length) {
                const regex = new RegExp(`^((\\w+ ){0,${5}}\\w+)`);
                await this.createChat({
                    name: this.prompts[this.currentPrompt].prompts[0].value.match(regex)[0]
                })
            }
            this.loading = true
            this.SetTyping(true)


            let checkMinimumPrompts = this.checkMinimumPrompts()
            if (checkMinimumPrompts) {
                if (!re) {
                    this.loading = false
                    return false
                }
            }
            // this.sanitizeAllPrompts()

            let postObj = {}

            postObj.model = this.model;
            if (this.model === "gpt-4-with-internet") {
                postObj.model = "gpt-4"
                postObj.plugin = "internet_access"
            } else if (this.model === "gpt-3.5-turbo-with-internet") {
                postObj.model = "gpt-3.5-turbo"
                postObj.plugin = "internet_access"
            }

            postObj.currentPrompt = this.prompts[this.currentPrompt].title
            if (this.prompts[this.currentPrompt].n) {
                postObj.n = this.prompts[this.currentPrompt].n
            }
            if (!re) {
                this.currentChat.messages.push({
                    sender: this.props.store.profile._id,
                    receiver: "GPT",
                    text: this.prompts[this.currentPrompt].prompts[0].value,
                    date: new Date().toDateString(),
                    now: true
                })
                postObj.content = this.prompts[this.currentPrompt].prompts[0].value
            } else {
                const poped = this.currentChat.messages[this.currentChat.messages.length - 1]
                postObj.content = poped.text || ""
                postObj.re = re
            }

            // postObj.content = this.messages.map((message) => message.message).join("\n")
            postObj.temperature = this.temperature
            // postObj.model = this.currentModel
            let response = this.props.store.api
                .post(this.tool.api + "/" + this.currentChat._id, postObj)

            this.prompts[this.currentPrompt].prompts[0].value = ""
            response = await response;

            if (!response.data.success) {
                this.error = ""
                this.errMessage = {
                    sender: "GPT",
                    receiver: this.props.store.profile._id,
                    type: "errorGeneratingRes",
                    text: response.data.message,
                    date: new Date().toDateString(),
                }
                return false
            }

            if (response.data.outputs?.length) {
                this.currentChat.messages.push({
                    sender: "GPT",
                    receiver: this.props.store.profile._id,
                    text: response.data.output,
                    messages: response.data.outputs,
                    date: new Date().toDateString(),
                    now: true
                })
                // this.messages.push({
                //     user: "gpt",
                //     type: "text",
                //     message: response.data.output,
                //     messages: response.data.outputs,
                //     date: new Date().toDateString()
                // })
            } else {
                this.output = response.data.output
                this.currentChat.messages.push({
                    sender: "GPT",
                    receiver: this.props.store.profile._id,
                    text: response.data.output,
                    date: new Date().toDateString(),
                    now: true
                })
                // this.messages.push({
                //     user: "gpt",
                //     type: "text",
                //     message: response.data.output,
                //     messages: [],
                //     date: new Date().toDateString()
                // })
            }
            this.date = Date.now() + 10000
            this.countdown.forEach(countdown => {
                if (countdown) {
                    countdown.stop()
                    countdown.start()
                }
            })
            this.errMessage = null
            this.loading = false
        } catch (error) {
            this.error = ""
            this.errMessage = {
                sender: "GPT",
                receiver: this.props.store.profile._id,
                type: "errorGeneratingRes",
                text: "An error occurred. Either the engine you requested does not exist or there was another issue processing your request. If this issue persists please contact us through our help center at support@chatgp.se",
                date: new Date().toDateString(),
            }
            this.countdown.forEach(countdown => {
                if (countdown) {
                    countdown.stop()
                    countdown.start()
                }
            })
            this.loading = false
        }
    }
    models = [
        { value: 'gpt-3.5-turbo', label: 'GPT-3.5-turbo' },
        { value: 'gpt-3.5-turbo-with-internet', label: 'GPT-3.5 With Internet' },
        { value: 'gpt-4', label: 'GPT-4' },
        // { value: 'gpt-4-with-internet', label: 'GPT-4 With Internet' }
    ]

    render() {
        // console.log(this.model);

        return (
            <>
                <Helmet>
                    <title>{`${this.tool.title} - Chat GP`}</title>
                    <meta name="description"
                        content="Use Chat GPT and DALL-E online and for free. Chat GP is a language model developed by OpenAI, designed to respond to text-based queries and generate natural language responses." />
                </Helmet>
                <main className="flex text-white w-screen" style={{ height: "calc(100vh - 61px)", ...(this.props.store.theme === "Dark" ? { background: "#343541", color: "#fff" } : {}) }} >
                    <SideMenu
                        setCurrentChat={this.setCurrentChat}
                        deleteChat={this.deleteChat}
                        currentChat={this.currentChat}
                        createChat={this.createChat}
                        chats={this.chats}
                        currentModel={this.currentModel}
                        setCurrentModel={this.setCurrentModel}
                        models={this.models}
                        setTemperature={this.setTemperature}
                        temperature={this.temperature}
                        clearChat={this.clearChat}
                    />
                    <Messages className="flex flex-col flex-1" >
                        <AllMessages className="allmesafedc scrollbar-none" style={{ height: "90%", overflow: "auto" }} >
                            {this.currentChat?.messages?.length ? <ChatOutput
                                errMessage={this.errMessage}
                                SetTyping={this.SetTyping}
                                loading={this.loading}
                                output={this.output}
                                outputs={this.currentChat?.messages || []}
                                code={this.code}
                                language={this.language}
                            /> : <div className="relative mb-12 flex-1">
                                <div style={{ ...(this.props.store.theme === "Dark" ? { color: "#fff" } : {}) }} class="text-gray-800 w-full md:max-w-2xl lg:max-w-3xl md:h-full md:flex md:flex-col px-6 dark:text-gray-100 m-auto">
                                    <h1 class="text-4xl font-semibold text-center mt-6 sm:mt-[20vh] ml-auto mr-auto mb-3 sm:mb-4 flex gap-2 items-center justify-center">Built on ChatGPT API
                                        <div className='text-xl font-bold p-3 text-slate-300'>
                                            Turbo
                                            <span className='ml-2 text-gray-700 bg-yellow-200 font-medium rounded text-lg px-2 py-1 text-center'>PLUS</span>
                                            {/* <img src={TurboLogo} alt="turbo logo" /> */}
                                        </div>
                                    </h1>
                                    <div className='mb-6 sm:mb-12 text-black'>
                                        <Select styles={{
                                            container: (baseStyles, state) => ({
                                                ...baseStyles,
                                                margin: "auto",
                                                minWidth: window.innerWidth <= 420 ? "140px" : "200px",
                                                maxWidth: window.innerWidth <= 420 ? "140px" : "200px"
                                            }),
                                            singleValue: (baseStyles) => ({
                                                ...baseStyles,
                                                color: "black",
                                            })
                                        }} onChange={e => this.setModel(e.value)} options={this.models} defaultValue={this.models.find(v => v.value === this.model)} />
                                    </div>

                                    <div class="md:flex items-start text-center gap-3.5 ">
                                        <div class="flex flex-col mb-8 md:mb-auto gap-3.5 flex-1">
                                            <h2 class="flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2">
                                                <svg stroke="currentColor" fill="none" stroke-width="1.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>Examples</h2>
                                            <ul class="flex flex-col gap-3.5 w-full sm:max-w-md m-auto text-black">
                                                <button class="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900" onClick={() => this.prompts[this.currentPrompt].prompts[0].value = "Explain quantum computing in simple terms"}>"Explain quantum computing in simple terms" →</button>
                                                <button class="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900" onClick={() => this.prompts[this.currentPrompt].prompts[0].value = "Got any creative ideas for a 10 year old’s birthday?"}>"Got any creative ideas for a 10 year old’s birthday?" →</button>
                                                <button class="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900" onClick={() => this.prompts[this.currentPrompt].prompts[0].value = "How do I make an HTTP request in Javascript?"}>"How do I make an HTTP request in Javascript?" →</button>
                                            </ul>
                                        </div>
                                        <div class="flex flex-col mb-8 md:mb-auto gap-3.5 flex-1">
                                            <h2 class="flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="h-6 w-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"></path></svg>Capabilities</h2><ul class="flex text-black flex-col gap-3.5 w-full sm:max-w-md m-auto"><li class="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">Remembers what user said earlier in the conversation</li><li class="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">Allows user to provide follow-up corrections</li><li class="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">Trained to decline inappropriate requests</li></ul></div>
                                        <div class="flex flex-col mb-8 md:mb-auto gap-3.5 flex-1">
                                            <h2 class="flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2">
                                                <svg stroke="currentColor" fill="none" stroke-width="1.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>Limitations</h2>
                                            <ul class="flex flex-col gap-3.5 w-full sm:max-w-md m-auto text-black"><li class="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">May occasionally generate incorrect information</li><li class="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">May occasionally produce harmful instructions or biased content</li>
                                                <li class="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">Limited knowledge of world and events after 2021</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>}

                        </AllMessages>
                        <div>

                            <MessageInput className="pb-3 md:pb-8 flex-1 w-100">
                                <form className="stretch mx-2 flex flex-row gap-3 pt-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl lg:pt-6">
                                    <div className="relative flex h-full flex-1 md:flex-col">
                                        {this.errMessage ? <div className="flex md:w-full md:m-auto md:mb-2 gap-0 md:gap-2 justify-center m-auto flex-col items-center">
                                            <span className={`mb-3 block text-xs md:mb-auto ${this.props.store.theme === "Dark" ? "" : "text-black"}`}>There was an error generating a response</span>
                                            <button type='button' onClick={(e) => { this.onGenerateClick(e, true) }} className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                                <div className="flex w-full items-center justify-center gap-2">
                                                    <svg stroke="currentColor" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="1 4 1 10 7 10" /><polyline points="23 20 23 14 17 14" /><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" /></svg>
                                                    Regenerate response
                                                </div>
                                            </button>
                                        </div> : <div className={`flex flex-col w-full flex-grow relative border text-white rounded-md ${window.store.theme === "Dark" ? "border-black/10" : "text-slate-800"}`}>
                                            <textarea rows={this.fulltextareaHeight} placeholder="Write Here..." value={this.prompts[this.currentPrompt].prompts[0].value}
                                                onChange={(e) => {
                                                    if (e.nativeEvent.inputType !== "insertLineBreak")
                                                        this.prompts[this.currentPrompt].prompts[0].value = e.target.value
                                                    const lines = (String(this.prompts[this.currentPrompt].prompts[0].value).match(/\n/g) || '').length + 1
                                                    this.fulltextareaHeight = lines

                                                }}
                                                onKeyDown={event => {
                                                    if (event.key === "Enter" && !event.shiftKey) {
                                                        event.preventDefault(); // prevent the form from submitting
                                                        // Your submit logic here
                                                        if (!this.loading && !this.typing) {
                                                            this.onGenerateClick(event)
                                                        }
                                                    } else if (event.key === "Enter" && event.shiftKey) {
                                                        // Add a new line
                                                        this.prompts[this.currentPrompt].prompts[0].value = this.prompts[this.currentPrompt].prompts[0].value + "\n";
                                                    }
                                                }}
                                                tabIndex="0" data-id="request-:Rdd6:-0" style={{ border: "none", outline: "none", "maxHeight": "200px", minHeight: "42px", overflowY: "hidden", color: window.store.theme === "Dark" ? "" : "black" }}
                                                className="overflow-auto py-2 pl-2 flex-grow md:py-3 md:pl-4 w-full border-0 pr-7 focus:ring-0 focus-visible:ring-0 bg-transparent transition-all duration-300"></textarea>
                                            <button onClick={(e) => !this.typing && this.onGenerateClick(e)} type='button' disabled={this.loading} className="absolute p-1 rounded-md text-gray-500 bottom-1.5 right-1 md:bottom-2.6 md:right-2  hover:text-gray-400 hover:bg-gray-900 disabled:bg-transparent">
                                                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                            </button>
                                        </div>}

                                    </div>
                                </form>
                                {/* <EntryInput
                                    loading={this.loading}
                                    addMsg={(e) => this.onGenerateClick(e)}
                                    chat={true}
                                    Icon={PencilIcon}
                                    prompt={this.prompts[this.currentPrompt].prompts[0]} // 0 here because currently i need only one promt as message prompt
                                /> */}
                                {this.error && <div className="mt-4"><ReactMarkdown
                                    className="text-red-700 stretch mx-2 flex flex-row gap-3 pt-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl lg:pt-6" style={{ width: "85%" }}
                                    components={{
                                        a: CustomLink // Define custom renderer for link nodes
                                    }} children={this.error} /></div>}
                            </MessageInput>
                        </div>
                    </Messages>
                </main>


            </>
        )
    }
}

// Custom link component using React Router's Link component
const CustomLink = ({ href, children }) => {
    return (
        <Link className='underline font-bold' to={href}>
            {children}
        </Link>
    );
};


const AllMessages = styled.div`

`


const MessageInput = styled.div`

`


const Messages = styled.div`

`


export default withRouter(Tool)
