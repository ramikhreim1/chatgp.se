import React, { Component } from 'react';
import { observer, inject, } from 'mobx-react';
import { observable, makeObservable, } from 'mobx'
import { Link, withRouter } from 'react-router-dom';
import { useState } from 'react';

@inject('store')
@observer
class Sidebar extends Component {
  @observable sidebar = ""
  constructor(props) {
    super(props)
    makeObservable(this)
  }
  closeSidebar = () => document.getElementById("sidebar_mob")?.classList.remove('show')
  openSidebar = () => this.sidebar = "show"
  filterChatByid = (id) => this.props.setConversations(this.props.conversations.filter(v => v._id !== id))
  deleteAllConversation = () => {
    if (!window.store.ensurePlan()) return
    this.props.store.api.delete('chat/-r/all').then(() => {
      this.props.conversations = []
    }).catch(() => {
      alert("failed to delete Conversation")
    })
    this.props.currentConversation = null
  }

  deleteConversationById = (id) => {
    if (!this.props.store.ensurePlan()) return
    this.props.store.api.delete(`/chat/${id}`).then(v => {
      this.filterChatByid(id)
      this.props.currentConversation = null
    }).catch(er => {
    })
  }


  render() {
    return (
      <div id={'sidebar_mob'} className={`dark ${this.sidebar} flex-shrink-0 bg-gray-900 md:flex md:flex-col`} style={{ maxWidth: 260, width: 260 }} >
        <div className="flex h-full min-h-0 flex-col " >
          <div className="scrollbar-trigger relative flex h-full w-full flex-1 items-start border-white/20">
            <nav className="flex h-full flex-1 flex-col p-2">
              <a onClick={this.props.newChat} href='#' className="flex py-3 px-3 items-center gap-3 transition-colors duration-200 text-white cursor-pointer text-sm rounded-md border border-white/20 hover:bg-gray-500/10 mb-1 flex-shrink-0">
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line x1={12} y1={5} x2={12} y2={19} />
                  <line x1={5} y1={12} x2={19} y2={12} />
                </svg>
                New chat
              </a>
              <div className="absolute left-0 top-14 z-20 overflow-hidden transition-all duration-500 max-h-0">
                <div className="bg-gray-900 px-4 py-3">
                  <div className="p-1 text-sm text-gray-100">
                    Chat History is off.
                  </div>
                  <div className="p-1 text-xs text-gray-500">
                    Chats won’t be saved in your history or used for training our
                    models to improve Chat GP. Unsaved chats will be deleted from
                    our systems within 30 days.{" "}
                    <a
                      href="https://help.openai.com/en/articles/7730893"
                      target="_blank"
                      className="underline"
                      rel="noreferrer"
                    >
                      Learn more
                    </a>
                  </div>
                  <button className="btn relative btn-primary mt-4 w-full">
                    <div className="flex w-full items-center justify-center gap-2">
                      <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                        <line x1={12} y1={2} x2={12} y2={12} />
                      </svg>
                      Enable chat history
                    </div>
                  </button>
                </div>
                <div className="h-24 bg-gradient-to-t from-gray-900/0 to-gray-900" />
              </div>
              <div className="flex-col flex-1 transition-opacity duration-500 overflow-y-auto">
                {this.props.conversations.map((conversation, index) => <ConversationTab key={conversation.name + index} onEdit={this.props.editConversationById} onDelete={this.deleteConversationById} active={this.props.currentConversation === index} onClick={() => this.props.setCurrentConversation(index)} conversation={conversation} />)}
              </div>
              <div className="border-t border-white/20 pt-2">
                {settings.map((setting, index) => <SettingTab key={index} onDeleteAll={this.deleteAllConversation} setting={setting} />)}
              </div>
            </nav>
          </div>
        </div>
        {<button
          type="button"
          className="bg-black ml-1 hidden h-10 w-10 items-center justify-center focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          tabIndex={0}
          onClick={this.closeSidebar}
        >
          <span className="sr-only">Close sidebar</span>
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-white pointer-events-none"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1={18} y1={6} x2={6} y2={18} />
            <line x1={6} y1={6} x2={18} y2={18} />
          </svg>
        </button>}
      </div>
    )
  }
}

const ConversationTab = ({ conversation, onClick, onDelete, onEdit, active }) => {
  const [edit, setEdit] = useState(false);
  const [name, setname] = useState(conversation.name);
  const handleChange = () => {
    setEdit(false)
    conversation.name = name
    onEdit(conversation._id, { name })
  }

  // active
  return (<div className="flex flex-col gap-2 pb-2 text-gray-100 text-sm" onClick={() => onClick(conversation)}>
    <div>
      <a href='#' className={`flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all pr-14 hover:bg-gray-800 group animate-flash ${active && "bg-gray-800"}`}>
        <svg
          stroke="currentColor"
          fill="none"
          strokeWidth={2}
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <div className="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
          {edit ? <input className='bg-transparent border' value={name} onChange={e => setname(e.target.value)} /> : conversation.name}
        </div>
        {active && <div className="absolute flex right-1 z-10 text-gray-300 visible">
          {edit ? <button onClick={() => handleChange()} className="p-1 hover:text-white cursor-pointer">

            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth={2}
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </button> : <button onClick={() => setEdit(true)} className="p-1 hover:text-white cursor-pointer">
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth={2}
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </button>}

          <button className="p-1 hover:text-white" onClick={() => onDelete(conversation._id)}>
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth={2}
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1={10} y1={11} x2={10} y2={17} />
              <line x1={14} y1={11} x2={14} y2={17} />
            </svg>
          </button>
        </div>}

      </a>
    </div>
  </div>
  )
}

const SettingTab = ({ setting }) => {

  return (
    <Link to={setting.to} onClick={setting.onClick} title={setting.tooltip} className="flex py-3 px-3 items-center gap-3 transition-colors duration-200 text-white cursor-pointer text-sm hover:bg-gray-800 rounded-md">
      <span className="flex w-full flex-row justify-between">
        <span className="gold-new-button flex items-center gap-3">
          {setting.Icon}
          <span className='text-ellipsis'>
            {setting.title}
          </span>
        </span>
        {setting.new && <span className="rounded-md bg-yellow-200 py-0.5 px-1.5 text-xs font-medium uppercase text-gray-800">
          NEW
        </span>}
      </span>
    </Link>
  )
}
const settings = [
  {
    new: true,
    title: "Chrome Extension for Emails",
    to: "#",
    type: "link",
    // Icon: <svg
    //   stroke="currentColor"
    //   fill="none"
    //   strokeWidth={2}
    //   viewBox="0 0 24 24"
    //   strokeLinecap="round"
    //   strokeLinejoin="round"
    //   className="h-4 w-4"
    //   height="1em"
    //   width="1em"
    //   xmlns="http://www.w3.org/2000/svg"
    // >
    //   <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    //   <circle cx={12} cy={7} r={4} />
    // </svg>,
    onClick: () => { window.location.href = "https://chromewebstore.google.com/detail/chatgpt-for-google-ai-ema/aoalmmfccpahldepdohigicplnemkdne" }
  },
  {
    new: true,
    title: "Build AI Solutions",
    to: "#",
    onClick: () => window.location.href = "https://convosuite.com/"
  },
  {
    new:true,
    tooltip:"",
    title: "Trained ChatGPT Data",
    type: "theme",
    to: "/inventory",
  //   Icon: <svg
  //   stroke="currentColor"
  //   fill="currentColor"
  //   strokeWidth={0}
  //   viewBox="0 0 576 512"
  //   className="w-6 h-6"
  //   height="1em"
  //   width="1em"
  //   xmlns="http://www.w3.org/2000/svg"
  // >
  //   <path d="M208 0c-29.9 0-54.7 20.5-61.8 48.2-.8 0-1.4-.2-2.2-.2-35.3 0-64 28.7-64 64 0 4.8.6 9.5 1.7 14C52.5 138 32 166.6 32 200c0 12.6 3.2 24.3 8.3 34.9C16.3 248.7 0 274.3 0 304c0 33.3 20.4 61.9 49.4 73.9-.9 4.6-1.4 9.3-1.4 14.1 0 39.8 32.2 72 72 72 4.1 0 8.1-.5 12-1.2 9.6 28.5 36.2 49.2 68 49.2 39.8 0 72-32.2 72-72V64c0-35.3-28.7-64-64-64zm368 304c0-29.7-16.3-55.3-40.3-69.1 5.2-10.6 8.3-22.3 8.3-34.9 0-33.4-20.5-62-49.7-74 1-4.5 1.7-9.2 1.7-14 0-35.3-28.7-64-64-64-.8 0-1.5.2-2.2.2C422.7 20.5 397.9 0 368 0c-35.3 0-64 28.6-64 64v376c0 39.8 32.2 72 72 72 31.8 0 58.4-20.7 68-49.2 3.9.7 7.9 1.2 12 1.2 39.8 0 72-32.2 72-72 0-4.8-.5-9.5-1.4-14.1 29-12 49.4-40.6 49.4-73.9z" />
  // </svg>,
    onClick: () => { }
  },
  
  {
    title: "Log Out",
    to: "#",
    Icon: <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="h-4 w-4"
      viewBox="0 0 24 24"
    >
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"></path>
      <path d="M16 17L21 12 16 7"></path>
      <path d="M21 12L9 12"></path>
    </svg>,
    onClick: () => { window.store.isLoggedIn && window.store.handleLogout() }
  },
]
export default withRouter(Sidebar)
