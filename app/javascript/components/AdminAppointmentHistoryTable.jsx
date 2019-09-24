import React, { useState, useEffect } from 'react'
import { Table, Label, Icon, Button, Checkbox, Modal, Header, Tab, Input, Divider } from "semantic-ui-react"
import moment from "moment"
import GoogleEventTableRow from './GoogleEventTableRow';

function AdminAppointmentHistoryTable(props) {
    const csrfToken = document.querySelectorAll('meta[name="csrf-token"]')[0].content
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getEvents()
    }, [])

    const getEvents = () => {
        fetch(`${process.env.BASE_URL}/events/booked/${props.user.id}`, {
            headers: {
                "X-CSRF-Token": csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(res => res.json())
            .catch(error => {
                props.addNotification({ id: new Date, type: "alert", message: "Could not retrieve events. Please refresh the page and try again. If this problem persists please contact your system administrator." })
                console.error('Error:', error)
                setLoading(false)
            })
            .then((res) => {
                setLoading(false)
                setEvents(res.events)
            })
    }

    const formattedDuration = (duration) => {
        let hours = duration.hours()
        let minutes = duration.minutes()

        hours < 1 ? hours = '' : hours = `${hours} hr`
        minutes < 1 ? minutes = '' : minutes = ` ${minutes} min`

        return hours + minutes

    }

    const appointmentHistoryTableRows = () => {
        if (events.length < 1 && loading === false) return <Table.Row><Table.Cell><p>No recent appointments...</p></Table.Cell></Table.Row>
        return events.sort((b, a) => new Date(a.start_time) - new Date(b.end_time)).map(a => <GoogleEventTableRow addNotification={props.addNotification} key={a.id} user={props.user} event={a} />)
    }

    return (
        <Tab.Pane loading={loading}>
            <Table style={{ gridArea: "panel" }} basic="very" >
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Date</Table.HeaderCell>
                        <Table.HeaderCell>Type</Table.HeaderCell>
                        <Table.HeaderCell>Duration</Table.HeaderCell>
                        <Table.HeaderCell>Attendees</Table.HeaderCell>
                        {/* <Table.HeaderCell>Paid</Table.HeaderCell> */}
                        <Table.HeaderCell>Billable Item</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {appointmentHistoryTableRows()}
                </Table.Body>
            </Table>





        </Tab.Pane>
    )
}


export default AdminAppointmentHistoryTable

