import React, { Component } from 'react';
import { Link, Switch, Route, } from 'react-router-dom'
import { computed, observable, makeObservable } from 'mobx'
import Header from '../Components/Header'
import {
	IdentificationIcon, CheckIcon,
	// eslint-disable-next-line no-unused-vars
	ChatAltIcon, UsersIcon, UserCircleIcon, ReplyIcon, ChevronLeftIcon, DatabaseIcon
} from '@heroicons/react/outline'
import MainBody from '../Components/Body'
import Referral from './Referral'
import Feedback from './Feedback'
import { Helmet } from "react-helmet";
// eslint-disable-next-line no-unused-vars
import EnvIcon from './EnvIcon'
import { withRouter } from 'react-router-dom'
import { observer, inject } from 'mobx-react'
import Pricing from '../Pricing'
import ResetPassword from '../Components/ResetPassword';
import Footer from '../Components/Footer';
import { Loading } from '../util/helper';

@inject('store')
@observer
class Body extends Component {

	@computed get headerMessage() {
		if (this.props.store.profile.status === "trialing") {
			return "7 Day Trial"
		}
		if (this.props.store.profile.status === "active") {
			if (this.props.store.profile.cancel_at_period_end) {
				return `Set to cancel soon`
			}
			return `${this.props.store.profile.plan} Plan`
		}
		if (this.props.store.profile.status === "incomplete") {
			return `${this.props.store.profile.plan} Plan Restarted`
		}
		return "Expired"
	}

	@computed get ifNotActive() {
		if (this.props.store.profile.cancel_at_period_end) {
			return "Canceled"
		}
		if (this.props.store.profile.status === "trialing") {
			return "Trialing"
		}
		return false
	}

	@computed get fromColor() {
		if (this.props.store.profile.status === "trialing") {
			return "gray-400"
		}
		if (this.props.store.profile.status === "active") {
			if (this.props.store.profile.cancel_at_period_end) {
				return "yellow-500"
			}
			return "green-500"
		}
		if (this.props.store.profile.status === "incomplete") {
			return "yellow-600"
		}
		return "red-500"
	}

	@computed get currentPeriodEnd() {
		if (this.props.store.profile.current_period_end && this.props.store.profile.current_period_end.length > 0) {
			var days_difference = Math.round(((new Date(this.props.store.profile.current_period_end)).getTime() - (new Date()).getTime()) / (1000 * 60 * 60 * 24));
			if (days_difference < 0) {
				return 0
			}
			return days_difference
		}
		return 0
	}

	@observable plan = {
		plan: '',
	}

	componentDidMount() {
		this.props.store.refreshTokenAndProfile()
		makeObservable(this);
		this.init()
	}

	@observable loading_plan = true

	init = async () => {
		let res = await this.props.store.api.post("/user/stripe/plan")
		this.plan = {
			...res.data
		}
		this.loading_plan = false;
	}

	onBack = () => {
		this.props.history.push(`/my-profile`)
	}


	render() {
		return (
			<>
				<Header
					title={this.props.store.profile.email}
					desc={`${this.props.store.profile.fname} ${this.props.store.profile.lname}`}
					category="Your Profile"
					Icon={UserCircleIcon}
					fromColor={this.fromColor}
					options={
						this.props.location.pathname !== "/my-profile" ? [{ title: "Back to Profile", Icon: ChevronLeftIcon, onClick: this.onBack }] : null
					}
				>
					<Route exact path="/my-profile">
						<Helmet>
							<title>{`My Profile - Chat GP`}</title>
						</Helmet>

					</Route>

				</Header>
				<MainBody className="px-4 py-4 md:px-28 md:py-8 lg:py-12">

					<Switch>
						<Route exact path="/my-profile/pricing">
							<Pricing />
						</Route>
						<Route exact path="/my-profile/referral">
							<Referral />
						</Route>
						<Route exact path="/my-profile/feedback">
							<Feedback />
						</Route>
						<Route exact path="/my-profile/resetPassword">
							<ResetPassword />
						</Route>
						<Route>

							{<Grid>

								{/* {this.plan.status === "trialing" ?
	<ToolForm
		Icon={CheckIcon}
		title={`Active Subscription`}
		desc={`${this.plan.plan === "Entry" ? "$30" : ""}${this.plan.plan === "Pro" ? "$90" : ""} billing  immediately. Ends trial and starts billing plan.`}
		to={this.props.store.baseURL + "/user/stripe/activate"}
		api={this.props.store.api}
		fromColor="purple-500"
		toColor="indigo-600"
	/> : null} */}



								{this.plan.plan === "None" ? <Tool
									Icon={IdentificationIcon}
									title={"Pricing Plans"}
									api={this.props.store.api}
									desc={"Upgrade, downgrade or cancel anytime."}
									to={"/my-profile/pricing"}
									fromColor="red-400"
								/> : null}


								{this.headerMessage === "Expired" ? null : <>
									{this.ifNotActive ? null : <>

										<ToolForm
											Icon={IdentificationIcon}
											title={"Cancel Subscription"}
											api={this.props.store.api}
											desc={"Immediately cancelation of subscription and payments."}
											to={this.props.store.baseURL + "user/stripe/cancel"}
											fromColor={this.props.store.profile.cancel_at_period_end ? "red-600" : "red-500"}
											toColor={this.props.store.profile.cancel_at_period_end ? "red-400" : "red-600"}
										/>


									</>}

									{this.props.store.profile.cancel_at_period_end ? <>

										<ToolForm
											Icon={CheckIcon}
											title={"Reactivate Subscription"}
											api={this.props.store.api}
											desc={"Immediately cancelation of subscription and payments."}
											to={this.props.store.baseURL + "user/stripe/uncancel"}
											fromColor={this.props.store.profile.cancel_at_period_end ? "green-400" : "green-500"}
											toColor={this.props.store.profile.cancel_at_period_end ? "green-400" : "green-500"}
										/>

									</> : null}
									<ToolForm
										Icon={IdentificationIcon}
										title={this.props.store.profile.cancel_at_period_end ? "Manage Subscription" : "Update Subscription"}
										api={this.props.store.api}
										desc={"Change your plan, card details, or cancel the plan anytime."}
										to={this.props.store.baseURL + "user/stripe/customer-portal"}
										fromColor={this.props.store.profile.cancel_at_period_end ? "blue-600" : "blue-500"}
										toColor={this.props.store.profile.cancel_at_period_end ? "blue-400" : "blue-600"}
									/></>}

								<ToolForm
									Icon={DatabaseIcon}
									title={"Buy Credits"}
									desc={"250 x extra credits quick-buy"}
									to={this.props.store.baseURL + "user/stripe/buy250"}
									api={this.props.store.api}
									fromColor="purple-500"
									toColor="indigo-600"
								/>


								<Tool
									className=""
									Icon={ReferralIcon}
									title={"Referral"}
									desc={"Refer and earn 100 credits"}
									to={"/my-profile/referral"}
									fromColor="green-400"
									toColor="green-800"
								/>

								<Tool
									className=""
									Icon={DatabaseIcon}
									title={"Inventory"}
									desc={"Oversee files and documents"}
									to={"/inventory"}
									fromColor="green-400"
									toColor="green-800"
								/>

								<Tool
									Icon={ChatAltIcon}
									title={"Feedback"}
									desc={"Provide comments on your experience"}
									to={"/my-profile/feedback"}
									fromColor="yellow-400"
									toColor="yellow-400"
								/>

								<Tool
									Icon={() => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
										<path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
									</svg>
									}
									title={"Reset Password"}
									desc={"Change your account password"}
									to={"/my-profile/resetPassword"}
									fromColor="gray-400"
									toColor="gray-400"
								/>



								<ToolDiv
									Icon={ReplyIcon}
									title={"Log Out"}
									desc={"Sign out of your account"}
									onClick={this.props.store.handleLogout}
									fromColor="gray-400"
									toColor="gray-400"
								/>
							</Grid>}


						</Route>
					</Switch>
				</MainBody>
				<Footer />
			</>)
	}
}

const Grid = ({ children }) => <div className="grid grid-cols-1 gap-8 mt-4 lg:grid-cols-2 xl:grid-cols-3 ">{children}</div>

const ToolDiv = ({ Icon, title, desc, to, group, fromColor, toColor, onClick }) => <><div className="flex relative " onClick={onClick}>
	<div className={`absolute inset-0 bg-gradient-to-r from-${fromColor ? fromColor : "green-400"} to-${toColor ? toColor : "blue-500"} shadow-lg transform skew-y-0 -rotate-3 rounded-3xl `}></div>

	<div className={`flex-1 bg-white rounded-xl transition hover:shadow-md overflow-hidden md:max-w-1lg text-gray-500 cursor-pointer border-t-2 border- hover:border-${fromColor ? fromColor : "blue-400"} md:flex relative transform hover:scale-105  hover:text-black`}>
		{Icon && <div className={`md:flex-shrink-0 flex justify-start items-center ml-8 text-${fromColor ? fromColor : "green-500"}`}>
			<Icon className="h-16 w-16 mb-4 mt-4" />
		</div>}
		<div className="p-4">
			<div className={`uppercase tracking-wide text-sm text-${fromColor ? fromColor : "green-500"} font-semibold leading-none`}>{group || ""}</div>
			<div href="#" className="block text-lg xl:text-xl 2xl:text-2xl leading-tight font-medium text-black leading-none">{title}</div>
			<p className="mt-1 pr-1 text-sm ">{desc} </p>
		</div>
	</div>
</div></>

const ToolForm = ({ Icon, title, desc, to, group, fromColor, toColor, onClick, api }) => <><form action={to} method="POST" className="flex relative">
	<input type="hidden" name="token" value={api.defaults.headers.common['x-access-token']} />
	<button type="submit" className="flex-1 text-left">
		<div className={`absolute inset-0 bg-gradient-to-r from-${fromColor ? fromColor : "green-400"} to-${toColor ? toColor : "blue-500"} shadow-lg transform skew-y-0 -rotate-3 rounded-3xl `}></div>

		<div type="submit" className={`flex-1 bg-white rounded-xl transition hover:shadow-md overflow-hidden md:max-w-1lg text-gray-500 cursor-pointer border-t-2 border- hover:border-${fromColor ? fromColor : "blue-400"} md:flex relative transform hover:scale-105  hover:text-black`}>
			{Icon && <div className={`md:flex-shrink-0 flex justify-start items-center ml-8 text-${fromColor ? fromColor : "green-500"}`}>
				<Icon className="h-16 w-16 mb-4 mt-4" />
			</div>}
			<div className="p-4">
				<div className={`uppercase tracking-wide text-sm text-${fromColor ? fromColor : "green-500"} font-semibold leading-none`}>{group || ""}</div>
				<div className="block text-lg xl:text-xl 2xl:text-2xl leading-tight font-medium text-black leading-none">{title}</div>
				<p className="mt-1 pr-1 text-sm ">{desc} </p>
			</div>
		</div>
	</button>
</form></>

const Tool = ({ Icon, title, desc, to, group, fromColor, toColor, onClick, api }) => <Link to={to} className="flex relative">
	<div className="flex-1 text-left">
		<div className={`absolute inset-0 bg-gradient-to-r from-${fromColor ? fromColor : "green-400"} to-${toColor ? toColor : "blue-500"} shadow-lg transform skew-y-0 -rotate-3 rounded-3xl `}></div>

		<div className={`flex-1 bg-white rounded-xl transition hover:shadow-md overflow-hidden md:max-w-1lg text-gray-500 cursor-pointer border-t-2 border- hover:border-${fromColor ? fromColor : "blue-400"} md:flex relative transform hover:scale-105  hover:text-black`}>
			{Icon && <div className={`md:flex-shrink-0 flex justify-start items-center ml-8 text-${fromColor ? fromColor : "green-500"}`}>
				<Icon className="h-16 w-16 mb-4 mt-4" />
			</div>}
			<div className="p-4">
				<div className={`uppercase tracking-wide text-sm text-${fromColor ? fromColor : "green-500"} font-semibold leading-none`}>{group || ""}</div>
				<div className="block text-lg xl:text-xl 2xl:text-2xl leading-tight font-medium text-black leading-none">{title}</div>
				<p className="mt-1 pr-1 text-sm ">{desc} </p>
			</div>
		</div>
	</div>
</Link>

// eslint-disable-next-line no-unused-vars
const ATool = ({ Icon, title, desc, to, group, fromColor, toColor, onClick, api }) => <a href={to} className="flex relative">
	<div className="flex-1 text-left">
		<div className={`absolute inset-0 bg-gradient-to-r from-${fromColor ? fromColor : "green-400"} to-${toColor ? toColor : "blue-500"} shadow-lg transform skew-y-0 -rotate-3 rounded-3xl `}></div>

		<div className={`flex-1 bg-white rounded-xl transition hover:shadow-md overflow-hidden md:max-w-1lg text-gray-500 cursor-pointer border-t-2 border- hover:border-${fromColor ? fromColor : "blue-400"} md:flex relative transform hover:scale-105  hover:text-black`}>
			{Icon && <div className={`md:flex-shrink-0 flex justify-start items-center ml-8 text-${fromColor ? fromColor : "green-500"}`}>
				<Icon className="h-16 w-16 mb-4 mt-4" />
			</div>}
			<div className="p-4">
				<div className={`uppercase tracking-wide text-sm text-${fromColor ? fromColor : "green-500"} font-semibold leading-none`}>{group || ""}</div>
				<div className="block text-lg xl:text-xl 2xl:text-2xl leading-tight font-medium text-black leading-none">{title}</div>
				<p className="mt-1 pr-1 text-sm ">{desc} </p>
			</div>
		</div>
	</div>
</a>

const ReferralIcon = (props) => <svg
	xmlns="http://www.w3.org/2000/svg"
	width="46"
	height="46"
	fill="none"
	stroke="green"
	strokeLinecap="round"
	strokeLinejoin="round"
	strokeWidth="1.5"
	viewBox="0 0 24 24"
>
	<path d="M14 11.998C14 9.506 11.683 7 8.857 7H7.143C4.303 7 2 9.238 2 11.998c0 2.378 1.71 4.368 4 4.873a5.3 5.3 0 001.143.124"></path>
	<path d="M10 11.998c0 2.491 2.317 4.997 5.143 4.997h1.714c2.84 0 5.143-2.237 5.143-4.997 0-2.379-1.71-4.37-4-4.874A5.304 5.304 0 0016.857 7"></path>
</svg>



export default withRouter(Body)