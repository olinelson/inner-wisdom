import React, { useState, useEffect, useContext } from 'react'
import { Table, Label, Icon, Button, Checkbox, Modal, Header, Tab, Input, Divider } from "semantic-ui-react"
import moment from "moment"
import GoogleEventTableRow from './GoogleEventTableRow';

import { useStateValue } from '../context/ClientShowContext';

function AdminAppointmentHistoryTable() {
    const [{ loadingEvents, events }, dispatch] = useStateValue();

    const formattedDuration = (duration) => {
        let hours = duration.hours()
        let minutes = duration.minutes()

        hours < 1 ? hours = '' : hours = `${hours} hr`
        minutes < 1 ? minutes = '' : minutes = ` ${minutes} min`

        return hours + minutes
    }

    const appointmentHistoryTableRows = () => {
        if (events.length < 1 && loadingEvents === false) return <Table.Row><Table.Cell><p>No recent appointments...</p></Table.Cell></Table.Row>
        return events.sort((b, a) => new Date(a.start_time) - new Date(b.end_time)).map(a => <GoogleEventTableRow key={a.id} event={a} />)
    }



    return (
        <Tab.Pane loading={loadingEvents}>
            <Table style={{ gridArea: "panel" }} basic="very" >
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Date</Table.HeaderCell>
                        <Table.HeaderCell>Type</Table.HeaderCell>
                        <Table.HeaderCell>Duration</Table.HeaderCell>
                        <Table.HeaderCell>Attendees</Table.HeaderCell>
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

