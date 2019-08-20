import React, { useState } from 'react'

import { Container, Menu, Divider, Button, Modal, Header, Input } from "semantic-ui-react"
import Calendar from "./Calendar"
import { connect } from 'react-redux';
import styled from "styled-components"

import PostsList from './PostsList';
import AppointmentHistoryTable from './AppointmentHistoryTable';

import { relevantEvents, flatten, isUserAnAttendeeOfEvent } from "./Appointments"

const TwoColumnContainer = styled.div`
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: 15rem auto;
    grid-template-rows: 4rem auto auto auto;
    grid-template-areas: 
    ". toolBar"
    "sideMenu panel"
    ". panel"
    ;
    @media (max-width: 50rem) {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    grid-template-areas: 
    "sideMenu"
    "toolBar"
    "panel"
    ;
  }

`

function MyAccount(props) {
    const [newPersonalEmail, setNewPersonalEmail] = useState("")
    const [authCode, setAuthCode] = useState("")

    const handleTabClick = (tabName) => {
        props.dispatch({ type: "SET_MY_ACCOUNT_PANEL", value: tabName })

    }

    const showAdminMenu = () => {
        return <Menu vertical fluid style={{ gridArea: "sideMenu" }}  >
            {/* <Menu.Item name='My Appointments' active={props.myAccountPanel === 'calendar'} onClick={() => handleTabClick("calendar")} /> */}
            <Menu.Item name='Profile' active={props.myAccountPanel === 'profile'} onClick={() => handleTabClick("profile")} />
            <Menu.Item name='Posts' active={props.myAccountPanel === 'posts'} onClick={() => handleTabClick("posts")} />
        </Menu>
    }

    const showUserMenu = () => {
        return <Menu fluid style={{ gridArea: "sideMenu" }} vertical  >
            <Menu.Item name='Profile' active={props.myAccountPanel === 'profile'} onClick={() => handleTabClick("profile")} />
            <Menu.Item name='Appointment History' active={props.myAccountPanel === 'history'} onClick={() => handleTabClick("history")} />
        </Menu>
    }

    // const RelevantAppointments = () => {

    //     let events = props.events.filter(e => isUserAnAttendeeOfEvent(e))
    //     return events
    // }

    const isUserAnAttendeeOfEvent = (event) => {
        if (event.attendees === null) return false
        for (let att of event.attendees) {
            if (att.email === props.user.email) return true
        }
    }

    const panelSwitch = () => {
        switch (props.myAccountPanel) {
            case "history":
                // return <Calendar readOnly events={RelevantAppointments()} />
                return <AppointmentHistoryTable events={props.relevantAppointments} user={props.user} />
            case "profile":
                return profileSettingsLinks()
            case "posts":
                return <PostsList creatable posts={props.user.posts} />
            default:
                return profileSettingsLinks()
        }


    }

    const genNewCalAuthUrl = () => {
        fetch(`${props.baseUrl}/googlecal/url`, {
            method: "POST",
            body: JSON.stringify({
                newPersonalEmail
            }),
            headers: {
                "X-CSRF-Token": props.csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(res => res.json())
            .then((res) => { window.open(res.authUrl, '_blank') })
    }

    const saveNewCredentials = () => {
        fetch(`${props.baseUrl}/googlecal/token`, {
            method: "POST",
            body: JSON.stringify({
                newPersonalEmail,
                authCode
            }),
            headers: {
                "X-CSRF-Token": props.csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.status == "success") location.reload()
            })

    }



    const profileSettingsLinks = () => {
        let user = props.user
        return < div style={{ gridArea: "panel" }}>
            <h1>Account Details</h1>
            <h4>{user.first_name} {user.last_name}</h4>
            <h4>{user.email}</h4>
            <a href={`${props.baseUrl}/users/edit`}>Change Details</a>
            <Divider />
            <h2>Personal Google Calendar Settings</h2>
            <h4>{user.google_calendar_email}</h4>
            <h4>{user.google_calendar_refresh_token}</h4>




            <Modal trigger={<Button>Connect Personal Google Calendar</Button>}>
                <Modal.Header>Select a Photo</Modal.Header>
                <Modal.Content>

                    <Modal.Description>
                        <Input
                            onChange={(e) => setNewPersonalEmail(e.target.value)}
                            value={newPersonalEmail}
                            label={{ basic: true, content: '@gmail.com' }}
                            labelPosition='right'
                            placeholder='froid'
                        />
                    </Modal.Description>
                    <Button onClick={genNewCalAuthUrl}>Add Personal Google Calendar</Button>
                    <Input
                        value={authCode}
                        placeholder='paste your code here'
                        onChange={(e) => setAuthCode(e.target.value)}
                    />
                    <Button
                        content="Save Token"
                        onClick={() => saveNewCredentials()} />
                </Modal.Content>
            </Modal>
        </div>
    }


    console.log("this is myaccount props", props)

    return <Container >
        <h1>My Account</h1>
        <TwoColumnContainer>
            {props.user.admin ? showAdminMenu() : showUserMenu()}
            {panelSwitch()}

        </TwoColumnContainer>
    </Container>



}

const mapStateToProps = (state) => ({

    relevantAppointments: flatten([...state.appointments, state.consults]).filter(e => isUserAnAttendeeOfEvent(e, state.user)),
    user: state.user,
    users: state.users,
    myAccountPanel: state.myAccountPanel,
    baseUrl: state.baseUrl,
    csrfToken: state.csrfToken
})

export default connect(mapStateToProps)(MyAccount)
