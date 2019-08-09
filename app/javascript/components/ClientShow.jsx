import React from 'react'
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import { Container, Card, Item, Table, Label, Menu, Icon, Checkbox } from 'semantic-ui-react';
import { isUserAnAttendeeOfEvent } from "./Appointments"
import moment from "moment"


function ClientShow(props) {

    let userId = props.match.params.id
    let user = props.users.find(u => u.id == userId)
    let relevantAppointments = props.events.filter(e => isUserAnAttendeeOfEvent(e, user))

    let chronologicalSorted = relevantAppointments.sort((b, a) => new Date(a.start_time) - new Date(b.end_time))


    const formattedDuration = (duration) => {
        let hours = duration.hours()
        let minutes = duration.minutes()

        hours < 1 ? hours = '' : hours = `${hours} hr`
        minutes < 1 ? minutes = '' : minutes = ` ${minutes} min`

        return hours + minutes

    }

    const appointmentHistoryTableRows = () => {
        return chronologicalSorted.map(a => {

            let duration = moment.duration(moment(a.end_time) - moment(a.start_time))

            return <Table.Row key={a.id}>

                <Table.Cell>{moment(a.start_time).format('Do MMMM  YYYY h:mm a')}</Table.Cell>
                <Table.Cell>{formattedDuration(duration)}</Table.Cell>
                <Table.Cell>
                    <Label>
                        <Icon name='user' />
                        {user.first_name + " " + user.last_name}
                    </Label>
                </Table.Cell>
                <Table.Cell><Checkbox checked /></Table.Cell>
            </Table.Row>

        }

        )
    }
    console.log(props.events)

    return (
        <Container>

            <h4>{user.first_name + " " + user.last_name}</h4>
            <hr />
            <h4>Address</h4>
            <p>{user.street_address}</p>
            <p>{user.apartment_number}</p>
            <p>{user.suburb}</p>
            <p>{user.state}</p>
            <p>{user.post_code}</p>
            <hr />
            <h4>Email</h4>
            <p>{user.email}</p>

            <h4>Appointment History</h4>


            <Table basic="very" >
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Date</Table.HeaderCell>
                        <Table.HeaderCell>Duration</Table.HeaderCell>
                        <Table.HeaderCell>Attendees</Table.HeaderCell>
                        <Table.HeaderCell>Paid</Table.HeaderCell>

                        {/* <Table.HeaderCell>Header</Table.HeaderCell> */}
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {appointmentHistoryTableRows()}

                    {/* <Table.Row>
                        <Table.Cell>
                            <Label ribbon>First</Label>
                        </Table.Cell>
                        <Table.Cell>Cell</Table.Cell>
                        <Table.Cell>Cell</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>Cell</Table.Cell>
                        <Table.Cell>Cell</Table.Cell>
                        <Table.Cell>Cell</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>Cell</Table.Cell>
                        <Table.Cell>Cell</Table.Cell>
                        <Table.Cell>Cell</Table.Cell>
                    </Table.Row> */}
                </Table.Body>
            </Table>


        </Container>
    )
}

const mapStateToProps = (state) => ({
    events: state.events,
    // personalEvents: state.personalEvents,
    // user: state.user,
    users: state.users,
    // myAccountPanel: state.myAccountPanel,
    // baseUrl: state.baseUrl
    defaultCalendarView: state.defaultCalendarView,
    calendarScrollToTime: state.calendarScrollToTime
})

export default withRouter(connect(mapStateToProps)(ClientShow))
