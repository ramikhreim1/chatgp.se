import React, { Component, useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom'

import {
	CheckIcon,
	UserIcon,
	LockClosedIcon,
} from '@heroicons/react/outline'
import {
	Switch,
	Route,
	withRouter, Redirect
} from "react-router-dom";
import { Helmet } from "react-helmet";
import { observable, makeObservable, } from 'mobx'
import OtpInput from 'react-otp-input';

import { observer, inject } from 'mobx-react'
@inject('store')
@observer
class Login extends Component {


	@observable email = ""
	@observable password = ""
	@observable fname = ""
	@observable lname = ""
	@observable errorMessage = ""
	@observable redirect = ""
	@observable varification = false
	@observable isLoading = false

	constructor() {
		super()
		makeObservable(this)
	}

	onChange = (val) => {
		this.currentPromptOption = val
	}

	onChangeAny = (val, attr) => {
		this[attr] = val
		this.errorMessage = ""
	}

	onLogin = async (e) => {
		try {
			e.preventDefault()
			this.isLoading = true;
			let data = await this.props.store.api.post('/auth/signin', {
				email: this.email,
				password: this.password,
			}).then(({ data }) => data)
			this.props.store.loginWithDataTokenAndProfile(data)
		} catch (err) {
			if (err?.response?.data?.code === "unVerified") {
				this.errorMessage = <p>Verification of the account is pending. Please <span className='cursor-pointer font-bold underline' onClick={() => { this.varification = true; this.props.store.redirect = "/signup" }}>click</span> to initiate the verification process.</p>
			} else if (err?.response?.data?.message) {
				this.errorMessage = err?.response?.data?.message
			}
		}
		this.isLoading = false;
	}

	googleSigning = async (interval) => {
		clearInterval(interval)
		this.isLoading = false;
		window.store.loginWithDataTokenAndProfile(await this.props.store.refreshTokenAndProfile())
		// window.location.reload()
	}

	signUpWithGoogle = async () => {
		this.isLoading = true;
		const redirectURL = this.props.store.redirectURL + `&state=${this.props.store.referral}`
		window.location.href = redirectURL
	}


	onSignup = async (e) => {
		this.isLoading = true;

		try {
			e.preventDefault()
			this.errorMessage = ""
			let data = await this.props.store.api.post('/auth/signup', {
				email: this.email,
				password: this.password,
				fname: this.fname,
				lname: this.lname,
				referral: this.props.store.referral
			}).then(({ data }) => data)
			this.props.store.api.post('/auth/confirm-email', {
				email: this.email,
			}).then(() => {
				this.varification = true
			}).catch(err => {
				if (err.response) {
					this.errorMessage = err.response.data.error.message
				} else {
					this.errorMessage = "something went wrong!"
				}
			})
			// if (data.token && data.profile) {
			// 	this.props.store.loginWithDataTokenAndProfile(data)
			// }
		} catch (err) {
			if (err?.response?.data?.message) {
				this.errorMessage = err?.response?.data?.message
			}
		}
		this.isLoading = false;
	}

	// Currently Selected Input Option

	render() {
		// console.log(this.props.history);
		return (
			<>
				<Helmet>
					<title>{`Login - Jowry`}</title>
				</Helmet>
				{this.redirect && <Redirect to={this.redirect} />}
				<div className="container mx-auto lg:px-4 py-4 min-h-screen flex flex-col md:items-center md:justify-center">

					<div className="text-center mb-6">
						<Logo />
					</div>
					<div className={`min-w-full md:min-w-0 bg-white rounded-xl shadow-xl transform transition-all  transition shadow-md hover:shadow-2xl focus:shadow-2xl w-1/2`}>
						<div className="align-bottom flex  transform transition-all sm:align-middle transition flex divide-x divide-gray-300 ">
							<NavLink to="/login" className={`flex-1 justify-center transition py-4 px-4 pr-8 rounded-t-md flex text-${this.props.location.pathname === "/login" ? "gray-800" : "gray-600"} font-medium  bg-${this.props.location.pathname === "/login" ? "white" : "gray-300"} hover:bg-${this.props.location.pathname === "/login" ? "white" : "gray-100"} cursor-pointer`} >
								<div className={`transition mr-4  flex-shrink-0 inline-flex items-center justify-center text-sm h-6 w-6 rounded-full bg-${this.props.location.pathname === "/login" ? "green-300" : "gray-200"} text-${this.props.location.pathname === "/login" ? "green" : "gray"}`}>
									<CheckIcon className={`transition h-4 w-4 text-${this.props.location.pathname === "/login" ? "green-600" : "gray-400"}`} aria-hidden="true" />
								</div>
								Login
							</NavLink>
							<NavLink to="/signup" className={`flex-1 justify-center transition py-4 px-4 pr-8 rounded-t-md flex text-${this.props.location.pathname === "/signup" ? "gray-800" : "gray-600"} font-medium  bg-${this.props.location.pathname === "/signup" ? "white" : "gray-300"} hover:bg-${this.props.location.pathname === "/signup" ? "white" : "gray-100"} cursor-pointer`} >
								<div className={`transition mr-4  flex-shrink-0 inline-flex items-center justify-center text-sm h-6 w-6 rounded-full bg-${this.props.location.pathname === "/signup" ? "green-300" : "gray-200"} text-${this.props.location.pathname === "/signup" ? "green" : "gray"}`}>
									<CheckIcon className={`transition h-4 w-4 text-${this.props.location.pathname === "/signup" ? "green-600" : "gray-400"}`} aria-hidden="true" />
								</div>
								Signup
							</NavLink>
						</div>
						<div className="px-4 py-4 md:px-12 md:py-12">
							{/* Sorru */}
							<Switch>
								<Route path="/signup"  >

									{this.varification ?
										<EmailVarification store={this.props.store} varification={this.varification} api={this.props.store.api} email={this.email} password={this.password} />
										: <Signup
											signUp={this.signUpWithGoogle}
											loading={this.isLoading}
											email={this.email}
											password={this.password}
											fname={this.fname}
											lname={this.lname}
											onChange={this.onChangeAny}
											onSignup={this.onSignup}
										/>}
								</Route>
								<Route path="/login" >
									<Logon
										loading={this.isLoading}
										landingPageUrl={this.props.store.landingPageUrl}
										email={this.email}
										password={this.password}
										signUp={this.signUpWithGoogle}
										onChange={this.onChangeAny}
										onLogin={this.onLogin} />
								</Route>
								<Route path="/forgot-password" >
									<ForgotPass
										redirect={this.props.store.redirect}
										api={this.props.store.api}
										landingPageUrl={this.props.store.landingPageUrl}
										email={this.email}
										password={this.password}
										signUp={this.signUpWithGoogle}
										onChange={this.onChangeAny}
										onLogin={this.onLogin} />
								</Route>

								<Route >
									<Redirect to="/login" />
								</Route>
							</Switch>
							{this.errorMessage ? <div className="text-red-600 bg-red-50 rounded-md p-1 text-center mt-4">
								{this.errorMessage}
							</div> : null}
						</div>
						<a href={`/`} className="block text-center bg-gray-100 text-gray-500 text-sm p-3 rounded-b-lg hover:bg-gray-200 cursor-pointer">
							Back to landing page
						</a>
					</div>
				</div>
			</>)
	}
}

const Logon = observer(({ active, email, password, onChange, onLogin, landingPageUrl, signUp, loading }) => {
	return (
		<>
			<form onSubmit={onLogin}>
				<div className={`mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-${(email && password) ? "green" : "gray"}-300  ${(email && password) ? "bg-green-300" : "bg-gray-300"} `}>
					<LockClosedIcon className={`h-8 w-8 ${active ? "text-green-700" : "text-gray-500"} text-${(email && password) ? "green-700" : "gray-500"}`} aria-hidden="true" />
				</div>
				<div className="mt-3 text-center ">
					<div className="text-3xl font-medium text-gray-900">
						Log in
					</div>
					<p className="text-lg text-gray-500">
						Login to your account
					</p>
					<div className="flex flex-col flex-1">
						<label className="text-gray-400 text-sm block mt-4 inline-block text-left">Email Address</label>
						<input value={email} onChange={e => onChange(e.target.value, 'email')} focus="true" type="email" className="rounded-md text-lg px-4 py-2  border border-gray-300 " placeholder="john@smith.com" />
					</div>
					<div className="flex flex-col flex-1">
						<label className="text-gray-400 text-sm block mt-4 inline-block text-left">Password</label>
						<input value={password} onChange={e => onChange(e.target.value, 'password')} type="password" className="rounded-md text-lg px-4 py-2  border border-gray-300 inline-block" placeholder="*******" />
					</div>
					<div className="flex flex-col">
						<button disabled={loading} type="submit" className="hover:bg-gray-600 font-medium rounded-lg text-lg px-4 py-2 bg-gray-500 text-white mt-4 border border-gray-300 inline-block" >
							Log in
						</button>
						<div disabled={loading} onClick={() => signUp()} className="hover:bg-gray-600 font-medium rounded-lg text-lg px-4 py-2 bg-gray-500 text-white mt-4 border border-gray-300 inline-block" >
							Continue With Google
						</div>

						<Link to={`/forgot-password`} className="mt-4 text-gray-400 text-sm">Forgot your password?</Link>
					</div>
				</div>
			</form>
		</>
	)
})
const ForgotPass = observer(({ api }) => {
	const [step, setStep] = useState("enter_mail")
	const [loading, setLoading] = useState(false)
	const [email, setemail] = useState("");
	const [password, setPassword] = useState("");
	const [otp, setOtp] = useState("");
	const [show, setShow] = useState(false);
	const [error, seterror] = useState("");
	const [redirect, setredirect] = useState("");
	const [resetCounter, setresetCounter] = useState("");


	const handleotp = (value) => {
		setOtp(value)
		seterror("")
		if (value.length === 6) {
			setShow(true)
		} else {
			if (show) setShow(false)
		}
	}


	const onSendMail = async () => {
		seterror("")
		if (!email.match(
			/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		)) return seterror("Invalid Email")

		setLoading(true)
		setresetCounter(o => !o)
		api.post('/auth/forgotPassword', {
			email
		}).then(() => {
			setStep("enter_otp")
		}).catch(err => {
			if (err.response) {
				seterror(err.response.data.error.message)
			} else {
				seterror("something went wrong!")
			}
		}).finally(() => {
			setLoading(false)
		})
	}
	const changePassowrd = (e) => {
		e.preventDefault()
		setLoading(true)
		api.post('/auth/changePassword', {
			email,
			password,
			resetToken: otp
		}).then(() => {
			alert("Password Changed")
			setredirect("/login");
		}).catch(err => {
			if (err.response) {
				seterror(err.response.data?.error?.message)
			} else {
				seterror("something went wrong!")
			}
		}).finally(() => {
			setLoading(false)
		})

	}
	return (
		<>
			<form onSubmit={changePassowrd}>
				{redirect && <Redirect to={redirect} />}

				<div className={`mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-${(email) ? "green" : "gray"}-300  ${(email) ? "bg-green-300" : "bg-gray-300"} `}>
					<LockClosedIcon className={`h-8 w-8 ${"text-gray-500"} text-${(email) ? "green-700" : "gray-500"}`} aria-hidden="true" />
				</div>
				<div className="mt-3 text-center ">
					<div className="text-3xl font-medium text-gray-900 mb-3">
						Forgot Password
					</div>
					{
						step === "enter_mail" && <><p className="text-lg text-gray-500">
							Please write an email to reset your password.
						</p>
							<div className="flex flex-col flex-1">
								<label className="text-gray-400 text-sm mt-4 inline-block text-left">Email Address</label>
								<input value={email} onChange={e => setemail(e.target.value)} focus="true" type="email" className="rounded-md text-lg px-4 py-2  border border-gray-300 " placeholder="john@smith.com" />
							</div>

							<div className="flex flex-col">
								<button disabled={loading} onClick={(e) => onSendMail(e)} type="button" className="hover:bg-gray-600 font-medium rounded-lg text-lg px-4 py-2 bg-gray-500 text-white mt-4 border border-gray-300 inline-block" >
									{loading ? "sending" : "Send OTP"}
								</button>
							</div></>
					}
					{
						step === "enter_otp" && <><p className="text-lg text-gray-500">
							Please enter the One-Time Password (OTP) that was sent to your email address. Don't forget to check your email's spam or junk section as well.
						</p>
							<div className="flex flex-col flex-1 my-6">
								<OtpInput
									hasErrored={true}
									value={otp}
									containerStyle="m-auto"
									inputStyle="rounded-md text-lg border-box h-8 border border-gray-300 text-slate-700"
									onChange={handleotp}
									numInputs={6}
									separator={<span>-</span>}
								/>
							</div>
							<div className="flex flex-col flex-1 my-6">
								<Countdown time={120} resetCounter={resetCounter} onSendMail={onSendMail} />
							</div>
							{show && <>
								<div className="flex flex-col flex-1">
									<label className="text-gray-400 text-sm mt-4 inline-block text-left">Password</label>
									<input value={password} onChange={e => setPassword(e.target.value)} type="password" className="rounded-md text-lg px-4 py-2  border border-gray-300 inline-block" placeholder="*******" />
								</div>
								<div className="flex flex-col">
									<button type="submit" className="hover:bg-gray-600 font-medium rounded-lg text-lg px-4 py-2 bg-gray-500 text-white mt-4 border border-gray-300 inline-block" >
										Change Password
									</button>
								</div>
							</>}

						</>
					}

					{error ? <div className="text-red-600 bg-red-50 rounded-md p-1 text-center mt-4">
						{error}
					</div> : null}
				</div>
			</form>
		</>
	)
})

const Signup = observer(({ active, email, password, fname, lname, onChange, onSignup, loading, signUp }) => {
	return (
		<>
			{/* onSignup */}
			<form onSubmit={onSignup}>
				<div className={`mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-${email && password ? "green" : "gray"}-300  ${email && password ? "bg-green-300" : "bg-gray-300"} `}>
					<UserIcon className={`h-8 w-8 ${active ? "text-green-700" : "text-gray-500"} text-${email && password ? "green-700" : "gray-500"}`} aria-hidden="true" />
				</div>
				<div className="mt-3 text-center ">
					<div className="text-3xl font-medium text-gray-900">
						Sign Up
					</div>
					<p className="text-lg text-gray-500">
						Create your account
					</p>
					<div className="md:flex">
						<div className="flex flex-col min-w-0 md:pr-2 flex-1">
							<label className="text-gray-400 text-sm block mt-4 inline-block text-left">First Name</label>
							<input value={fname} onChange={e => onChange(e.target.value, 'fname')} type="text" className="rounded-md text-lg px-4 py-2  border border-gray-300 inline-block w-auto" placeholder="John" />
						</div>
						<div className="flex flex-col min-w-0 md:pl-2 flex-1">
							<label className="text-gray-400 text-sm block mt-4 inline-block text-left">Last Name</label>
							<input value={lname} onChange={e => onChange(e.target.value, 'lname')} type="text" className="rounded-md text-lg px-4 py-2  border border-gray-300 inline-block w-auto" placeholder="Smith" />
						</div>
					</div>
					<div className="flex flex-col">
						<label className="text-gray-400 text-sm block mt-4 inline-block text-left">Email Address</label>
						<input value={email} onChange={e => onChange(e.target.value, 'email')} focus="true" type="email" className="rounded-md text-lg px-4 py-2  border border-gray-300 " placeholder="john@smith.com" />
					</div>
					<div className="flex flex-col">
						<label className="text-gray-400 text-sm block mt-4 inline-block text-left">Password</label>
						<input value={password} onChange={e => onChange(e.target.value, 'password')} type="password" className="rounded-md text-lg px-4 py-2  border border-gray-300 inline-block" placeholder="*******" />
					</div>

					<div className="flex flex-col">
						<button disabled={loading} type="submit" className="hover:bg-green-600 bg-green-500 font-medium rounded-lg text-lg px-4 py-2 bg-gray-200 text-white mt-4 border border-gray-300 inline-block" >
							Sign Up
						</button>
						<div disabled={loading} onClick={() => signUp()} className="hover:bg-gray-600 font-medium rounded-lg text-lg px-4 py-2 bg-gray-500 text-white mt-4 border border-gray-300 inline-block" >
							Continue With Google
						</div>
					</div>
				</div>
			</form>
		</>
	)
})


const Logo = () => (
	<img src='/logo.gif'></img>

)

function Countdown({ onSendMail, resetCounter, time }) {
	const [timeLeft, setTimeLeft] = useState(10); // initial time left in seconds

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
		}, 1000);

		return () => clearInterval(timer);
	}, []);
	useEffect(() => {
		setTimeLeft(time)
	}, [resetCounter, time])

	const minutes = Math.floor(timeLeft / 60);
	const seconds = timeLeft % 60;

	return (
		<div>
			{timeLeft > 0 ? (
				<p>Resend OTP in  <span className='font-bold'>{minutes}:{seconds < 10 ? '0' : ''}{seconds}</span></p>
			) : (
				<button type='button' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={(e) => onSendMail(e)}>Resend code</button>
			)}
		</div>
	);
}

const EmailVarification = observer(({ store, email, api, varification, password }) => {
	const [otp, setOtp] = useState("");
	const [error, seterror] = useState("");
	const [resetCounter, setresetCounter] = useState("");

	const handleotp = (value) => {
		setOtp(value)
		seterror("")
		if (value.length === 6) {
			//here handle varification request
			api.post('/auth/confirm', {
				email,
				password,
				resetToken: value
			}).then((res) => {
				if (res.data.token && res.data.profile) {
					store.loginWithDataTokenAndProfile(res.data, "/pricings")
				}
			}).catch(err => {
				if (err.response) {
					seterror(err.response.data?.error?.message)
				} else {
					seterror("something went wrong!")
				}
			})
		}
	}
	React.useEffect(() => {
		// onSendMail()
	}, [])

	const onSendMail = async () => {
		seterror("")
		if (!email.match(
			/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		)) return seterror("Invalid Email")

		setresetCounter(o => !o)
		api.post('/auth/confirm-email', {
			email
		}).then(() => {
			varification = true
		}).catch(err => {
			if (err.response) {
				seterror(err.response.data.error.message)
			} else {
				seterror("something went wrong!")
			}
		})
	}
	return <form >
		<div className={`mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-${(email) ? "green" : "gray"}-300  ${(email) ? "bg-green-300" : "bg-gray-300"} `}>
			<LockClosedIcon className={`h-8 w-8 ${"text-gray-500"} text-${(email) ? "green-700" : "gray-500"}`} aria-hidden="true" />
		</div>
		<div className="mt-3 text-center ">
			<div className="text-3xl font-medium text-gray-900 mb-3">
				Email Confirmation
			</div>
			<p className="text-lg text-gray-500">
				Please enter the One-Time Password (OTP) that was sent to your email address. Don't forget to check your email's spam or junk section as well.
			</p>
			<div className="flex flex-col flex-1 my-6">
				<OtpInput
					hasErrored={true}
					value={otp}
					containerStyle="m-auto"
					inputStyle="rounded-md text-lg border-box h-8 border border-gray-300 text-slate-700"
					onChange={handleotp}
					numInputs={6}
					separator={<span>-</span>}
				/>
			</div>
			<div className="flex flex-col flex-1 my-6">
				<Countdown time={120} resetCounter={resetCounter} onSendMail={onSendMail} />
			</div>

			{error ? <div className="text-red-600 bg-red-50 rounded-md p-1 text-center mt-4">
				{error}
			</div> : null}
		</div>
	</form>
})
export default withRouter(Login)