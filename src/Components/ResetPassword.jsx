import React, { Component } from 'react';

import {
    LockClosedIcon,
} from '@heroicons/react/outline'
import {
    withRouter, Redirect,
} from "react-router-dom";
import { Helmet } from "react-helmet";
import { observable, makeObservable, } from 'mobx'

import { observer, inject } from 'mobx-react'
@inject('store')
@observer
class Login extends Component {


    @observable email = ""
    @observable password = ""
    @observable newPassword = ""
    @observable errorMessage = ""
    @observable successMsg = ""
    @observable redirectTo = ""

    constructor() {
        super()
        makeObservable(this)
    }

    onChangeAny = (val, attr) => {
        this[attr] = val
        this.errorMessage = ""
    }

    onReset = async (e) => {
        e.preventDefault()
        this.errorMessage = ""
        this.successMsg = ""
        this.props.store.api.post('/auth/reset/password', {
            email: this.email,
            password: this.password,
            newPassword: this.newPassword
        }).then(() => {
            this.successMsg = "Password changed successfully"
            setTimeout(() => {
                this.redirectTo = "my-profile"
            }, 1000)
        }).catch(err => {
            // console.log(err?.response);
            if (err?.response?.data?.message) {
                this.errorMessage = err?.response?.data?.message
            }
        }).finally(() => {
        })
    }

    render() {
        return (
            <>
                {this.redirectTo === "my-profile" && <Redirect to={this.redirectTo} replace={true} />}
                <Helmet>
                    <title>{`Reset Password`}</title>
                </Helmet>
                <div className="mx-auto lg:px-2 flex flex-col md:items-center md:justify-center">
                    <div className={`min-w-full md:min-w-0 bg-white rounded-xl shadow-xl transform transition-all  transition shadow-md hover:shadow-2xl focus:shadow-2xl w-1/2`}>
                        <div className="px-3 py-4 md:px-12 md:py-12">
                            <Logon
                                landingPageUrl={this.props.store.landingPageUrl}
                                email={this.email}
                                password={this.password}
                                onChange={this.onChangeAny}
                                onReset={this.onReset} />

                            {this.errorMessage ? <div className="text-red-600 bg-red-50 rounded-md p-1 text-center mt-4">
                                {this.errorMessage}
                            </div> : null}
                            {!this.errorMessage && this.successMsg ? <div className="text-gray-600 bg-red-50 rounded-md p-1 text-center mt-4">
                                {this.successMsg}
                            </div> : null}
                        </div>
                    </div>
                </div>
            </>)
    }
}

const Logon = observer(({ email, password, newPassword, onReset, onChange }) => {
    return (
        <>
            <form onSubmit={onReset}>
                <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-${(email && password) ? "green" : "gray"}-300  ${(email && password) ? "bg-green-300" : "bg-gray-300"} `}>
                    <LockClosedIcon className={`h-8 w-8 text-${(email && password) ? "green-700" : "gray-500"}`} aria-hidden="true" />
                </div>
                <div className="mt-3 text-center ">
                    <div className="flex flex-col flex-1">
                        <label className="text-gray-400 text-sm block mt-4 inline-block text-left">Email Address</label>
                        <input value={email} onChange={e => onChange(e.target.value, 'email')} focus="true" type="email" className="rounded-md text-lg px-4 py-2  border border-gray-300 " placeholder="john@smith.com" />
                    </div>
                    <div className="flex flex-col flex-1">
                        <label className="text-gray-400 text-sm block mt-4 inline-block text-left">Password</label>
                        <input value={password} onChange={e => onChange(e.target.value, 'password')} type="password" className="rounded-md text-lg px-4 py-2  border border-gray-300 inline-block" placeholder="*******" />
                    </div>
                    <div className="flex flex-col flex-1">
                        <label className="text-gray-400 text-sm block mt-4 inline-block text-left">New Password</label>
                        <input value={newPassword} onChange={e => onChange(e.target.value, 'newPassword')} type="password" className="rounded-md text-lg px-4 py-2  border border-gray-300 inline-block" placeholder="*******" />
                    </div>
                    <div className="flex flex-col">
                        <button type="submit" className="hover:bg-gray-600 font-medium rounded-lg text-lg px-4 py-2 bg-gray-500 text-white mt-4 border border-gray-300 inline-block" >
                            Reset
                        </button>
                    </div>
                </div>
            </form>
        </>
    )
})



export default withRouter(Login)