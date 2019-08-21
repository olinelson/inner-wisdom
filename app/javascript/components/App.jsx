import React, { Component } from 'react'
import { HashRouter, Route, Link, Switch, Redirect } from 'react-router-dom'

import { Container, Divider, Segment, Menu, Image, Button, Icon } from "semantic-ui-react"

import { Views } from "react-big-calendar"

import Home from "./Home"
import MyAccount from './MyAccount'
import Nav from './Nav'
import Appointments from './Appointments'
import PostEditor from './PostEditor'
import PostsList from './PostsList'
import Blog from './Blog'
import Clients from "./Clients"
import ClientShow from "./ClientShow"

import { createStore } from "redux"
import { Provider } from "react-redux"
import Schedule from './Schedule'

import NotFound from "./NotFound"
import Notification from "./Notification"
import Counselling from './Counselling'
import Supervision from './Supervision'
import Training from './Training'
import About from './About';
import Contact from './Contact';
import FAQS from './FAQS';




// dotenv.config()

const initialState = {
    user: null,
    appointments: [],
    consults: [],
    personalEvents: [],
    posts: [],
    myAccountPanel: "calendar",
    notifications: [],
    baseUrl: null,
    csrfToken: null,
    users: null,
    businessCalendarAddress: null,
    defaultCalendarView: Views.WEEK,
    calendarScrollToTime: new Date,
    calendarDisplayDate: new Date,
}






function reducer(state = initialState, action) {
    switch (action.type) {
        case "SET_EVENTS":
            return { ...state, events: action.value }
        case "SET_PERSONAL_EVENTS":
            return { ...state, personalEvents: action.value }
        case "SET_PERSONAL_AND_BUSINESS_EVENTS":
            return { ...state, personalEvents: action.value.personalEvents, appointments: action.value.appointments, consults: action.value.consults, calendarScrollToTime: new Date(action.value.scrollToEvent.start_time) }
        case "SET_USER":
            return { ...state, user: action.value }
        case "SET_USERS":
            return { ...state, users: action.value }
        case "SET_POSTS":
            return { ...state, posts: action.value }
        case "SET_MY_ACCOUNT_PANEL":
            return { ...state, myAccountPanel: action.value }
        case "SET_DEFAULT_CALENDAR_VIEW":
            return { ...state, defaultCalendarView: action.value }
        case "SET_CALENDAR_SCROLL_TO_TIME":
            return { ...state, calendarScrollToTime: action.value, calendarDisplayDate: action.value }
        case "SET_NOTIFICATIONS":
            return { ...state, notifications: action.value }
        case "SET_ALL":
            return {
                ...state,
                appointments: action.value.appointments,
                consults: action.value.consults,
                personalEvents: action.value.personalEvents,
                posts: action.value.posts,
                user: action.value.user,
                users: action.value.users,
                baseUrl: action.value.baseUrl,
                csrfToken: action.value.csrfToken,
                businessCalendarAddress: action.value.businessCalendarAddress,
                calendarScrollToTime: action.value.calendarScrollToTime,
                hourlyRate: action.value.hourlyRate,
            }


        default:
            return state
    }
}

const store = createStore(reducer);

export function App(props) {

    store.dispatch({
        type: "SET_ALL", value: {
            posts: props.posts,
            // events: formatEvents(props.events, "business"),
            appointments: props.appointments,
            consults: props.consults,
            // personalEvents: formatEvents(props.personalEvents, "personal"),
            personalEvents: props.personalEvents,
            user: props.user,
            baseUrl: props.baseUrl,
            csrfToken: document.querySelectorAll('meta[name="csrf-token"]')[0].content,
            users: props.users,
            businessCalendarAddress: props.businessCalendarAddress,
            calendarScrollToTime: new Date,

        }

    })

    console.log(props)


    return (
        <Provider store={store}>

            <HashRouter basename="/" >
                <>
                    <div style={{ minHeight: "90vh" }}>

                        <Route
                            render={rProps => <Nav {...store} {...rProps} user={store.getState().user} />}
                        />

                        <Switch>
                            <Route
                                exact
                                path="/"
                                render={props => <Home />}
                            />
                            <Route
                                path="/appointments"
                                render={props => <Appointments />}
                            />
                            <Route
                                path="/counselling"
                                render={props => <Counselling />}
                            />

                            <Route
                                path="/faqs"
                                render={props => <FAQS />}
                            />
                            <Route
                                path="/supervision"
                                render={props => <Supervision />}
                            />
                            <Route
                                path="/training"
                                render={props => <Training />}
                            />
                            <Route
                                path="/contact"
                                render={props => <Contact />}
                            />
                            <Route
                                path="/myaccount"
                                render={props => <MyAccount />}
                            />
                            <Route
                                path="/schedule"
                                render={props => <Schedule />}
                            />
                            <Route
                                path="/blog"
                                render={props => <Blog />}
                            />

                            <Route
                                path="/posts/:id"
                                render={props => <PostEditor />}
                            />
                            <Route
                                path="/clients"
                                exact
                                render={props => <Clients />}
                            />
                            <Route
                                path="/clients/:id"
                                render={props => <ClientShow />}
                            />
                            <Route render={props => <NotFound />} />



                        </Switch>
                        <Notification />
                    </div>

                    <Divider hidden />

                    <div style={{ backgroundColor: "rgba(128,128,128,0.1)", height: "20rem", display: "flex", alignItems: "center", justifyContent: "center" }} >
                        {/* <Divider hidden /> */}
                        {/* <Container textAlign="center" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}> */}
                        <span><Icon name="copyright" /> Inner Wisdom {new Date().getFullYear()}</span>

                        {/* </Container> */}

                    </div>


                </>
            </HashRouter>

        </Provider>
    )

}


export default App
