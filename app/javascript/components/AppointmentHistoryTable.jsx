import React, { useState } from 'react'
import { Table, Label, Icon, Button, Checkbox, Modal, Header, Input, Divider } from "semantic-ui-react"
import moment from "moment"
import { connect } from "react-redux"
import GoogleEventTableRow from './GoogleEventTableRow';

function AdminAppointmentHistoryTable(props) {

    const [selectedEvent, setSelectedEvent] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)




    let chronologicalSorted = props.events.sort((b, a) => new Date(a.start_time) - new Date(b.end_time))

    const formattedDuration = (duration) => {
        let hours = duration.hours()
        let minutes = duration.minutes()

        hours < 1 ? hours = '' : hours = `${hours} hr`
        minutes < 1 ? minutes = '' : minutes = ` ${minutes} min`

        return hours + minutes

    }

    // const appointmentHistoryTableRows = () => {
    //     return chronologicalSorted.map(a => <GoogleEventTableRow key={a.id} user={props.user} event={a} />)
    // }


    return (
        <>
            {/* <h2>Appointment History</h2> */}


            <Table style={{ gridArea: "panel" }} basic="very" >
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Date</Table.HeaderCell>
                        <Table.HeaderCell>Type</Table.HeaderCell>
                        <Table.HeaderCell>Duration</Table.HeaderCell>
                        <Table.HeaderCell>Attendees</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {chronologicalSorted.map(a => {
                        let type = ""

                        if (a.calendar.id === process.env.APPOINTMENTS_CALENDAR_ID) type = "Appointment"
                        if (a.calendar.id === process.env.CONSULTS_CALENDAR_ID) type = "Phone Consult"
                        let duration = moment.duration(moment(a.end_time) - moment(a.start_time))

                        return <Table.Row key={a.id}>
                            <Table.Cell>{moment(a.start_time).format('Do MMMM  YYYY h:mm a')}</Table.Cell>
                            <Table.Cell>{type}</Table.Cell>
                            <Table.Cell>{formattedDuration(duration)}</Table.Cell>
                            <Table.Cell>
                                <Label>
                                    <Icon name='user' />
                                    {props.user.first_name + " " + props.user.last_name}
                                </Label>
                            </Table.Cell>

                        </Table.Row>

                    }
                    )}
                </Table.Body>
            </Table>





        </>
    )
}

const mapStateToProps = (state) => ({
    // appointments: state.appointments,
    // consults: state.consults,
    // // personalEvents: state.personalEvents,
    // // user: state.user,
    // users: state.users,
    // // myAccountPanel: state.myAccountPanel,
    // baseUrl: state.baseUrl,
    // defaultCalendarView: state.defaultCalendarView,
    // calendarScrollToTime: state.calendarScrollToTime,
    csrfToken: state.csrfToken
})

export default connect(mapStateToProps)(AdminAppointmentHistoryTable)

