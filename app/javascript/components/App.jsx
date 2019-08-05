import React, { Component } from 'react'
import { HashRouter, Route, Link, Switch, Redirect } from 'react-router-dom'

import { Container, Menu, Button } from "semantic-ui-react"

import Home from "./Home"
import MyAccount from './MyAccount';
import Nav from './Nav';
import Appointments from './Appointments';
import PostEditor from './PostEditor';
import PostsList from './PostsList'
import Blog from './Blog'

import { createStore } from "redux"
import { Provider } from "react-redux"
import Schedule from './Schedule';


const initialState = {
    user: null,
    events: [],
    personalEvents: [],
    posts: [],
    myAccountPanel: "calendar",
    notifications: [],
    baseUrl: null,
    csrfToken: null,
    users: null,
}






function reducer(state = initialState, action) {
    switch (action.type) {
        case "SET_EVENTS":
            return { ...state, events: action.value }
        case "SET_USER":
            return { ...state, user: action.value }
        case "SET_POSTS":
            return { ...state, posts: action.value }
        case "SET_MY_ACCOUNT_PANEL":
            return { ...state, myAccountPanel: action.value }
        case "SET_ALL":
            return {
                ...state,
                events: action.value.events,
                personalEvents: action.value.personalEvents,
                posts: action.value.posts,
                user: action.value.user,
                users: action.value.users,
                baseUrl: action.value.baseUrl,
                csrfToken: action.value.csrfToken
            }


        default:
            return state
    }
}

const store = createStore(reducer);

export function App(props) {

    const eventMapper = (e, type) => {
        event = {
            id: e.id,
            title: e.title,
            start: new Date(e.start_time),
            end: new Date(e.end_time),
            allDay: false,
            attendees: e.attendees ? getAllUsersFromEmails(e.attendees) : null,
            type: type
        }
        return event
    }

    const getAllUsersFromEmails = (users) => {
        return users.map(user => getUserFromEmail(user))
    }

    const getUserFromEmail = (calUser) => {
        let found = props.users.find(u => u.email === calUser.email)
        return found
    }


    const formatEvents = (events, type) => {
        if (events === null) return null
        let result = events.map((e) => eventMapper(e, type))
        return result
    }

    store.dispatch({
        type: "SET_ALL", value: {
            posts: props.posts,
            events: formatEvents(props.events, "business"),
            personalEvents: formatEvents(props.personalEvents, "personal"),
            user: props.user,
            baseUrl: props.baseUrl,
            csrfToken: document.querySelectorAll('meta[name="csrf-token"]')[0].content,
            users: props.users,

        }

    })



    return (
        <Provider store={store}>

            <HashRouter basename="/" >
                <div>
                    <Switch>

                        <Route
                            exact
                            path="/"
                            render={props => <><Nav /><Home /></>}
                        />
                        <Route
                            path="/appointments"
                            render={props => <><Nav /><Appointments /></>}
                        />
                        <Route
                            path="/myaccount"
                            render={props => <><Nav /><MyAccount /></>}
                        />
                        <Route
                            path="/schedule"
                            render={props => <><Nav /><Schedule /></>}
                        />
                        <Route
                            path="/blog"
                            render={props => <><Nav /><Blog /></>}
                        />

                        <Route
                            path="/posts/:id"
                            render={props => <><Nav /><PostEditor /></>}
                        />

                    </Switch>
                </div>
            </HashRouter>

        </Provider>
    )

}


export default App
