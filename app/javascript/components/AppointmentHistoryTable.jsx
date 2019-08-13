import React from 'react'
import { Table, Label, Icon } from "semantic-ui-react"
import moment from "moment"

function AppointmentHistoryTable(props) {

    let chronologicalSorted = props.events.sort((b, a) => new Date(a.start_time) - new Date(b.end_time))

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
                        {props.user.first_name + " " + props.user.last_name}
                    </Label>
                </Table.Cell>
            </Table.Row>

        }

        )
    }


    return (
        <Table style={{ gridArea: "panel" }} basic="very" >
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Date</Table.HeaderCell>
                    <Table.HeaderCell>Duration</Table.HeaderCell>
                    <Table.HeaderCell>Attendees</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {appointmentHistoryTableRows()}
            </Table.Body>
        </Table>
    )
}

export default AppointmentHistoryTable