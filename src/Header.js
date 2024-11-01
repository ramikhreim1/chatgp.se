import React, { Component } from 'react';
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import { computed, } from 'mobx'
import { Link, NavLink } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import {
	SwitchHorizontalIcon, ScaleIcon, DatabaseIcon, UserCircleIcon,
} from '@heroicons/react/outline'

import { IconDashboard, } from './Icons'

import { useLocation } from 'react-router-dom'
import Body from './Components/Body'
import { withRouter } from "react-router-dom";

function HeaderExpand(props) {
	const location = useLocation();
	return <SuperHeader
		active={location.pathname === "/tools" ? true : false}

	>{props.children}</SuperHeader>
}

@inject('store')
@observer
class SidebarCompontent extends Component {

	constructor(props) {
		super(props);
		// if (this.props.location.pathname === "/signup") {
		// 	this.props.history.push('/')
		// }
		// if (this.props.location.pathname === "/login") {
		// 	this.props.history.push('/')
		// }

	}
	componentDidMount() {
		document.addEventListener('keydown', this.shortcutHandler);
	}
	componentWillUnmount() {
		document.removeEventListener('keydown', this.shortcutHandler);
	}
	shortcutHandler = e => {
		if (e.keyCode === 75 && e.ctrlKey) {
			e.preventDefault();
			// select all text in input with id q
			document.getElementById("q").focus();
			document.getElementById("q").select();
		}
	}

	onKeyUp = (e) => {
		if (this.props.location.pathname !== "/search") {
			this.props.history.push('/search')
		}
		if (e.keyCode === 8) {
			if (this.props.store.toolsKeyword === "") {
				this.props.history.push('/tools')
			}
		}
	}

	@computed get fromColor() {
		if (this.props.store.profile.credits <= 0) {
			return "bg-red-200 text-red-600"
		}
		if (this.props.store.profile.status === "trialing") {
			return ""
		}
		if (this.props.store.profile.status === "active") {
			return ""
		}
		if (this.props.store.profile.status === "incomplete") {
			return ""
		}
		return "bg-red-200 text-red-600"
	}
	openSidebar = () => {
		document.getElementById("sidebar_mob")?.classList.add('show')
	}
	render() {
		return (
			<header>
				<Textarea readOnly name="copy-textarea" id="copy-textarea" value={this.props.store.copyToClipboardText} />
				<HeaderExpand>
					<Body className="px-3 py-3 md:px-28 md:py-8 lg:py-12 flex items-center flex-1 gap-4">
						<div className="mr-4">
							<NavLink to="/tools"><Logo /></NavLink>
						</div>
						<div className='mt-4'>
							<h1 className="hidden md:block text-xl text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-500 inline-block">Unlock the Power of AI with Revolutionary GPT-4 Powerd by OpenAI, Google , Dall-e and More!</h1>
							<div className="flex">
								{window.store.isLoggedIn && <div className={`items-center flex inline-flex ${this.props.store.profile.credits ? " bg-gray-100 text-gray-500" : " bg-red-100 text-red-500"} text-sm rounded-md px-3 py-1 font-medium my-2 mr-2`}>
									{window.store.isLoggedIn && window.store.profile?.status ? <>
										<DatabaseIcon className="w-4 h-4 mr-2" />{this.props.store.profile.credits}&nbsp;<span className="hidden lg:block">credits remain</span>
									</> : <>
										<Link className="hidden lg:block cursor-pointer" to={"/my-profile/pricing"}>Buy Credits</Link>
									</>}
								</div>}
							</div>
						</div>
					</Body>
				</HeaderExpand>
				<div className="border-b border-gray-300 bg-white shadow-sm ">
					<div className="container flex mx-auto px-4 md:px-28 flex select-none">
						{
							window.location.pathname === "/ai/ChatGPT" && window.innerWidth <= 768 && <button onClick={() => this.openSidebar()}
								exact
								tabIndex={-1}
								activeClassName="bg-gray-100 hover:bg-gray-200 text-gray-800 transition"
								className="text-lg flex lg:py-4 lg:px-8 cursor-pointer hover:bg-gray-100 rounded-t-md font-medium transition items-center">
								<svg
									stroke="currentColor"
									fill="black"
									strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 lg:mr-4 transition" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
									<line x1={3} y1={12} x2={21} y2={12} />
									<line x1={3} y1={6} x2={21} y2={6} />
									<line x1={3} y1={18} x2={21} y2={18} />
								</svg>
								<div className="hidden lg:block">Tools</div>
							</button>
						}

						<NavLink to="/tools"
							exact
							tabIndex={-1}
							onClick={() => this.props.store.toolsKeyword = ""}
							activeClassName="bg-gray-100 hover:bg-gray-200 text-gray-800 transition"
							className="text-lg flex py-3 px-6 lg:py-4 lg:px-8 cursor-pointer hover:bg-gray-100 rounded-t-md font-medium transition items-center">
							<IconDashboard className="w-7 h-7 lg:mr-4 transition" />
							<div className="hidden lg:block">Tools</div>
						</NavLink>

						<div className="relative text-gray-400 focus-within:text-green-500 flex flex-1 ">
							<label htmlFor="q" className="absolute inset-y-0 left-0 top-0 bottom-0 hidden md:flex items-center lg:pl-2 ">
								<div type="submit" className="p-2 focus:outline-none focus:shadow-outline ">
									<svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6 transition"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
								</div>
							</label>
							<Input
								type="search"
								tabIndex={-1}
								id="q"
								name="q"
								className="py-4 pl-4 md:pl-14 text-xl focus:outline-none focus:bg-white focus:text-gray-900 transition flex flex-1 w-full" placeholder="Search...  [Shortcut: Ctrl + K]" autoComplete="off"
								value={this.props.store.toolsKeyword}
								onChange={this.props.store.onChangeToolsKeyword}
								onKeyUp={this.onKeyUp}
							/>
						</div>
						{window.store.isLoggedIn ? <NavLink to="/my-profile"
							exact
							tabIndex="-1"
							activeClassName="bg-green-100 hover:bg-green-200 text-green-800 transition"
							className={`text-lg flex py-3 px-6 xl:py-4 xl:px-8 cursor-pointer ${this.fromColor} hover:bg-gray-100 rounded-t-md font-medium transition items-center`}><UserCircleIcon className="w-7 h-7 lg:mr-4 transition" />
							<div className="hidden lg:block"> My Profile</div>
						</NavLink> : <NavLink to="/login"
							exact
							tabIndex="-1"
							activeClassName="bg-green-100 hover:bg-green-200 text-green-800 transition"
							className={`text-lg flex py-3 px-6 xl:py-4 xl:px-8 cursor-pointer ${this.fromColor} hover:bg-gray-100 rounded-t-md font-medium transition items-center`}><UserCircleIcon className="w-7 h-7 lg:mr-4 transition" />
							<div className="hidden lg:block"> Log in</div>
						</NavLink>}



					</div>

				</div>
				{this.props.children}
			</header>
		)
	}
}

const Logo = () => (
	<img src='/logo.gif' />

)

const Input = styled.input`

`

const Textarea = styled.textarea`
	position: fixed;
	right:-9990px;
	top:-9990px;
`

// transition:ease-in-out 0.5s margin-top;
// 	transition-delay:0.05s;

const SuperHeader = styled.div`
	height:150px;
	background:white;
	margin-top:${props => props.active ? "0px" : "-150px"};
	display:${props => props.hidden ? "hidden" : "flex"};
	background-image:url(${require('./pattern-dots.svg').default});
	background-size:auto 50%;
	background-position: 20px 20px;
	background-repeat:no-repeat;
	position:relative;

`



export default withRouter(SidebarCompontent)