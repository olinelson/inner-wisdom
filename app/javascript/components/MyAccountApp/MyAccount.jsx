import React, { useState, useEffect } from 'react'

import { Container, Divider, Button, Modal, Tab, Input } from "semantic-ui-react"

import AppointmentHistoryTable from './AppointmentHistoryTable';
import ClientInvoiceList from './ClientInvoiceList';

function MyAccount(props) {
    const [newPersonalEmail, setNewPersonalEmail] = useState("")
    const [authCode, setAuthCode] = useState("")

    const [events, setEvents] = useState([])
    const [invoices, setInvoices] = useState([])

    const [loadingEvents, setLoadingEvents] = useState(true)
    const [loadingInvoices, setLoadingInvoices] = useState(true)


    const csrfToken = document.querySelectorAll('meta[name="csrf-token"]')[0].content
    const { current_user } = props

    useEffect(() => {
        if (!current_user.admin) {
            getEvents()
            getInvoices()
        }
    }, [])

    const getEvents = () => {
        fetch(`${process.env.BASE_URL}/api/v1/api/v1/events/booked/${props.current_user.id}`, {
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
                setLoadingEvents(false)
            })
            .then((res) => {
                setEvents(res.events.sort((b, a) => new Date(a.start_time) - new Date(b.end_time)))
                setLoadingEvents(false)
            })

    }

    const getInvoices = () => {
        fetch(`${process.env.BASE_URL}/api/v1/stripe/invoices`, {
            method: "POST",
            body: JSON.stringify({
                user: props.current_user,
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
                setLoadingInvoices(false)
            })
            .then((res) => {
                setInvoices(res.invoices)
                setLoadingInvoices(false)
            })
    }

    const genNewCalAuthUrl = () => {
        fetch(`${process.env.BASE_URL}/api/v1/googlecal/url`, {
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
        fetch(`${process.env.BASE_URL}/api/v1/googlecal/token`, {
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
        return (
            < div style={{ gridArea: "panel", marginTop: "1.5em" }}>
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
        )
    }

    const panes = () => {
        if (props.current_user.admin) return [
            { menuItem: 'My Details', render: () => <Tab.Pane content={profileSettingsLinks()} /> },
        ]

        return [
            { menuItem: 'My Details', render: () => <Tab.Pane content={profileSettingsLinks()} /> },
            { menuItem: 'Recent Appointments', render: () => <Tab.Pane content={<AppointmentHistoryTable events={events} current_user={props.current_user} loading={loadingEvents} />} /> },
            { menuItem: 'Invoices', render: () => <Tab.Pane content={<ClientInvoiceList client={props.current_user} invoices={invoices} loading={loadingInvoices} />} /> },
        ]
    }


    return <>
        <Container >
            <h1>My Account</h1>
            <Tab panes={panes()} renderActiveOnly={true} />
        </Container>
    </>



}

export default MyAccount
