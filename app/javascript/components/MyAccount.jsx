import React, { Component } from 'react'

import { Container, Menu } from "semantic-ui-react"
import Calendar from "./Calendar"
import { connect } from 'react-redux';
import styled from "styled-components"

import PostsList from './PostsList';

const TwoColumnContainer = styled.div`
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: 4rem auto auto auto;
    grid-template-areas: 
    ". toolBar"
    "sideMenu panel"
    ". panel"
    ;

`

class MyAccount extends Component {

    // state = {
    //     displayedPanel: "calendar",
    // }

    handleTabClick = (tabName) => {
        this.props.dispatch({ type: "SET_MY_ACCOUNT_PANEL", value: tabName })

    }

    showAdminMenu = () => {
        return <Menu vertical fluid style={{ gridArea: "sideMenu" }}  >
            <Menu.Item name='Appointments' active={this.props.myAccountPanel === 'calendar'} onClick={() => this.handleTabClick("calendar")} />
            <Menu.Item name='Profile' active={this.props.myAccountPanel === 'profile'} onClick={() => this.handleTabClick("profile")} />
            <Menu.Item name='Posts' active={this.props.myAccountPanel === 'posts'} onClick={() => this.handleTabClick("posts")} />
        </Menu>
    }

    showUserMenu = () => {
        return <Menu fluid style={{ gridArea: "sideMenu" }} vertical  >
            <Menu.Item name='Appointments' active={this.props.myAccountPanel === 'calendar'} onClick={() => this.handleTabClick("calendar")} />
            <Menu.Item name='Profile' active={this.props.myAccountPanel === 'profile'} onClick={() => this.handleTabClick("profile")} />
        </Menu>
    }

    RelevantAppointments = () => {

        let events = this.props.events.filter(e => this.isUserAnAttendeeOfEvent(e))
        return events
    }

    isUserAnAttendeeOfEvent = (event) => {
        if (event.attendees === null) return false
        for (let att of event.attendees) {
            if (att.email === this.props.user.email) return true
        }
    }

    panelSwitch = () => {
        switch (this.props.myAccountPanel) {
            case "calendar":
                return <Calendar  {...this.props} events={this.RelevantAppointments()} />
            // return <h4 style={{ gridArea: "panel" }}>calendar</h4>
            case "profile":
                return this.profileSettingsLinks()
            case "posts":
                return <PostsList creatable {...this.props} posts={this.props.user.posts} />
            default:
                return <Calendar {...this.props} events={this.RelevantAppointments()} />
        }


    }

    profileSettingsLinks = () => {
        return < div style={{ gridArea: "panel" }}>
            <h1>Account Details</h1>
            <h4>{this.props.user.first_name} {this.props.user.last_name}</h4>
            <h4>{this.props.user.email}</h4>
            <a href={`${this.props.baseUrl}/users/edit`}>Change Details</a>
        </div>
    }



    render() {


        return <Container >
            <TwoColumnContainer>
                {this.props.user.admin ? this.showAdminMenu() : this.showUserMenu()}


                {this.panelSwitch()}

            </TwoColumnContainer>
        </Container>
    }


}

const mapStateToProps = (state) => ({
    events: state.events,
    user: state.user,
    myAccountPanel: state.myAccountPanel,
    baseUrl: state.baseUrl
})

export default connect(mapStateToProps)(MyAccount)
