import React, { useState, useEffect } from 'react'
import { Table, Label, Icon, Divider, Loader } from "semantic-ui-react"
import moment from "moment"


function AppointmentHistoryTable(props) {
    const { events } = props
    const loading = props.loading

    let chronologicalSorted = events.sort((b, a) => new Date(a.start_time) - new Date(b.end_time))

    const formattedDuration = (duration) => {
        let hours = duration.hours()
        let minutes = duration.minutes()

        hours < 1 ? hours = '' : hours = `${hours} hr`
        minutes < 1 ? minutes = '' : minutes = ` ${minutes} min`

        return hours + minutes

    }

    if (loading) return <><Divider hidden /><Loader active /><Divider hidden /></>

    return (
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
                                {props.current_user.first_name + " " + props.current_user.last_name}
                            </Label>
                        </Table.Cell>

                    </Table.Row>

                }
                )}
            </Table.Body>
        </Table>
    )
}

export default AppointmentHistoryTable

