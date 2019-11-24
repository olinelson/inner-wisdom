import React, { useState, useEffect } from 'react'

import { Container, Menu, Divider, Button, Modal, Tab, Input } from "semantic-ui-react"
import styled from "styled-components"

import PostsList from '../PostsList';
import AppointmentHistoryTable from './AppointmentHistoryTable';
import ClientInvoiceList from './ClientInvoiceList';


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

    useEffect(() => {
        // window.scroll({
        //     top: 0,
        //     left: 0,
        // })
    }, []);

    const handleTabClick = (tabName) => {
        props.dispatch({ type: "SET_MY_ACCOUNT_PANEL", value: tabName })
    }

    const showAdminMenu = () => {
        return <Menu vertical fluid style={{ gridArea: "sideMenu", marginTop: "1.5em" }}  >
            {/* <Menu.Item name='My Appointments' active={props.myAccountPanel === 'calendar'} onClick={() => handleTabClick("calendar")} /> */}
            <Menu.Item name='Profile' active={props.myAccountPanel === 'profile'} onClick={() => handleTabClick("profile")} />
            <Menu.Item name='Posts' active={props.myAccountPanel === 'posts'} onClick={() => handleTabClick("posts")} />
        </Menu>
    }

    const showUserMenu = () => {
        return <Menu fluid style={{ gridArea: "sideMenu", marginTop: "1.5em" }} vertical  >
            <Menu.Item name='Profile' active={props.myAccountPanel === 'profile'} onClick={() => handleTabClick("profile")} />
            <Menu.Item name='Appointment History' active={props.myAccountPanel === 'history'} onClick={() => handleTabClick("history")} />
            <Menu.Item name='Invoices' active={props.myAccountPanel === 'invoices'} onClick={() => handleTabClick("invoices")} />
        </Menu>
    }

    const isUserAnAttendeeOfEvent = (event) => {
        if (event.attendees === null) return false
        for (let att of event.attendees) {
            if (att.email === props.current_user.email) return true
        }
    }

    const panelSwitch = () => {
        switch (props.myAccountPanel) {
            case "history":
                // return <Calendar readOnly events={RelevantAppointments()} />
                return <AppointmentHistoryTable events={props.relevantAppointments} user={props.current_user} />
            case "profile":
                return profileSettingsLinks()
            case "posts":
                return <PostsList creatable posts={props.current_user.posts} />
            case "invoices":
                return <ClientInvoiceList client={props.current_user} />
            default:
                return profileSettingsLinks()
        }


    }

    const csrfToken = document.querySelectorAll('meta[name="csrf-token"]')[0].content

    const genNewCalAuthUrl = () => {
        fetch(`${process.env.BASE_URL}/googlecal/url`, {
            method: "POST",
            body: JSON.stringify({
                newPersonalEmail
            }),
            headers: {
                "X-CSRF-Token": csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(res => res.json())
            .catch(error => {
                console.error('Error:', error)
            })
            .then((res) => { window.open(res.authUrl, '_blank') })
    }

    const saveNewCredentials = () => {
        fetch(`${process.env.BASE_URL}/googlecal/token`, {
            method: "POST",
            body: JSON.stringify({
                newPersonalEmail,
                authCode
            }),
            headers: {
                "X-CSRF-Token": csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(res => res.json())
            .catch(error => {
                console.error('Error:', error)
            })
            .then(res => {
                if (res.status == "success") location.reload()
            })

    }



    const profileSettingsLinks = () => {
        let user = props.current_user
        return < div style={{ gridArea: "panel", marginTop: "1.5em" }}>
            {/* <h1>Account Details</h1> */}
            <h4>{user.first_name} {user.last_name}</h4>
            <h4>{user.email}</h4>
            <h4>{user.occupation}</h4>
            <a href={`${process.env.BASE_URL}/users/edit`}>Change Details</a>


            {user.admin ?
                <>
                    <Divider />
                    <h2>Personal Google Calendar Settings</h2>
                    <h4>{user.google_calendar_email}</h4>
                    <h4>{user.google_calendar_refresh_token}</h4>
                    <Modal closeIcon trigger={<Button>Connect Personal Google Calendar</Button>}>
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
                </>
                : null}


        </div>
    }
    const panes = () => {
        if (props.current_user.admin) return [
            { menuItem: 'My Details', render: () => <Tab.Pane content={profileSettingsLinks()} /> },
            { menuItem: 'Blog Posts', render: () => <Tab.Pane content={<PostsList creatable current_user={props.current_user} posts={props.posts} />} /> },
        ]

        return [
            { menuItem: 'My Details', render: () => <Tab.Pane content={profileSettingsLinks()} /> },
            { menuItem: 'Recent Appointments', render: () => <Tab.Pane content={<AppointmentHistoryTable current_user={props.current_user} />} /> },
            { menuItem: 'Invoices', render: () => <Tab.Pane content={<ClientInvoiceList client={props.current_user} />} /> },
        ]
    }


    return <Container >
        <h1>My Account</h1>

        <Tab panes={panes()} renderActiveOnly={true} />
        {/* <TwoColumnContainer>
            {props.current_user.admin ? showAdminMenu() : showUserMenu()}
            {panelSwitch()}

        </TwoColumnContainer> */}
    </Container>



}

export default MyAccount