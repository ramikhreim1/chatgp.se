import { useState } from "react"
import { Loading } from "../Chat_v2";
import { useEffect } from "react";
import TextareaAutosize from 'react-textarea-autosize';
import VoiceRecorder from "../../Components/VoiceRecorder";
import { useRef } from "react";
import BrowserSpeechToText from "./BrowerSpeechToText";
import { Menu, Transition, Dialog } from '@headlessui/react'
import { Fragment } from "react";
import fileIcon from "../../media/file.svg"
import DragDropFile from "../../Components/FileUpload";
import toast from 'react-hot-toast';
import Whisper from "./Whisper";
import { Switch } from '@headlessui/react'


const Input = ({ typing, stopGenerateAnswer, conversation, generateAnswer, mgn, autoThink: at, onfileUpload, onLinkCrawl, pushTextToANewChat }) => {
    const checkBox = useRef(null)
    const [message, setMsg] = useState("");
    const [realtime, setrealtime] = useState(false);
    const [autoThink, setAutoThink] = useState(false);
    const [currentDialog, setCurrentDialog] = useState("");

    const [status, setStatus] = useState('idle');
    const prevStatusRef = useRef(status);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [DOC_QUERY, setDOC_QUERY] = useState(false);


    const setMessage = message => {
        setMsg(message)
    }
    useEffect(() => {
        if (mgn) {
            setMsg(mgn)
        }
    }, [mgn])
    useEffect(() => {
        setrealtime(at)
        setAutoThink(at)
    }, [at])

    const handleKeyDown = event => {
        if (event.key === "Enter" && !event.shiftKey) {
            getAnswer(event);
        } else if (event.key === "Enter" && event.shiftKey) {
            setMessage(message + "\n");
        }
    };

    const getAnswer = (event) => {
        event.inputMessage = message
        event.realtime = realtime
        event.autoThink = autoThink
        event.doc_query = DOC_QUERY
        setMessage("")
        generateAnswer(event)
        setrealtime(false)
        setAutoThink(false)
    }

    const handleOption = (e) => {
        if (e.target.name === "realtime") {
            setrealtime(e.target.checked);
            setAutoThink(e.target.checked)
        }
    }

    // Speech Code
    useEffect(() => {
        if (transcript.length !== 0 && transcript !== 'undefined') {
            setMsg(prevInput => prevInput + ' ' + transcript);
        }
    }, [transcript]);

    function startRecording() {
        setStatus('recording');
    }

    function stopRecording() {
        setStatus('idle');
    }
    const voice = {
        service: 'System',
        systemLanguage: 'en-US',
        azureLanguage: 'en-US',
        autoStart: false,
        startTime: 1,
    }
    useEffect(() => {
        if (voice.autoStart) {
            const prevStatus = prevStatusRef.current;
            if (prevStatus === 'speaking' && status === 'idle') {
                setTimeout(() => {
                    startRecording();
                }, voice.startTime * 1000);
            }
            prevStatusRef.current = status;
        }
    }, [status]);

    useEffect(() => {
        if (status === 'recording') {
            setIsListening(true);
        } else {
            setIsListening(false);
        }
    }, [status]);
    useEffect(() => {
        if (status === 'recording' && !isListening) {
            stopRecording();
        }
    }, [isListening]);

    useEffect(() => {
        if (conversation?.type === "PDF_QUERY" && (realtime || autoThink)) {
            setrealtime(false)
            setAutoThink(false)
            return toast.error('Documents do not have access to the Google search function.', { id: "DOC_NOT_ACC_GOOGLE" })
        }
    }, [realtime, autoThink, conversation?.type])
    useEffect(() => {
        if (conversation?.type === "DOC_QUERY") {
            setDOC_QUERY(true)
        }
    }, [conversation?.type])


    const handleFileUpload = (data) => {
        setCurrentDialog('')
        onfileUpload(data)
    }
    const handleLinkAdd = (link) => {
        setCurrentDialog('')
        onLinkCrawl(link)
    }

    const onExportText = (text, options) => {
        pushTextToANewChat(text, options)
        setCurrentDialog("")
    }

    return (<>
        <form onSubmit={(e) => getAnswer(e)} className="stretch mx-2 flex flex-col gap-2 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
            {!typing && <div>
                <div className="flex items-center justify-start gap-1 font-medium mr-auto">
                    <p className="text-xs whitespace-nowrap block">
                        Include latest Google data, AI art generator:{" "}
                    </p>
                    <div className="flex items-center ml-0">
                        <CustomCheckbox ref={checkBox} checked={realtime} name="realtime" onChange={handleOption} />
                    </div>
                    <div class="hover-text"><svg
                        width={20}
                        height={20}
                        fill="none"
                        stroke="gray"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M12 11.5v5" />
                        <path d="m12 7.511.01-.011" />
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" />
                    </svg>

                        <span class="tooltip-text" id="right">Uses additional credits</span>
                    </div>

                </div>
                <div>
                    <div className="flex items-center ml-0">
                        <p className="text-xs whitespace-nowrap block">
                            Chat with Uploads-Trained ChatGPT: {" "}
                        </p>
                        <CustomCheckbox disabled={conversation?.type === "DOC_QUERY"} checked={conversation?.type === "DOC_QUERY" || DOC_QUERY} name="DOC_QUERY" onChange={e => setDOC_QUERY(e.target.checked)} />
                        {/* <Switch
                            checked={DOC_QUERY}
                            onChange={setDOC_QUERY}
                            className={`${DOC_QUERY ? 'bg-gray-500' : 'bg-gray-400'}
          relative inline-flex items-center h-6 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                        >
                            <span className="sr-only">Use setting</span>
                            <span
                                aria-hidden="true"
                                className={`${DOC_QUERY ? 'translate-x-4' : 'translate-x-0'}
            pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out`}
                            />
                        </Switch> */}
                    </div>
                </div>
            </div>}
            <div className="relative flex h-full flex-1 items-stretch md:flex-col">
                <div className="">
                    <div className="h-full flex ml-1 md:w-full md:m-auto md:mb-2 gap-0 md:gap-2 justify-center">
                        {typing && <button onClick={stopGenerateAnswer} type="button" className="btn relative btn-neutral border-0 md:border px-3">
                            <div className="flex w-full items-center justify-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="1em"
                                    height="1em"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    className="h-3 w-3"
                                    viewBox="0 0 24 24"
                                >
                                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                                </svg>
                                {window.innerWidth > 768 && "Stop generating"}
                            </div>
                        </button>}
                    </div>
                </div>
                <div className="flex flex-grow w-full">

                    <div className="flex w-full flex-col py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md" style={{ boxShadow: "rgba(0, 0, 0, 0.26) 0px 1px 4px" }}>
                        <Menu as="div" className="absolute bottom-1 md:bottom-2  left-1 md:left-2">
                            <div>
                                <Menu.Button className="" title="Chat with pdf or link">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                                    </svg>

                                </Menu.Button>
                            </div>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute bottom-6 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="px-3 py-3 ">
                                        <Menu.Item>
                                            <div>
                                                <p className="font-bold text-gray-700 leading-6 text-base">Attach</p>
                                                <div className="flex flex-col gap-1.5">
                                                    <button title="Add document to chat with document" type="button" onClick={() => setCurrentDialog('ADD_FILE')} className="flex gap-1.5 py-1.5 px-2 rounded-xb-large my-1 hover:bg-gray-50">
                                                        <div className="flex justify-center items-center gap-1">
                                                            <div className="w-4 h-4 text-purple-500">
                                                                <img
                                                                    alt="File"
                                                                    src={fileIcon}
                                                                    className="inset-0 object-cover object-center w-4 h-4"
                                                                />
                                                            </div>
                                                            <span className="text-lg font-base leading-4 text-gray-700">File</span>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>

                                        </Menu.Item>
                                        <Menu.Item>
                                            <div>
                                                <p className="font-bold text-gray-700 leading-6 text-base">Enter Link</p>
                                                <div className="flex flex-col gap-1.5">
                                                    <button title="Add link to chat with link" type="button" onClick={() => setCurrentDialog('ADD_LINK')} className="flex gap-1.5 py-1.5 px-2 rounded-xb-large my-1 hover:bg-gray-50">
                                                        <div className="flex justify-center items-center gap-1">
                                                            <div className="w-4 h-4 text-purple-500">
                                                                <svg className="inset-0 object-cover object-center w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                                                                </svg>

                                                            </div>
                                                            <span className="text-lg font-base leading-4 text-gray-700">Link</span>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>

                                        </Menu.Item>
                                        <Menu.Item>
                                            <div>
                                                <p className="font-bold text-gray-700 leading-6 text-base">Media</p>
                                                <div className="flex flex-col gap-1.5">
                                                    <button title="Add link to chat with link" type="button" onClick={() => setCurrentDialog('ADD_MEDIA')} className="flex gap-1.5 py-1.5 px-2 rounded-xb-large my-1 hover:bg-gray-50">
                                                        <div className="flex justify-center items-center gap-1">
                                                            <div className="w-4 h-4 text-purple-500">
                                                                <svg className="inset-0 object-cover object-center w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                                                                </svg>

                                                            </div>
                                                            <span className="text-lg font-base leading-4 text-gray-700">Media</span>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>

                                        </Menu.Item>
                                    </div>

                                </Menu.Items>
                            </Transition>
                        </Menu>
                        <TextareaAutosize
                            id="inputBox"
                            onKeyDown={handleKeyDown}
                            tabIndex={0}
                            name="message"
                            data-id="root"
                            rows={1}
                            minRows={1}
                            maxRows={6}
                            onChange={(e) => e.nativeEvent.inputType !== "insertLineBreak" && setMessage(e.target.value)}
                            placeholder={conversation?.type === 'PDF_QUERY' ? 'Ask any topic inside the document...' : "Send a message."}
                            className="scrollbar-none m-0 w-full outline-none resize-none border-0 bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-6 md:pl-4"
                            value={message}
                        />
                        <button disabled={typing} title="Send Message"
                            className="absolute p-1 rounded-md text-gray-500 bottom-1.5 md:bottom-2.5 hover:bg-gray-100 enabled:dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent right-1 md:right-2 disabled:opacity-40"
                        >
                            {typing ? <Loading /> : <svg
                                stroke="currentColor"
                                fill="none"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4 mr-1"
                                height="1em"
                                width="1em"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <line x1={22} y1={2} x2={11} y2={13} />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>}
                        </button>
                    </div>
                    <BrowserSpeechToText isListening={isListening}
                        language={voice.systemLanguage}
                        setIsListening={setIsListening}
                        setTranscript={setTranscript}
                    />
                    <VoiceRecorder disabled={typing} status={status} startRecording={startRecording} stopRecording={stopRecording} />
                </div>

            </div>
        </form>
        <Transition appear show={currentDialog === "ADD_FILE"} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => setCurrentDialog('')}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex justify-between mt-2 text-center sm:mt-0 sm:text-left">
                                    <Dialog.Title
                                        className="text-xl leading-4 font-medium text-black"
                                        id="headlessui-dialog-title-:r1q:"
                                        data-headlessui-state="open"
                                    >
                                        Upload File
                                    </Dialog.Title>
                                    <div className="rounded-4xl cursor-pointer">
                                        <svg
                                            onClick={() => setCurrentDialog('')}
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                            className="rounded-4xl w-6 h-6 text-gray-500 hover:text-purple-500 active:text-navy-1"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                <DragDropFile submit={true} accept=".txt, .csv, .md, .markdown, .m4a, .mp3, .webm, .mp4, .mpga, .wav, .mpeg, .pdf, .html, .pptx, .docx, .odt, .epub, .ipynb" support={"Text, document, spreadsheet, presentation, audio, video"} onSubmit={handleFileUpload} onUpload={() => { }} />


                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
        <Transition appear show={currentDialog === "ADD_LINK"} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => setCurrentDialog('')}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex justify-between mt-2 text-center sm:mt-0 sm:text-left">
                                    <Dialog.Title
                                        className="text-xl leading-4 font-medium text-black"
                                        id="headlessui-dialog-title-:r1q:"
                                        data-headlessui-state="open"
                                    >
                                        Add Link
                                    </Dialog.Title>
                                    <div className="rounded-4xl cursor-pointer">
                                        <svg
                                            onClick={() => setCurrentDialog('')}
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                            className="rounded-4xl w-6 h-6 text-gray-500 hover:text-purple-500 active:text-navy-1"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <AddLink onLinkAdded={handleLinkAdd} />

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
        <Transition appear show={currentDialog === "ADD_MEDIA"} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => setCurrentDialog('')}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex justify-between mt-2 text-center sm:mt-0 sm:text-left">
                                    <Dialog.Title
                                        className="text-xl leading-4 font-medium text-black"
                                        id="headlessui-dialog-title-:r1q:"
                                        data-headlessui-state="open"
                                    >
                                        Add Media
                                    </Dialog.Title>
                                    <div className="rounded-4xl cursor-pointer">
                                        <svg
                                            onClick={() => setCurrentDialog('')}
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                            className="rounded-4xl w-6 h-6 text-gray-500 hover:text-purple-500 active:text-navy-1"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <Whisper onExportText={onExportText} />

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    </>
    )
}

const CustomCheckbox = ({ onChange, name, checked, ref, ...props }) => {
    return (
        <div className="custom-checkbox-container flex items-center ml-0">
            <label className="switch inline-flex relative cursor-pointer" htmlFor={name}>
                <input ref={ref} checked={checked} onChange={onChange} name={name} type="checkbox" id={name} {...props} />
                <div className="slider round " />
            </label>
        </div>
    )
}

const AddLink = (props) => {
    const [link, setLink] = useState('')

    const handleSubmit = () => {
        props.onLinkAdded(link)
    }
    return (<>
        <div>
            <label htmlFor="link" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Enter link here
            </label>
            <input
                type="text"
                id="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="John"
                required={true}
            />
        </div>
        <div className="mt-5 w-full sm:w-1/4 grid gap-2 grid-cols-1 sm:flex-row-reverse sm:ml-auto">
            <button
                onClick={() => handleSubmit()}
                className="bg-green-600 transition text-white font-bold rounded-xb-large px-4 flex justify-center items-center py-2 active:bg-navy-1 hover:bg-purple-2 w-full text-sm"
                type="button"
            >
                <svg
                    className="animate-spin h-5 w-5 text-gray-50 hidden"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx={12}
                        cy={12}
                        r={10}
                        stroke="currentColor"
                        strokeWidth={4}
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
                <div className="flex justify-center items-center">Submit</div>
            </button>
        </div></>)
}



export default Input