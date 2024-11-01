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
import { Toaster } from 'react-hot-toast';


import Header from './Header'
import Search from './Search'
import Dashboard from './Dashboard'
import LoginSuccess from './Login/Success'
import LoginPrompt from './Components/LoginPrompt';
import WhatsApp from './Core/whasapp';
import './App.scss'
import Tool from './Core/Tool';
import Profile from './Profile/index';
import Pricing from './Pricing';
import Footer from './Components/Footer';
import PlanPrompt from './Components/planPrompt';
import { AvailableHistoryInStore, Loading, SelfPlanClick } from './util/helper';
import NotFound from './pages/notFound';
import ChatV2 from './Core/Chat_v2';
import Inventory from './pages/Inventory';


const AboutUs = React.lazy(() => import('./pages/AboutUs'));
const Support = React.lazy(() => import('./pages/Support'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = React.lazy(() => import('./pages/TermsAndConditions'));
const Contact = React.lazy(() => import('./pages/Contact'));
const PaymentAndSubscription = React.lazy(() => import('./pages/PaymentAndSubscription'));
const FAQ = React.lazy(() => import('./pages/FAQ'));
const CookiePolicy = React.lazy(() => import('./pages/CookiePolicy'));
const GoogleLoginSuccess = React.lazy(() => import('./pages/GoogleLoginSuccess'));
// const Chat = React.lazy(() => import('./Core/Chat'));
const Login = React.lazy(() => import('./Login/Login'));
const Dalle = React.lazy(() => import('./Core/Dalle'));

if (!window.store) {
  window.store = new AppStore();
}


@observer
class App extends Component {
  render() {
    if (window.store.loading) return <Loading />
    return (
      <ThemeProvider theme={colors}>
        <Provider store={window.store}>
          <Toaster position="top-right" />
          <Router>
            {window.store.redirect ? <Redirect to={window.store.redirect} /> : null}

            {/* this routes are available for every user */}
            <AvailableHistoryInStore />
            {/* <Switch>
              {window.store.isLoggedIn && !window.store.profile.status && <Route path="/pricing" ><SelfPlanClick plan="free" /></Route>}
            </Switch> */}

            <Switch>
              <Route path="/writing/document"><div /></Route>
              <Header />
            </Switch>

            <Switch>
              {/* AI tools routes */}
              <Route path="/ai/" ><Switch>
                <Route path="/ai/dalle"><Suspense fallback={<Loading />}><Dalle /></Suspense></Route>
                <Route path="/ai/dalle/*"><Suspense fallback={<Loading />}><Dalle /></Suspense></Route>
                <Route path="/ai/whatsapp"><WhatsApp /></Route>
                <Route exact path="/ai/ChatGPT"><ChatV2 /></Route>
                {/* <Route path="/ai/ChatGPT/"  > <Switch>
                  <Route path="/ai/ChatGPT/"  ><Suspense fallback={<Loading />}><Chat /></Suspense> </Route>
                  <Route path="/ai/ChatGPT/:id"  ><Suspense fallback={<Loading />}><Chat /></Suspense> </Route>
                </Switch>
                </Route> */}
                <Route component={Tool} />
              </Switch>
              </Route>
              {window.store.isLoggedIn && <Route path="/signup/success" component={LoginSuccess} />}
              <Route exact path="/" >{window.store.isLoggedIn ? <Redirect to={"/ai/ChatGPT"} /> : null}</Route>
              <Route path="/my-profile">{!window.store.isLoggedIn ? <Redirect to={"/ai/ChatGPT"} /> : <Profile />}</Route>
              <Route path="/tools" exact component={Dashboard} />
              <Route path="/inventory" exact component={Inventory} />
              <Route path="/search" exact component={Search} />
              <Route path="/google/login-success/:token" ><Suspense fallback={<Loading />}><GoogleLoginSuccess /></Suspense> </Route><Route path="/aboutUs"><Suspense fallback={<Loading />}><AboutUs /></Suspense></Route>
              <Route path="/support" ><Suspense fallback={<Loading />}><Support /></Suspense></Route>
              <Route path="/Payments-and-Subscription"><Suspense fallback={<Loading />}> <PaymentAndSubscription /> </Suspense> </Route>
              <Route path="/contact-Us" > <Suspense fallback={<Loading />}> <Contact /> </Suspense></Route>
              <Route path="/terms-condition"  ><Suspense fallback={<Loading />}>  <TermsAndConditions /> </Suspense> </Route>
              <Route path="/privacy-policy" ><Suspense fallback={<Loading />}><PrivacyPolicy /></Suspense></Route>
              <Route path="/FAQ" ><Suspense fallback={<Loading />}><FAQ /></Suspense> </Route>
              <Route path="/Cookie-Policy" ><Suspense fallback={<Loading />}> <CookiePolicy /></Suspense></Route>
              <Route path="/forgot-password" ><Suspense fallback={<Loading />}><Login /></Suspense></Route>
              <Route path="/login" ><Suspense fallback={<Loading />}> <Login /></Suspense></Route>
              <Route path="/signup" ><Suspense fallback={<Loading />}> <Login /></Suspense></Route>
              <Route path="/pricings" ><Pricing /></Route>
              <Route path="*" ><NotFound /></Route>
            </Switch>
            <LoginPrompt id="login_prompt" subId="home_page_login" />
            <PlanPrompt id="plan_prompt" />
          </Router>
        </Provider>
      </ThemeProvider>
    )
  }
}

export default App
