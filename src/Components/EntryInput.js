import React, { Component } from 'react'
import { computed } from 'mobx'
import { observer, inject } from 'mobx-react'
import TextareaAutosize from 'react-textarea-autosize';
import { CheckIcon } from '@heroicons/react/outline'

import EntryDropdown from './EntryDropdown'

import CodeEditor from "@uiw/react-textarea-code-editor";


@inject("store")
@observer
class EntryInput extends Component {

	constructor(props) {
		super(props);
		this.callRef = React.createRef();
	}


	onChange = async (e) => {
		// console.log(this.props.prompt);
		this.props.prompt.value = e.target.value
		this.props.prompt.error = ""
	}
	addMsg = async (e) => this.props.addMsg();

	onChangeDropdown = async (e) => {
		this.props.prompt.value = e.value
		this.props.prompt.error = ""
	}

	handleEditorChange = (e, value) => {
		// console.log(e)
		this.props.prompt.value = e.target.value
		this.props.prompt.error = ""
	};


	@computed get isMinLength() {
		if (!this.props.prompt.min) {
			return false
		}
		if (!this.props.prompt.type === "number") {
			return false
		}
		if (this.props.prompt.value.length === 0) {
			return false
		}
		if (this.props.prompt.value.length < this.props.prompt.min) {
			return true
		}
		return false
	}

	@computed get isLongEnoughToDrop() {
		return this.props.prompt.value.length < 30
	}

	@computed get currentNumberOfCharacters() {

		let currentCharacters = this.props.prompt.value.length
		let maxCharacters = 80
		if (this.props.prompt.type === "textarea") {
			maxCharacters = 400
		}
		if (this.props.prompt.maxLength) {
			maxCharacters = this.props.prompt.maxLength
		}
		if (this.props.prompt.max) {
			maxCharacters = this.props.prompt.max
		}

		return `${currentCharacters}/${maxCharacters}`
	}
	componentDidMount() {

	}

	render() {
		const { Icon } = this.props
		return (
			<div className={`${this.props.size ? "mt-4" : "mt-4"}`} style={this.props.chat ? { width: "85%", margin: "auto" } : {}}>

				{!this.props.chat ? this.props.prompt.title && <label
					htmlFor={this.props.prompt.attr}
					className="text-gray-600 font-medium text-md">
					{this.props.prompt.title}
				</label> : ""}

				<div className="relative flex flex-col">

					{this.props.chat || this.props.prompt.options ? null : <div className={`text-xs absolute z-30 right-2 select-none pointer-events-none transition-all top bg-white px-2 ${this.isMinLength ? "text-red-500" : "text-gray-400"} ${(!this.isLongEnoughToDrop && this.props.size) ? "" : ""}`}>
						{this.currentNumberOfCharacters} chars
					</div>}

					{
						this.props.chat ?
							<form style={{ position: "relative" }} onSubmit={e => { e.preventDefault(); this.addMsg(e) }}>

								<textarea
									name={this.props.prompt.attr}
									id={this.props.prompt.attr}
									value={this.props.prompt.value}
									rows={1}
									{...this.props.prompt}
									style={{ backgroundColor: "#444654" }}
									autoFocus={this.props.index === 0}
									className={`scrollbar-none flex-1 outline-none focus:outline-none text-${this.props.size || "lg"} bg-white rounded-md px-4 py-2 w-full border  focus:border-gray-400 ${this.props.prompt.error ? "border-red-400" : "border-gray-300"} font-regular mt-2 transition-all ${Icon && `
						${this.props.size ? "" : "pl-9"}
						${this.props.size === "sm" && "pl-7"}
						${this.props.size === "lg" && "pl-12"}
						`} `}
									onChange={e => {
										this.onChange(e)
									}}
									onKeyUp={e => {
										if (e.key === "Enter") {
											this.addMsg(e)
											e.target.value=""
											this.onChange(e)
										}
									}}
								/>
								<button
									ref={this.callRef}
									type='submit'
									disabled={this.props.loading}
									style={{
										position: "absolute",
										right: "11px",
										top: "50%",
										transform: "translate(0, -50%)"
									}}><svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
										<path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
									</svg></button>
							</form>
							: <>
								<label htmlFor={this.props.prompt.attr} className="relative transition text-gray-600 focus-within:text-gray-800 block">
									{Icon ? <Icon className={`
					${this.props.size ? "" : "h-6 w-6 top-5 left-2"} 
					${this.props.size === "sm" && "h-4 w-4 top-5 left-2"} 
					${this.props.size === "lg" && "h-8 w-8 top-5 left-2"} 
					transition absolute  select-none pointer-events-none opacity-75`} /> : null}
									{this.props.prompt.type ? null :
										<div className='flex'>
											<input
												name={this.props.prompt.attr}
												id={this.props.prompt.attr}
												value={this.props.prompt.value}
												maxLength={this.props.prompt.maxLength || 80}
												{...this.props.prompt}
												autoFocus={this.props.index === 0}
												className={`flex-1 outline-none focus:outline-none text-${this.props.size || "lg"} bg-white rounded-md px-4 py-2 w-full border  focus:border-gray-400 ${this.props.prompt.error ? "border-red-400" : "border-gray-300"} font-regular mt-2 transition-all ${Icon && `
						${this.props.size ? "" : "pl-9"}
						${this.props.size === "sm" && "pl-7"}
						${this.props.size === "lg" && "pl-12"}
						`} `}
												onChange={this.onChange}
											/>
										</div>
									}

									{this.props.prompt.type === "text" && <input
										name={this.props.prompt.attr}
										value={this.props.prompt.value}
										id={this.props.prompt.attr}
										maxLength={this.props.prompt.maxLength || 400}
										{...this.props.prompt}
										autoFocus={this.props.index === 0}
										className={`outline-none focus:outline-none text-${this.props.size || "lg"} bg-white rounded-md px-4 py-2 w-full border  focus:border-gray-400  ${this.props.prompt.error ? "border-red-400" : "border-gray-300"} font-regular mt-2 transition-all ${Icon && `
						${this.props.size ? "" : "pl-7"}
						${this.props.size === "sm" && "pl-7"}
						${this.props.size === "lg" && "pl-12"}
						`}`}
										onChange={this.onChange}
									/>}
								</label>

								{this.props.prompt.type === "dropdown" &&
									<EntryDropdown
										onChange={this.onChangeDropdown}
										options={this.props.prompt.options}
									/>
								}

								{this.props.prompt.type === "code" && <div className="mt-4 -mx-6" style={{ backgroundColor: "#f5f5f5" }}>
									<CodeEditor
										// height="350px"
										style={{
											fontFamily: 'JetBrains Mono',
											fontSize: "1rem",
										}}
										padding={30}
										language={this.props.language}
										onChange={this.onChange}
										autoFocus={this.props.index === 0}
										name={this.props.prompt.attr}
										id={this.props.prompt.attr}
										{...this.props.prompt}
									/>
								</div>}



								{this.props.prompt.type === "textarea" && <TextareaAutosize
									autoFocus={this.props.index === 0}
									minRows={this.props.minRows || 2}
									maxRows={10}
									name={this.props.prompt.attr}
									id={this.props.prompt.attr}
									{...this.props.prompt}
									className={`outline-none focus:outline-none text-${this.props.size || "lg"} bg-white rounded-md ${this.props.size ? "px-2 py-2" : "px-4 py-4"}  min-w-full border border-gray-300 font-regular focus:border-gray-400 ${this.props.prompt.error ? "border-red-400" : "border-gray-300"} font-regular mt-2 `}
									onChange={this.onChange}
								/>}

								{this.props.prompt.type === "radio" && this.props.prompt.options && <>
									<div className="mt-1">
										{this.props.prompt.options.map((option, index) =>
											<Option
												key={index}
												Icon={option.Icon}
												title={option.title}
												desc={option.desc}
												active={option.value === this.props.prompt.value}
												onClick={() => this.props.prompt.value = option.value}
											/>)}
									</div>
								</>}

							</>
					}

				</div>

				{(this.props.prompt.label || this.props.prompt.error) && <div
					htmlFor={this.props.prompt.attr}
					className={`${this.props.prompt.error ? "text-red-400" : "text-gray-400"} text-xs transition-all line mt-1`}>
					{this.props.prompt.error || this.props.prompt.label}
				</div>}

			</div>
		)
	}
}

const Option = ({ index, title, desc, active, onClick, Icon }) => <div className={`select-none flex w-full text-left items-center font-medium py-1 px-2 hover:bg-${active ? "green" : "gray"}-200 bg-${active ? "green" : "na"}-100 rounded-md cursor-pointer transition`} onClick={onClick}>
	<div className={`flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-${active ? "green-500" : "gray-300"} mr-4 transition`}>
		{Icon ?
			<Icon className={`transition h-4 w-4 text-${active ? "white" : "gray-400"}`} aria-hidden="true" /> :
			<CheckIcon className={`transition h-4 w-4 text-${active ? "white" : "gray-400"}`} aria-hidden="true" />}
	</div>
	<div>
		{title}
		<div className="font-normal text-sm">{desc}</div>
	</div>
</div>

export default EntryInput

// export const MultipleOption = observer(({ title, value, onChange, placeholder, examples, index, ...props }) => {
// 	return (
// 	   <div className="mt-6">
// 			<label htmlFor={title} className="text-gray-600 font-medium text-md">{title}</label>
// 			{props.type === "textarea" ? <textarea
// 			  name={title}
// 			  id={title}
// 			  {...props}
// 			  className="focus:outline-none text-lg bg-white rounded-md px-4 py-2  min-w-full border border-gray-300 font-regular mt-2"
// 			  value={value}
// 			  onChange={e=>onChange(e.target.value,index)}
// 			  placeholder={placeholder} /> : <input
// 			  name={title}
// 			  id={title}
// 			  {...props}
// 			  className="focus:outline-none text-lg bg-white rounded-md px-4 py-2  min-w-full border border-gray-300 font-regular mt-2"
// 			  value={value}
// 			  onChange={e=>onChange(e.target.value,index)}
// 			  placeholder={placeholder}  />}
// 			{examples && <label htmlFor={title} className="text-gray-400 text-xs">{examples}</label>}
// 		  </div>
// 	  )
//   })