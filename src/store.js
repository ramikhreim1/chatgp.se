import axios from 'axios'
import { observable, computed, makeObservable } from 'mobx'
import { configure } from "mobx"
import FuzzySet from 'fuzzyset'
import Filter from 'bad-words'

import TOOLS from './tools'
import config from './config'


let filterBadWords = new Filter()

let baseURL = config.baseURL


configure({ enforceActions: "never", })

let api = axios.create({
	baseURL,
	withCredentials: true
});
let doc_query_api = axios.create({
	baseURL: config.doc_query_baseURL,
	withCredentials: true
});

const FuzzySearch = FuzzySet([...TOOLS.map(tool => tool.title)]);

class appStore {

	api = api
	doc_query_api = doc_query_api
	clientId = config.clientId
	redirectURL = config.redirectURL
	@observable baseURL = baseURL
	@observable popup = ""
	@observable theme = localStorage.getItem("theme") || "Light"
	@observable editorIsLoading = true
	@observable redirect = ``
	@observable history = null

	// User Profile
	@observable profile = {}
	@observable isLoggedIn = false
	@observable loginLoading = false
	@observable loading = true

	@observable landingPageUrl = config.landingPageUrl

	editor

	constructor() {
		makeObservable(this);


		// Check credits every time, and log out people who aren't authenticated
		this.api.interceptors.response.use((response) => {
			this.updateCredits(response)
			return response;
		}, async (error) => {
			if (error.response && error.response.statusText === "Token Authentication Failed") {
				this.handleLogout()
			} else if (error.response && error.response.statusText === "No Credit Remaining") {
				this.noCreditsRemainPrompt()
			}
			return Promise.reject(error);
		});
		this.doc_query_api.interceptors.response.use(
			(response) => response,
			async (error) => {
				const originalRequest = error.config;


				// Check if the response status is 401 (unauthorized) and if the original request does not have the 'retry' flag
				if ((error.response.status === 403 || error.response.status === 401) && !originalRequest._retry) {
					originalRequest._retry = true; // Mark the original request to avoid an infinite loop
					// Refresh the access token
					try {
						const token = await this.refreshToken()
						originalRequest.headers['Authorization'] = `Bearer ${token}`;
						this.setToken(token)
						return this.doc_query_api(originalRequest);
					} catch (refreshError) {
						return Promise.reject(refreshError); // Reject the promise if the access token cannot be refreshed
					}
				}

				return Promise.reject(error);
			}
		);
		this.init()

	}

	ensureLogin = (att) => {
		if (this.isLoggedIn) return true
		this.popup = `login_prompt_${att}`
		return false
	}

	ensurePlan = (att) => {
		if (!this.ensureLogin(att)) return false;
		if (this.profile.status) return true;
		// this.popup = `plan_prompt__${att}`;
		this.setPrevLocation()
		// console.log("/pricings");
		this.history?.push("/pricings")
		return false;
	}

	noCreditsRemainPrompt = () => {
		// set the browser url to the no-credits page
		// window.location.pathname = "/my-profile"
	}

	init = async () => {
		try {
			this.refreshTokenAndProfile()
			this.referralTrackingCode()
		} catch (err) {
			// console.log(err)
		}
	}

	@observable referral = ""

	referralTrackingCode = async () => {
		let referral = new URLSearchParams(window.location.search).get("referral")
		if (referral) {
			this.setReferral(referral)
		} else {
			this.initReferral()
		}
	}

	setReferral = async (referral) => {
		this.referral = referral
		localStorage.setItem("referral", JSON.stringify(referral))
	}

	initReferral = async () => {
		const referral = localStorage.getItem("referral")
		this.referral = referral
	}

	loginWithDataTokenAndProfile = async (data, path) => {
		this.setToken(data.token)
		this.setProfile(data.profile)
		this.isLoggedIn = true
		if (data.profile.status) {
			const prevLocation = JSON.parse(localStorage.getItem('prevLocation'));
			if (prevLocation) {
				window.store.history.replace(path || prevLocation.pathname);
				if (!path)
					localStorage.removeItem('prevLocation');
			} else {
				window.store.history.replace(path || '/tools');
			}
		} else {
			try {
				const res = await this.api.post("user/stripe/subscribe", {
					priceId: config.stripe["free"],
					trial: true,
					res_url: true
				})
				window.location.href = res.data

			} catch (error) {
				console.error(error);
			}
			// window.history.pushState("esdf")
		}
	}
	setPrevLocation = () => {
		localStorage.setItem('prevLocation', JSON.stringify(window.location));
	}
	refreshToken = async () => {
		try {
			let data = await this.api
				.get('/auth/refresh')
				.then(({ data }) => data)
			return data
		} catch (err) {
			// console.log(err)
			this.handleLogout()
		}
	}

	refreshTokenAndProfile = async () => {
		try {
			let response = this.api.post('/user/refresh/profile')
			let auth_response = this.api.get('/auth/refresh')
			response = await response
			auth_response = await auth_response
			if (response.data) {
				this.isLoggedIn = true
				this.setProfile(response.data.profile)
				this.setToken(auth_response.data)
				this.loading = false
				return response.data
			}
		} catch (err) {
			this.loading = false
			// console.log(err)
		}
	}

	setToken = async (token) => {
		this.api.defaults.headers.common['x-access-token'] = token;
		this.doc_query_api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	}

	setProfile = async (profile) => {
		this.profile = profile
	}
	setTheme = (theme) => {
		document.documentElement.classList.remove(this.theme.toLowerCase());
		document.documentElement.classList.add(theme.toLowerCase());
		this.theme = theme; localStorage.setItem("theme", theme)
	}


	handleLogout = async () => {
		await this.api.get("/auth/logout")
		this.isLoggedIn = false
		this.profile = {}
		this.api.defaults.headers.common['x-access-token'] = ""
		this.setPrevLocation()
		window.store.history.push("/login")
	}

	@observable toolsKeyword = ""
	onChangeToolsKeyword = (e) => {
		this.toolsKeyword = e.target.value
	}
	@computed get tools() {
		// let tools = TOOLS.filter(tool => tool.title.toLowerCase().includes(this.toolsKeyword.toLowerCase()))
		let fuzzyTools = FuzzySearch.get(this.toolsKeyword, 0.5)
		if (fuzzyTools && fuzzyTools.length) {
			let fuzzySummary = fuzzyTools.map(fuzzyTool => fuzzyTool[1])
			if (fuzzySummary && fuzzySummary.length) {
				return TOOLS.filter(tool => fuzzySummary.includes(tool.title))
			}
		}
		return TOOLS
	}

	getToolByTitle = (title) => {
		return TOOLS.find(tool => tool.title === title)
	}
	getToolByUrl = (url) => {
		return TOOLS.find(tool => tool.to === url)
	}

	@observable error = ""
	checkPrompt = ({ value, attr }) => {
		if (filterBadWords.isProfane(value)) {
			// eslint-disable-next-line no-throw-literal
			throw {
				success: false,
				attr,
				value: value.replace(/^\s+|\s+$/g, ''),
				message: "Unsafe content detected, please try different language"
			}
		}
		if (value) {
			return {
				success: true,
				attr,
				value: value.replace(/^\s+|\s+$/g, ''),
			}
		}
	}
	checkOutput = (output) => {
		if (output) {
			return output.replace(/^\s+|\s+$/g, '')
		}
		return ""
	}

	updateCredits = async (data) => {
		try {
			if (data.hasOwnProperty("data")) {
				if (data.data.hasOwnProperty("credits")) {
					this.profile.credits = data.data.credits
				}
				if (data.data.hasOwnProperty("creditsUsed")) {
					this.profile.creditsUsed = data.data.creditsUsed
				}
			} else {
				if (data.hasOwnProperty("credits")) {
					this.profile.credits = data.credits
				}
				if (data.hasOwnProperty("creditsUsed")) {
					this.profile.creditsUsed = data.creditsUsed
				}
			}
		} catch (err) {
			// console.log(err)
		}
	}

	@observable copyToClipboardText = ``
	copyToClipboard = (output) => {
		if (output instanceof Array) {
			output = output.join("\n")
		}
		if (!navigator.clipboard) {
			let textarea = document.getElementById('copy-textarea');
			this.copyToClipboardText = `${output}`;
			textarea.focus();
			textarea.select()
			document.execCommand('copy')
			return;
		}
		navigator.clipboard.writeText(output).then(function () {
			// console.log('Async: Copying to clipboard was successful!');
		}, function (err) {
			console.error('Async: Could not copy text: ', err);
		});
	}

	@observable feedback = ``
	reportToFeedback = (output) => {
		window.store.history.push("/my-profile/feedback")
		this.feedback = `${output}`
		setTimeout(() => { this.redirect = "" }, 50)
	}
}


export default appStore