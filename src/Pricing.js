import React, { Component } from 'react';
import {
	CheckCircleIcon,
	BanIcon,
	DatabaseIcon,
	PencilIcon,
	MenuAlt1Icon,
	LightBulbIcon,
	SparklesIcon,
	UserIcon,
	CurrencyDollarIcon,
	UserCircleIcon,
} from '@heroicons/react/solid'

import config from './config'

import { observer, inject } from 'mobx-react'
import { withRouter } from 'react-router-dom';
@inject('store')
@observer
class Pricing extends Component {
	state = {
		param: {}
	}
	constructor(props) {
		super(props)

	}

	render() {
		const plans = ["free", "entry", "pro"]
		return (

			<>
				{plans.includes(this.state.param.plan) ? null : <>


					{/* {this.props.store.profile.status ? null : <div className="border-b border-gray-300 bg-white shadow-sm ">
					<div className="container flex mx-auto px-4 md:px-28 flex select-none">

						<div className="relative text-gray-400 focus-within:text-green-500 flex flex-1 ">
						</div>
						<div
							onClick={this.props.store.handleLogout}
							className="cursor-pointer text-lg flex py-3 px-6 xl:py-4 xl:px-8 hover:bg-gray-100 rounded-t-md font-medium transition items-center"><UserCircleIcon className="w-7 h-7 lg:mr-4 transition" />
							<div className="hidden lg:block"> Log Out</div>
						</div>


					</div>

				</div>} */}

					<div className="container mx-auto px-8 py-2 lg:px-22 lg:py-4 lg:pb-64 select-none pricing-container">

						{this.props.store.profile.status ? null : <>
							{/* <div className="text-center">
	<img src='/logo.gif'></img>
</div> */}

							<h2 className="text-lg sm:text-xl md:text-4xl text-gray-700 text-center">
								Start now
							</h2>
							<p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 mt-1 text-center">
								We offer three subscription plans to meet your needs. Whether you're a startup or a large enterprise, we have a plan that can help you improve customer engagement and save time.
							</p></>}

						<Grid>
							{this.props.store.profile.status ? null : <Free fromColor="gray-400" toColor="gray-500" baseURL={this.props.store.baseURL} api={this.props.store.api} />}
							<Entry fromColor="green-400" toColor="green-600" baseURL={this.props.store.baseURL} api={this.props.store.api} />
							<Premium fromColor="indigo-500" toColor="red-500" baseURL={this.props.store.baseURL} api={this.props.store.api} />
						</Grid>


					</div>

				</>}


			</>)
	}
}



const Free = ({ fromColor, toColor, baseURL, api }) => <div className="flex relative">
	<div className={`absolute inset-0 bg-gradient-to-r from-${fromColor ? fromColor : "green-400"} to-${toColor ? toColor : "blue-500"} shadow-lg transform skew-y-0 -rotate-3 rounded-3xl `}></div>

	<div className={`bg-white pricing-card rounded-xl transition hover:shadow-md overflow-hidden md:max-w-1lg text-gray-500 border-t-2 border- hover:border-${fromColor ? fromColor : "blue-400"} md:flex relative transform hover:scale-105  hover:text-black flex-1`}>

		<div className="p-8 flex-1">
			<div href="#" className={`text-${fromColor ? fromColor : "green-500"} block text-lg md:text-2xl leading-tight font-medium mb-2`}>Free</div>
			<div className="text-6xl text-black font-bold">$0<span className="text-lg text-gray-400"> free trial</span></div>
			<form action={baseURL + "user/stripe/subscribe"} method="POST" className="flex flex-1">
				<input type="hidden" name="token" value={api.defaults.headers.common['x-access-token']} />
				<input type="hidden" name="priceId" value={config.stripe.free} />
				<input type="hidden" name="trial" value="true" />
				<button type="submit" className={`mt-8 inset-0 bg-gradient-to-r from-${fromColor ? fromColor : "green-400"} to-${toColor ? toColor : "blue-500"} shadow-lg flex-1 rounded-md p-4 text-white font-medium text-center text-lg transition hover:from-gray-700 hover:to-gray-800 text-enter`}>Try Out</button>
			</form>
			<p className="mt-4 text-lg">Test before you buy, and upgrade or cancel anytime.</p>
			<div className="divide-y divide-dashed divide-gray-300 mt-4">

				<div className="py-1 flex  items-center">
					<RightIcon />
					<div className='text-sm'>Available even when demand is high</div>
				</div>
				<div className="py-1 flex  items-center">
					<RightIcon />
					<div className='text-sm'>Faster response speed</div>
				</div>
				<div className="py-1 flex  items-center">
					<RightIcon />
					<div className='text-sm'>No Priority acess to new features</div>
				</div>
				<div className="py-1 flex  items-center">
					<RightIcon />
					<div className='text-sm'><span className="font-medium text-black">500</span> ChatGPT WhatsApp Messages</div>
				</div>
				<div className="py-1 flex  items-center">
					<DatabaseIcon className={`w-6 h-6 mr-2 text-${fromColor ? fromColor : "green-500"}`} />
					<div className='text-sm'><span className="font-medium text-black">100</span>{` x `}Credits</div>
				</div>
				<div className="py-1 flex  items-center">
					<MenuAlt1Icon className={`w-6 h-6 mr-2 text-${fromColor ? fromColor : "green-500"}`} />
					<div className='text-sm'><span className="font-medium text-black">300</span>{` x `}Words</div>
				</div>
				<div className="py-1 flex  items-center">
					<PencilIcon className={`w-6 h-6 mr-2 text-${fromColor ? fromColor : "green-500"}`} />
					<div className='text-sm'><span className="font-medium text-black">1,200</span>{` x `}Letters</div>
				</div>

				<div className="py-1 flex  items-center">
					<BanIcon className="w-6 h-6 mr-2 text-gray-400" />
					<div className='text-sm'><span className="text-gray-400">Hours of usage saved</span></div>
				</div >
				<div className="py-1 flex  items-center">
					<BanIcon className="w-6 h-6 mr-2 text-gray-400" />
					<div className='text-sm'><span className="text-gray-400">Calculate billable saved</span></div>
				</div>
				<div className="py-1 flex  items-center">
					<BanIcon className="w-6 h-6 mr-2 text-gray-400" />
					<div className='text-sm'><span className="text-gray-400">Access to all tools</span></div>
				</div>
				<div className="py-1 flex  items-center">
					<BanIcon className="w-6 h-6 mr-2 text-gray-400" />
					<div className='text-sm'><span className="text-gray-400">New beta-feature testing</span></div>
				</div>
			</div>

		</div>
	</div>
</div>

const RightIcon = (props) => <svg className={`w-6 h-6 mr-2`} xmlns="http://www.w3.org/2000/svg" width="22" height="22">
	<g
		color='green'
		fillRule="evenodd"
		fill='none'
		stroke={props.stroke || "rgb(156,163,175)"}
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth="2"
	>
		<path d="M21 10.07V11a10 10 0 11-5.93-9.14"></path>
		<path d="M22 2L11 13l-3-3"></path>
	</g>
</svg>

const DIcon = (props) => <svg className={`w-6 h-6 mr-2`} xmlns="http://www.w3.org/2000/svg" viewBox='0 0 13 13' width="22" height="22">
	<path
		color='green'
		fillRule="evenodd"
		fill='none'
		stroke={props.stroke || "rgb(52,211,153)"}
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth="2"
		d="M4.986 3a.997.997 0 00-.98 1.014v7.859a.997.997 0 00.531 1.012.997.997 0 00.09.043.997.997 0 00.002 0 .997.997 0 00.094.031.997.997 0 00.058.014.997.997 0 00.057.011.997.997 0 00.1.012.997.997 0 00.113.002h1.953a.997.997 0 00.185-.016c2.661-.164 4.815-2.314 4.815-4.97 0-2.649-2.14-4.79-4.79-4.967a.997.997 0 00-.194-.018H5.229A.997.997 0 004.986 3zM6 5.021h.863c1.78 0 3.147 1.336 3.147 2.99 0 1.654-1.368 2.993-3.147 2.993H6V5.02z"
	></path>
</svg>

const Entry = ({ fromColor, toColor, baseURL, api }) => <div className="flex relative ">
	<div className={`absolute inset-0 bg-gradient-to-r from-${fromColor ? fromColor : "green-400"} to-${toColor ? toColor : "blue-500"} shadow-lg transform skew-y-0 -rotate-3 rounded-3xl `}></div>

	<div className={`bg-white pricing-card rounded-xl transition hover:shadow-md overflow-hidden md:max-w-1lg text-gray-500 border-t-2 border- hover:border-${fromColor ? fromColor : "blue-400"} md:flex relative transform hover:scale-105  hover:text-black flex-1`}>

		<div className="p-8 flex-1">
			<div href="#" className={`text-${fromColor ? fromColor : "green-500"} block text-lg text-2xl leading-tight font-medium mb-2`}>Entry</div>
			<div className="text-6xl text-black font-bold">$10<span className="text-lg text-gray-400">/per month</span></div>
			<form action={baseURL + "user/stripe/subscribe"} method="POST" className="flex flex-1">
				<input type="hidden" name="token" value={api.defaults.headers.common['x-access-token']} />
				<input type="hidden" name="priceId" value={config.stripe.entry} />
				<button type="submit" className={`mt-8 inset-0 bg-gradient-to-r from-${fromColor ? fromColor : "green-400"} to-${toColor ? toColor : "blue-500"} shadow-lg flex-1 rounded-md p-4 text-white font-medium text-center text-lg transition hover:from-gray-700 hover:to-gray-800 text-enter`}>Get Started</button>
			</form>
			<p className="mt-4 text-lg">
				Start today to get access to our powerful AI-powered features.
			</p>
			<div className="divide-y divide-dashed divide-gray-300 mt-4">
				<div className="py-1 flex  items-center">
					<RightIcon stroke="rgb(52,211,153)" className={`w-6 h-6 mr-2 text-${fromColor ? fromColor : "green-500"}`} />
					<div className='text-sm'>Available even when demand is high</div>
				</div>
				<div className="py-1 flex  items-center">
					<RightIcon stroke="rgb(52,211,153)" className={`w-6 h-6 mr-2 text-${fromColor ? fromColor : "green-500"}`} />
					<div className='text-sm'>Faster response speed</div>
				</div>
				<div className="py-1 flex  items-center">
					<RightIcon stroke="rgb(52,211,153)" className={`w-6 h-6 mr-2 text-${fromColor ? fromColor : "green-500"}`} />
					<div className='text-sm'>Priority acess to new features</div>
				</div>
				<div className="py-1 flex  items-center">
					<RightIcon stroke="rgb(52,211,153)" className={`w-6 h-6 mr-2 text-${fromColor ? fromColor : "green-500"}`} />
					<div className='text-sm'><span className="font-medium text-black">Value 20$</span>Unlimited ChatGPT GPT4 messsages</div>
				</div>
				<div className="py-1 flex  items-center">
					<DIcon stroke="rgb(99,102,241)" />
					<div className='text-sm'>Value 10$ AI Image 1000 generations, Value 10$,PDF ,Documents uploading.</div>
				</div>
				<div className="py-1 flex  items-center">
					<DatabaseIcon className={`w-6 h-6 mr-2 text-${fromColor ? fromColor : "green-500"}`} />
					<div className='text-sm'><span className="font-medium text-black">30$</span>{` x `}Saving</div>
				</div>
				<div className="py-1 flex  items-center">
					<MenuAlt1Icon className={`w-6 h-6 mr-2 text-${fromColor ? fromColor : "green-500"}`} />
					<div className='text-sm'><span className="font-medium text-black">Train ChatGPT on your Data</span>{` x `}PDF, DOC, CSV, DOCX, Audio, Video</div>
				</div>
				<div className="py-1 flex  items-center">
					<PencilIcon className={`w-6 h-6 mr-2 text-${fromColor ? fromColor : "green-500"}`} />
					<div className='text-sm'><span className="font-medium text-black">Whisper</span>{` x `}Audio Video Processing</div>
				</div>
				<div className="py-1 flex  items-center">
					<UserIcon className={`w-6 h-6 mr-2 text-${fromColor ? fromColor : "green-500"}`} />
					<div className='text-sm'><span className="font-medium text-black">1GB</span>{` x `}PDF, Documents uploading</div>
				</div>
				<div className="py-1 flex  items-center">
					<CheckCircleIcon className={`w-6 h-6 mr-2 text-${fromColor ? fromColor : "green-500"}`} />
					<div className='text-sm'><span className="font-medium text-black">45</span>{` x `}hours of time saved</div>
				</div>
				<div className="py-1 flex  items-center">
					<CurrencyDollarIcon className={`w-6 h-6 mr-2 text-${fromColor ? fromColor : "green-500"}`} />
					<div className='text-sm'><span className="font-medium text-black">$1,000</span>{` x `} billable time saved</div>
				</div>
				<div className="py-1 flex  items-center">
					<BanIcon className="w-6 h-6 mr-2 text-gray-400" />
					<div className='text-sm'><span className="text-gray-400">API Access</span></div>
				</div>
				<div className="py-1 flex  items-center">
					<BanIcon className="w-6 h-6 mr-2 text-gray-400" />
					<div className='text-sm'><span className="text-gray-400">New beta-feature testing</span></div>
				</div>
			</div>
		</div>
	</div>
</div>


const Premium = ({ fromColor, toColor, baseURL, api }) => <div className="flex relative ">
	<div className={`absolute inset-0 bg-gradient-to-r from-${fromColor ? fromColor : "green-400"} to-${toColor ? toColor : "blue-500"}  shadow-lg transform skew-y-0 -rotate-3 rounded-3xl `}></div>

	<div className={`bg-white pricing-card rounded-xl transition hover:shadow-md overflow-hidden md:max-w-1lg text-gray-500 border-t-2 border- hover:border-${fromColor ? fromColor : "blue-400"} md:flex relative transform hover:scale-105  hover:text-black flex-1`}>

		<div className="p-8 flex-1">
			<div href="#" className={`text-${fromColor ? fromColor : "green-500"} block text-lg text-2xl leading-tight font-medium mb-2`}>Pro</div>
			<div className="text-6xl text-black font-bold">$15<span className="text-lg text-gray-400">/per month</span></div>
			<form action={baseURL + "user/stripe/subscribe"} method="POST" className="flex flex-1">
				<input type="hidden" name="token" value={api.defaults.headers.common['x-access-token']} />
				<input type="hidden" name="priceId" value={config.stripe.pro} />
				<button type="submit" className={`mt-8 inset-0 bg-gradient-to-r from-${fromColor ? fromColor : "green-400"} to-${toColor ? toColor : "blue-500"} shadow-lg flex-1 rounded-md p-4 text-white font-medium text-center text-lg transition hover:from-gray-700 hover:to-gray-800 text-enter`}>Get Started</button>
			</form>
			<p className="mt-4 text-lg">
				Start today to get access to our powerful AI-powered features.
			</p>
			<div className="divide-y divide-dashed divide-gray-300 mt-4">
				<div className="py-1 flex  items-center">
					<RightIcon stroke="rgb(99,102,241)" className={`w-6 h-6 mr-2 text-${fromColor ? fromColor : "green-500"}`} />
					<div className='text-sm'>Available even when demand is high</div>
				</div>
				<div className="py-1 flex  items-center">
					<RightIcon stroke="rgb(99,102,241)" className={`w-6 h-6 mr-2 text-${fromColor ? fromColor : "green-500"}`} />
					<div className='text-sm'>Faster response speed</div>
				</div>
				<div className="py-1 flex  items-center">
					<RightIcon stroke="rgb(99,102,241)" className={`w-6 h-6 mr-2 text-${fromColor ? fromColor : "green-500"}`} />
					<div className='text-sm'>Priority acess to new features</div>
				</div>
				<div className="py-1 flex  items-center">
					<RightIcon stroke="rgb(99,102,241)" className={`w-6 h-6 mr-2 text-${fromColor ? fromColor : "green-500"}`} />
					<div className='text-sm'>Value 20$ Unlimited ChatGPT GPT4 messsages</div>
				</div>
				<div className="py-1 flex  items-center">
					<DIcon stroke="rgb(99,102,241)" />
					<div className='text-sm'>Value 20$ Unlimited AI Image generations, Value 20$ large PDF, Documents uploading.</div>
				</div>
				<div className="py-1 flex  items-center">
					<DatabaseIcon className={`w-6 h-6 mr-2 text-${fromColor ? fromColor : "green-500"}`} />
					<div className='text-sm'><span className="font-medium text-black">40$</span>{` x `}Saving</div>
				</div>
				<div className="py-1 flex  items-center">
					<MenuAlt1Icon className={`w-6 h-6 mr-2 text-${fromColor ? fromColor : "green-500"}`} />
					<div className='text-sm'><span className="font-medium text-black">Train ChatGPT on your Data</span>{` x `}PDF, DOC, DOCX, CSV, Audio, Video</div>
				</div>
				<div className="py-1 flex  items-center">
					<PencilIcon className={`w-6 h-6 mr-2 text-${fromColor ? fromColor : "green-500"}`} />
					<div className='text-sm'><span className="font-medium text-black">Whisper integrated</span>{` x `}Audio Video Processing</div>
				</div>
				<div className="py-1 flex  items-center">
					<UserIcon className={`w-6 h-6 mr-2 text-${fromColor ? fromColor : "green-500"}`} />
					<div className='text-sm'><span className="font-medium text-black">10,800</span>{` x `}minutes saved</div>
				</div>
				<div className="py-1 flex  items-center">
					<CheckCircleIcon className={`w-6 h-6 mr-2 text-${fromColor ? fromColor : "green-500"}`} />
					<div className='text-sm'><span className="font-medium text-black">180</span>{` x `}hours of time saved</div>
				</div>
				<div className="py-1 flex  items-center">
					<CurrencyDollarIcon className={`w-6 h-6 mr-2 text-${fromColor ? fromColor : "green-500"}`} />
					<div className='text-sm'><span className="font-medium text-black">$4,000</span>{` x `} billable time saved</div>
				</div>
				<div className="py-1 flex  items-center">
					<SparklesIcon className={`w-6 h-6 mr-2 text-${fromColor ? fromColor : "green-500"}`} />
					<div className='text-sm'><span className="font-medium text-black">API Access</span></div>
				</div>
				<div className="py-1 flex  items-center">
					<LightBulbIcon className={`w-6 h-6 mr-2 text-${fromColor ? fromColor : "green-500"}`} />
					<div className='text-sm'><span className="font-medium text-black">New beta-feature testing</span></div>
				</div>
			</div>

		</div>
	</div>
</div>

const Grid = ({ children }) => <div className="grid grid-cols-1 gap-12 mt-4 xl:grid-cols-3 ">{children}</div>


export default withRouter(Pricing)
