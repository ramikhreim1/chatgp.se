// import "./sideMenu.css"
import { observer, inject, } from 'mobx-react'

import models from "./models";
import { NavLink, Redirect } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./sideMenu.css";

const SideMenu = inject('store')(observer(({ store, setCurrentChat, deleteChat, currentChat, clearChat, currentModel, setCurrentModel, setTemperature, temperature, chats, createChat }) => {
  const [close, setClose] = useState(false)
  const [redirect, setRedirect] = useState("")
  const deleteAllChats = () => {
    if (!window.store.ensurePlan()) return
    store.api.delete('chat/-r/all').then(() => {
      clearChat()
    }).catch(() => {
      alert("failed to delete chats")
    })
  }

  return (
    <aside className={`${!close ? "close" : ""} sidemenu scroll-none overflow-visible`}>
      {redirect ? <Redirect to={redirect} /> : null}
      <div className="submenu scroll-none transition-all duration-500 flex flex-col">
        <button style={{ transform: !close ? "" : "rotate(-180deg)", left: "16.5rem" }} className={`absolute md:invisible bg-black p-1`} onClick={() => setClose(o => !o)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            className="h-6 w-6 text-white"
            viewBox="0 0 24 24"
          >
            {close ? <> <path d="M18 6L6 18"></path>
              <path d="M6 6L18 18"></path></> : <><path d="M3 12L21 12"></path>
              <path d="M3 6L21 6"></path>
              <path d="M3 18L21 18"></path></>}

          </svg>
        </button>
        <div className="relative h-full w-full items">
          <div className="side-menu-button" onClick={createChat}>
            <span>+</span>
            New Chat
          </div>
          <div className="models mt-3" >
            <div className="chatlist flex-col flex-1 overflow-y-auto -mr-2" style={{ maxHeight: "320px" }}>
              {chats.map(chat => {
                return (<>
                  <Item setCurrentChat={setCurrentChat} key={chat._id} api={store.api} item={chat} currentChat={currentChat} deleteChat={deleteChat} />
                </>)
              })}

            </div>

            {/* <div className="models mt-3">


              <label className="side-label">Model</label>
              <select
                // active if model is select is currentModel
                value={currentModel}
                className="select-models"
                onChange={(e) => {
                  // console.log(e);
                  setCurrentModel(e.target.value)
                }}>
                {models && models.length ? models.map((model, index) => (
                  <option
                    key={model.id}
                    value={model.id}>{model.id}</option>
                )) : <option
                  key={"text-davinci-003"}
                  value={"text-davinci-003"}>{"text-davinci-003"}</option>}
              </select>

              <Button
                text="Smart - Davinci"
                onClick={() => { console.log("text-davinci-003"); setCurrentModel("text-davinci-003") }} />
              <Button
                text="Code - Crushman"
                onClick={() => setCurrentModel("code-cushman-001")} />
              <span className="info">
                The model parameter controls the engine used to generate the response. Davinci produces best results.
              </span>
              <label className="side-label" >Temperature</label>
              <input
                className="select-models"
                type="number"
                onChange={(e) => setTemperature(e.target.value)}
                min="0"
                max="1"
                step="0.1"
                value={temperature}
              />
              <Button
                text="0 - Logical"
                onClick={() => setTemperature(0)} />
              <Button
                text="0.5 - Balanced"
                onClick={() => setTemperature(0.5)} />
              <Button
                text="1 - Creative"
                onClick={() => setTemperature(1)} />
              <span className="info">
                The temperature parameter controls the randomness of the model. 0 is the most logical, 1 is the most creative.
              </span> */}
            {/* </div> */}



          </div>
        </div>
        <div className="flex-1 border-b border-white/10"></div>
        <div className="mt-2">
          <SettingItem onClick={() => {
            window.store.ensurePlan() && window.confirm("Delete Conversations") && deleteAllChats()
          }} name="Clear Conversations" icon={<svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            viewBox="0 0 24 24"
          >
            <path d="M7 4a2 2 0 012-2h6a2 2 0 012 2v2h4a1 1 0 110 2h-1.069l-.867 12.142A2 2 0 0117.069 22H6.93a2 2 0 01-1.995-1.858L4.07 8H3a1 1 0 010-2h4V4zm2 2h6V4H9v2zM6.074 8l.857 12H17.07l.857-12H6.074zM10 10a1 1 0 011 1v6a1 1 0 01-2 0v-6a1 1 0 011-1zm4 0a1 1 0 011 1v6a1 1 0 01-2 0v-6a1 1 0 011-1z"></path>
          </svg>} />

          <SettingItem onClick={() => window.location.href = "/en/"} name="Chat GP Free Desktop App" icon={<svg
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
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>} new={true} />
          <SettingItem onClick={() => store.history.push("/inventory")} icon={<svg
  stroke="currentColor"
  fill="currentColor"
  strokeWidth={0}
  viewBox="0 0 576 512"
  className="w-6 h-6"
  height="1em"
  width="1em"
  xmlns="http://www.w3.org/2000/svg"
>
  <path d="M208 0c-29.9 0-54.7 20.5-61.8 48.2-.8 0-1.4-.2-2.2-.2-35.3 0-64 28.7-64 64 0 4.8.6 9.5 1.7 14C52.5 138 32 166.6 32 200c0 12.6 3.2 24.3 8.3 34.9C16.3 248.7 0 274.3 0 304c0 33.3 20.4 61.9 49.4 73.9-.9 4.6-1.4 9.3-1.4 14.1 0 39.8 32.2 72 72 72 4.1 0 8.1-.5 12-1.2 9.6 28.5 36.2 49.2 68 49.2 39.8 0 72-32.2 72-72V64c0-35.3-28.7-64-64-64zm368 304c0-29.7-16.3-55.3-40.3-69.1 5.2-10.6 8.3-22.3 8.3-34.9 0-33.4-20.5-62-49.7-74 1-4.5 1.7-9.2 1.7-14 0-35.3-28.7-64-64-64-.8 0-1.5.2-2.2.2C422.7 20.5 397.9 0 368 0c-35.3 0-64 28.6-64 64v376c0 39.8 32.2 72 72 72 31.8 0 58.4-20.7 68-49.2 3.9.7 7.9 1.2 12 1.2 39.8 0 72-32.2 72-72 0-4.8-.5-9.5-1.4-14.1 29-12 49.4-40.6 49.4-73.9z" />
</svg>
} name={"Inventory"} new={true}/>
          <SettingItem onClick={() => window.location.href = "https://convosuite.com/"} name={"GPT-4 Saas for AI Buissness"} new={true} />
          <SettingItem onClick={() => window.store.isLoggedIn ? store.handleLogout() : (() => { console.log("swedfg"); window.store.setPrevLocation(); window.store.history.push("/login") })()} name={window.store.isLoggedIn ? "Log Out" : "Log in"} icon={<svg
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
          </svg>} />
        </div>
      </div>
    </aside>
  )
}
))

const Item = ({ api, item, currentChat, deleteChat, setCurrentChat }) => {
  const [edit, setEdit] = useState(false)
  const [name, setName] = useState(item.name)

  const changeName = () => {
    api.patch(`/chat/${currentChat._id}`, {
      name
    }).then(res => {
      currentChat.name = name

    }).catch(er => {

    }).finally(() => {
      setEdit(false)
    })
  }

  return (
    <div className="flex flex-col gap-2 text-gray-100 text-sm">
      <div style={
        currentChat._id === item._id ? { background: "#2A2B32" } : {}
      } onClick={() => { setCurrentChat(item) }} className="flex py-3 px-3 items-center gap-3 relative rounded-md hover:bg-[#2A2B32] cursor-pointer break-all hover:pr-4 group">
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        {edit ? <input value={name} onChange={(e) => setName(e.target.value)} className="bg-transparent border border-blue-300 mr-1" name="name" id="name" /> : <div className="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative pr-10">
          {item.name}
        </div>}
        {
          currentChat._id === item._id && <div className="absolute flex right-1 z-10 text-gray-300 visible">
            {edit ? <button onClick={() => changeName()} className="p-1 hover:text-white">
              <svg stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="m5 13 4 4L19 7"></path>
              </svg>

            </button> : <button onClick={() => setEdit(true)} className="p-1 hover:text-white">
              <svg stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg></button>}

            <button onClick={() => deleteChat(currentChat._id)} className="p-1 hover:text-white"><svg stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1={10} y1={11} x2={10} y2={17} /><line x1={14} y1={11} x2={14} y2={17} /></svg></button></div>
        }
      </div>
    </div>
  )


}
const SettingItem = (props) => {

  return <div onClick={() => props.onClick()} className="flex flex-col gap-2 text-gray-100 text-sm">
    <div className="flex py-3 px-3 items-center gap-1 relative rounded-md hover:bg-[#2A2B32] cursor-pointer break-all group">
      {props.icon}
      <div className="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
        {props.name}
      </div>
      {props.new && <span class="rounded-md bg-yellow-200 py-0.5 px-1.5 text-xs font-medium uppercase text-gray-800">NEW</span>}
    </div>
  </div>
}
const Button = ({ onClick, text }) =>
  <div
    className="button-picker"
    onClick={onClick}>
    {text}
  </div>

export default SideMenu
