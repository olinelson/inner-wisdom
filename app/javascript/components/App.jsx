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


const initialState = {
    user: null,
    events: [],
    posts: [],
    myAccountPanel: "calendar",
    notifications: [],
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
        case "REFRESH":
            return { ...state, events: action.value.events, posts: action.value.posts, user: action.value.user }

        default:
            return state
    }
}

const store = createStore(reducer);





function App(props) {

    console.log(props)

    const eventMapper = (e) => {
        // if (e.attendees !== null) return null

        event = {
            id: e.id,
            title: e.title,
            start: new Date(e.start_time),
            end: new Date(e.end_time),
            allDay: false,
            attendees: e.attendees
        }
        return event
    }

    const getEvents = () => {
        let result = props.events.map((e) => eventMapper(e))
        return result
    }
    console.log("in app", props)
    store.dispatch({ type: "SET_USER", value: props.user })
    store.dispatch({ type: "SET_EVENTS", value: getEvents() })
    store.dispatch({ type: "SET_POSTS", value: props.posts })



    return (
        <Provider store={store}>

            <HashRouter basename="/" >
                <div>
                    <Switch>

                        <Route
                            exact
                            path="/"
                            render={props => <><Nav {...props} /><Home {...props} /></>}
                        />
                        <Route
                            path="/appointments"
                            render={props => <><Nav {...props} /><Appointments {...props} /></>}
                        />
                        <Route
                            path="/myaccount"
                            render={props => <><Nav {...props} /><MyAccount {...props} /></>}
                        />
                        <Route
                            path="/blog"
                            render={props => <><Nav {...props} /><Blog {...props} /></>}
                        />

                        <Route
                            path="/posts/:id"
                            render={props => <><Nav {...props} /><PostEditor {...props} /></>}
                        />

                    </Switch>
                </div>
            </HashRouter>

        </Provider>
    )

}


export default App
