import React, { Component } from 'react';
import {
    PencilIcon,
    ClockIcon,
    InformationCircleIcon,
    DuplicateIcon,
} from '@heroicons/react/outline'

import { Helmet } from "react-helmet";

import Header from '../Components/Header'
import Body, { Grid, Col } from '../Components/Body'
import Button from '../Components/Button'
import Output from '../Components/Output'
import Countdown from 'react-countdown';
import { Link, withRouter } from 'react-router-dom'

import { observable, makeObservable, computed, } from 'mobx'
import { observer, inject, } from 'mobx-react'

import EntryTabs from '../Components/EntryTabs'
import EntryPrompt from '../Components/EntryPrompt'
import EntryInput from '../Components/EntryInput'
import EntryN from '../Components/EntryN'
import ReactMarkdown from 'react-markdown'

import Filter from 'bad-words'
let filterBadWords = new Filter()


@inject('store')
@observer
class Tool extends Component {

    @observable tool = {}

    @observable.deep prompts = []
    @observable currentPrompt = 0
    @observable currentOption = "Start Using"

    @observable error = ""

    @observable output = ""
    @observable outputs = []
    @observable code = ""


    @observable loading = false

    @observable date = Date.now() + 1000
    countdown = []

    constructor(props) {
        super(props)
        makeObservable(this)
        this.tool = this.props.store.getToolByUrl(this.props.location.pathname)
        if (!this.tool) {
            window.location.href = '/tools';
        } else {
            this.prompts = [...this.tool.prompts]
        }
    }

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
                for (let i = 0; i < this.prompts[this.currentPrompt].example.code.length; i++) {
                    this.clearExampleTimeout[totalLength] = setTimeout(() => {
                        this.code += this.prompts[this.currentPrompt].example.code[i]
                    }, 7 * totalLength)
                }
                this.loading = false
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
            if (prompt.language) {
                language = `${prompt.language}`
            } else if (prompt.attr === "content") {
                language = `${prompt.value}`
            } else {
                language = `${prompt.language}`
            }
        })
        // console.log(language);
        return language
    }

    onGenerateClick = async () => {
        if (!window.store.ensurePlan()) return

        try {
            this.error = ""
            this.output = ""
            this.code = ``
            this.outputs = []
            this.loading = true

            let checkMinimumPrompts = this.checkMinimumPrompts()
            if (checkMinimumPrompts) {
                this.loading = false
                return false
            }
            // this.sanitizeAllPrompts()

            let postObj = {}

            this.prompts[this.currentPrompt].prompts.forEach((prompt) => {
                postObj[prompt.attr] = prompt.value
            })

            postObj.currentPrompt = this.prompts[this.currentPrompt].title
            if (this.prompts[this.currentPrompt].n) {
                postObj.n = this.prompts[this.currentPrompt].n
            }

            let response = await this.props.store.api
                .post(this.tool.api, postObj)

            if (!response.data.success) {
                this.contentFilterFlagged(response.data)
                return false
            }

            if (response.data.output) {
                this.output = this.checkOutput(response.data.output)
            }

            if (response.data.code) {
                this.code = response.data.code
            }

            if (response.data.outputs) {
                this.outputs = response.data.outputs
            }

            this.date = Date.now() + 10000
            this.countdown.forEach(countdown => {
                if (countdown) {
                    countdown.stop()
                    countdown.start()
                }
            })
            this.loading = false
        } catch (error) {
            // console.log(error)
            this.error = error.response?.data.message
            this.countdown.forEach(countdown => {
                if (countdown) {
                    countdown.stop()
                    countdown.start()
                }
            })
            this.loading = false
        }
    }

    render() {

        // required for mobx to pick up deeply nested value 
        const currentValue = this.prompts[this.currentPrompt]?.prompts[0].value

        return (
            <>
                <Helmet>
                    <title>{`${this.tool.title} - Chat Turbo`}</title>
                </Helmet>
                <Header
                    title={this.tool.title}
                    desc={this.tool.desc}
                    Icon={this.tool.Icon}
                    fromColor={this.tool.fromColor}
                    category={this.tool.category}

                    options={[
                        {
                            title: "Start Using",
                            Icon: PencilIcon,
                            color: this.props.store.profile.credits ? 'green' : 'red',
                            onClick: this.onStartUsing
                        },
                        { title: "Example", color: 'yellow', Icon: InformationCircleIcon, onClick: this.onExample },
                    ]}
                    currentOption={this.currentOption}
                />
                {
                    this.tool.category === "chatGPT" ? <>
                        {/* here the code for chat gpt will available */}
                        Chat gpt


                    </> : <Body>
                        <Grid>
                            <Col span="6">

                                <EntryTabs
                                    prompts={this.prompts}
                                    currentPrompt={this.currentPrompt}
                                    onChange={this.handleCurrentPrompt}
                                />

                                {this.prompts.map((prompt, index) =>
                                    <EntryPrompt
                                        prompt={prompt}
                                        key={index}
                                        index={index}
                                        disabled={this.disabled}
                                        currentPrompt={this.currentPrompt}
                                    >
                                        {prompt.prompts.map((promptInput, index) =>
                                            <EntryInput
                                                prompt={promptInput}
                                                key={index}
                                                language={this.language}
                                                index={index}
                                                disabled={this.disabled}
                                            />)}


                                        <div className="md:flex">
                                            <Countdown
                                                ref={countdown => this.countdown[index] = countdown}
                                                date={this.date}
                                                renderer={props =>
                                                    <Button
                                                        title={props.total ? `Timeout ${props.total / 1000} secs` : "Perform Request"}
                                                        disabled={props.total || this.isGenerateButtonDisabled}
                                                        Icon={props.total ? ClockIcon : currentValue ? DuplicateIcon : PencilIcon}
                                                        onClick={this.onGenerateClick}
                                                    />}
                                            />
                                            <EntryN
                                                prompts={this.prompts}
                                                currentPrompt={this.currentPrompt}
                                            />
                                        </div>



                                        {this.error && <div className="mt-4"><ReactMarkdown
                                            className="text-red-700"
                                            components={{
                                                a: CustomLink // Define custom renderer for link nodes
                                            }} children={this.error} /></div>}

                                    </EntryPrompt>
                                )}


                            </Col>
                            <Col span="6">
                                <Output
                                    title={this.tool.output.title}
                                    desc={this.tool.output.desc}

                                    Icon={this.tool.output.Icon || this.tool.Icon}
                                    fromColor={this.tool.fromColor}
                                    toColor={this.tool.toColor}

                                    loading={this.loading}
                                    output={this.output}
                                    outputs={this.outputs}
                                    code={this.code}
                                    language={this.language}

                                    outputsColor={this.tool.output.color}
                                    OutputsIcon={this.tool.output.Icon}
                                />
                            </Col>
                        </Grid>
                    </Body>
                }
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


export default withRouter(Tool)