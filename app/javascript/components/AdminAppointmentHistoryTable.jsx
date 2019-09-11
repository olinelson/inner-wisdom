import React, { useState, useEffect } from 'react'
import { Table, Label, Icon, Button, Checkbox, Modal, Header, Input, Divider } from "semantic-ui-react"
import moment from "moment"
import GoogleEventTableRow from './GoogleEventTableRow';

function AdminAppointmentHistoryTable(props) {


    const formattedDuration = (duration) => {
        let hours = duration.hours()
        let minutes = duration.minutes()

        hours < 1 ? hours = '' : hours = `${hours} hr`
        minutes < 1 ? minutes = '' : minutes = ` ${minutes} min`

        return hours + minutes

    }

    const appointmentHistoryTableRows = () => {
        if (props.events.length < 1) return <Table.Row><Table.Cell><p>No recent appointments...</p></Table.Cell></Table.Row>
        return props.events.sort((b, a) => new Date(a.start_time) - new Date(b.end_time)).map(a => <GoogleEventTableRow key={a.id} user={props.user} event={a} />)
    }

    return (
        <>
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





        </>
    )
}

// const mapStateToProps = (state) => ({
//     // appointments: state.appointments,
//     // consults: state.consults,
//     // // personalEvents: state.personalEvents,
//     // // user: state.user,
//     // users: state.users,
//     // // myAccountPanel: state.myAccountPanel,
//     // baseUrl: state.baseUrl,
//     // defaultCalendarView: state.defaultCalendarView,
//     // calendarScrollToTime: state.calendarScrollToTime,
//     csrfToken: state.csrfToken
// })

export default AdminAppointmentHistoryTable

