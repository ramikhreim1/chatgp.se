import { ThemeProvider } from 'styled-components'
import React, { Component, Suspense } from 'react';

import { Provider } from 'mobx-react'
import { observer, } from 'mobx-react'

import AppStore from './store'
import colors from 'tailwindcss/colors'
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from "react-router-dom";

import Header from './Header'
import Search from './Search'
import Pricing from './Pricing' // <--- Add this line
import Dashboard from './Dashboard'
import Tool from './Core/Tool'
import Profile from './Profile/'
import LoginSuccess from './Login/Success'
import WhatsApp from './Core/whasapp';
import Footer from './Components/Footer';
import './App.scss'


const AboutUs = React.lazy(() => import('./pages/AboutUs'));
const Support = React.lazy(() => import('./pages/Support'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = React.lazy(() => import('./pages/TermsAndConditions'));
const Contact = React.lazy(() => import('./pages/Contact'));
const PaymentAndSubscription = React.lazy(() => import('./pages/PaymentAndSubscription'));
const FAQ = React.lazy(() => import('./pages/FAQ'));
const CookiePolicy = React.lazy(() => import('./pages/CookiePolicy'));
const GoogleLoginSuccess = React.lazy(() => import('./pages/GoogleLoginSuccess'));
const Chat = React.lazy(() => import('./Core/Chat'));
const Login = React.lazy(() => import('./Login/Login'));
const Dalle = React.lazy(() => import('./Core/Dalle'));

if (!window.store) {
  window.store = new AppStore();
}


@observer
class App extends Component {
  render() {
    return (
      <ThemeProvider theme={colors}>
        <Provider store={window.store}>
          <Router>
            {window.store.redirect ? <Redirect to={window.store.redirect} /> : null}
            {window.store.isLoggedIn ? <>
              {window.store.profile.status ? <>  {/*  Logged in with plan */}
                <Switch>
                  <Route path="/writing/document"><div /></Route>
                  <Route component={Header} />
                </Switch>

                <Switch>

                  <Route path="/" exact component={Dashboard} />
                  <Route path="/search" exact component={Search} />


                  <Route path="/ai/" >
                    <Switch>

                      <Route path="/ai/dalle">
                        <Suspense fallback={<div>Loading...</div>}>
                          <Dalle />
                        </Suspense>

                      </Route>
                      <Route path="/ai/whatsapp" component={WhatsApp} />
                      <Route path="/ai/ChatGPT"  >
                        <Suspense fallback={<div>Loading...</div>}>
                          <Chat />
                        </Suspense>
                      </Route>
                      <Route path="/ai/ChatGPT/:id" >
                        <Suspense fallback={<div>Loading...</div>}>
                          <Chat />
                        </Suspense>
                      </Route>
                      <Route component={Tool} />

                    </Switch>
                  </Route>
                  <Route path="/signup/success" component={LoginSuccess} />
                  <Route path="/my-profile">
                    <Profile />
                  </Route>
                  <Route path="/aboutUs">
                    <Suspense fallback={<div>Loading...</div>}>
                      <AboutUs />
                    </Suspense>
                  </Route>
                  <Route path="/support" >
                    <Suspense fallback={<div>Loading...</div>}>
                      <Support />
                    </Suspense>
                  </Route>
                  <Route path="/Payments-and-Subscription">
                    <Suspense fallback={<div>Loading...</div>}>
                      <PaymentAndSubscription />
                    </Suspense>
                  </Route>
                  <Route path="/contact-Us" component={Contact} >
                    <Suspense fallback={<div>Loading...</div>}>
                      <Contact />
                    </Suspense>
                  </Route>
                  <Route path="/terms-condition"  >
                    <Suspense fallback={<div>Loading...</div>}>
                      <TermsAndConditions />
                    </Suspense>
                  </Route>
                  <Route path="/privacy-policy" >
                    <Suspense fallback={<div>Loading...</div>}>
                      <PrivacyPolicy />
                    </Suspense>
                  </Route>
                  <Route path="/FAQ" >
                    <Suspense fallback={<div>Loading...</div>}>
                      <FAQ />
                    </Suspense>
                  </Route>
                  <Route path="/Cookie-Policy" >
                    <Suspense fallback={<div>Loading...</div>}>
                      <CookiePolicy />
                    </Suspense>
                  </Route>

                </Switch>
              </> : <> {/* Logged in but no plan */}
                <Switch>
                  <Route path="/signup/success" component={LoginSuccess} />
                  <Route>
                    <Pricing />
                  </Route>
                  <Route path="*" component={Footer} />
                </Switch>
              </>} </> : <> {/*  Not Logged In */}
              <Switch>
                <Route path="/google/login-success/:token" >
                  <Suspense fallback={<div>Loading...</div>}>
                    <GoogleLoginSuccess />
                  </Suspense>
                </Route>
                <Route path="/aboutUs">
                  <Suspense fallback={<div>Loading...</div>}>
                    <AboutUs />
                  </Suspense>
                </Route>
                <Route path="/support" >
                  <Suspense fallback={<div>Loading...</div>}>
                    <Support />
                  </Suspense>
                </Route>
                <Route path="/Payments-and-Subscription">
                  <Suspense fallback={<div>Loading...</div>}>
                    <PaymentAndSubscription />
                  </Suspense>
                </Route>
                <Route path="/contact-Us" component={Contact} >
                  <Suspense fallback={<div>Loading...</div>}>
                    <Contact />
                  </Suspense>
                </Route>
                <Route path="/terms-condition"  >
                  <Suspense fallback={<div>Loading...</div>}>
                    <TermsAndConditions />
                  </Suspense>
                </Route>
                <Route path="/privacy-policy" >
                  <Suspense fallback={<div>Loading...</div>}>
                    <PrivacyPolicy />
                  </Suspense>
                </Route>
                <Route path="/FAQ" >
                  <Suspense fallback={<div>Loading...</div>}>
                    <FAQ />
                  </Suspense>
                </Route>
                <Route path="/Cookie-Policy" >
                  <Suspense fallback={<div>Loading...</div>}>
                    <CookiePolicy />
                  </Suspense>
                </Route>
                <Route exact path="/login" >
                  <Suspense fallback={<div>Loading...</div>}>
                    <Login />
                  </Suspense>
                </Route>
                <Route exact path="/signup" >
                  <Suspense fallback={<div>Loading...</div>}>
                    <Login />
                  </Suspense>
                </Route>
                <Route exact path="/forgot-password" >
                  <Suspense fallback={<div>Loading...</div>}>
                    <Login />
                  </Suspense>
                </Route>
                <Route path="*">
                  <Redirect to="/login" />
                </Route>
              </Switch>
            </>}
          </Router>
        </Provider>
      </ThemeProvider>
    )
  }
}

export default App