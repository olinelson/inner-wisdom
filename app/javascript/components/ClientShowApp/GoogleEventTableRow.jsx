import React, { useState } from 'react'
import { Table, Icon, Label, Button, } from "semantic-ui-react"
import moment from 'moment'

import { useStateValue } from './ClientShowContext';
import { getInvoiceItems } from './ClientShowApp';


function GoogleEventTableRow(props) {

    const [appState, dispatch] = useStateValue();

    const { csrfToken, user } = appState

    const [loading, setLoading] = useState(false)

    const event = props.event
    let type = ""

    if (event.calendar.id === process.env.APPOINTMENTS_CALENDAR_ID) type = "Appointment"
    if (event.calendar.id === process.env.CONSULTS_CALENDAR_ID) type = "Phone Consult"

    let onAnInvoice = event.extended_properties && event.extended_properties.private.stripe_id.length > 0 ? true : false
    let isPaid = event.extended_properties && event.extended_properties.private.paid === "true"

    let duration = moment.duration(moment(event.end_time) - moment(event.start_time)).humanize()

    const updateGoogleCalEvent = async (event) => {
        const res = await fetch(`${process.env.BASE_URL}/api/v1/events/update`, {
            method: "POST",
            body: JSON.stringify({
                event
            }),
            headers: {
                "X-CSRF-Token": csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
        try {
            const json = await res.json()
            if (json !== null) {
                dispatch({
                    type: 'addNotification',
                    notification: { id: new Date, type: "notice", message: "Event updated successfully." }
                })
                setLoading(false)
                dispatch({
                    type: 'setEvents',
                    events: [...appState.events.filter(e => e.id !== json.editedEvent.id), json.editedEvent]
                })
                getInvoiceItems(appState, dispatch)
            }
        } catch (error) {
            dispatch({
                type: 'addNotification',
                notification: { id: new Date, type: "alert", message: "Could not update event. Please try again. If this problem persists please contact your system administrator." }
            })
            console.error('Error:', error)
            setLoading(false)
        }
    }

    const createInvoiceItem = async () => {
        setLoading(true)
        const res = await fetch(`${process.env.BASE_URL}/api/v1/stripe/invoice_items/create`, {
            method: "POST",
            body: JSON.stringify({
                event,
                user,
            }),
            headers: {
                "X-CSRF-Token": appState.csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
        try {
            const json = await res.json()
            if (json.invoice_item) {
                let editedEvent = { ...event, extended_properties: { private: { paid: false, stripe_id: json.invoice_item.id } } }
                updateGoogleCalEvent(editedEvent)
            }
        } catch (error) {
            dispatch({
                type: 'addNotification',
                notification: { id: new Date, type: "alert", message: "Could not create invoice item. Please try again. If this problem persists please contact your system administrator." }
            })
            console.error('Error:', error)
            setLoading(false)
        }
    }


    return (
        <Table.Row>
            <Table.Cell>{moment(event.start_time).format('Do MMMM  YYYY h:mm a')}</Table.Cell>
            <Table.Cell>{type}</Table.Cell>
            <Table.Cell>{duration}</Table.Cell>
            <Table.Cell>
                <Label>
                    <Icon name='user' />
                    {user.first_name + " " + user.last_name}
                </Label>
            </Table.Cell>
            <Table.Cell>
                {onAnInvoice ? <Icon name="check" />
                    :
                    <Button
                        loading={loading}
                        disabled={onAnInvoice || isPaid ? true : false || loading}
                        onClick={() => createInvoiceItem()}
                        content={"Bill Item"} />}

            </Table.Cell>
        </Table.Row>
    )
}

export default GoogleEventTableRow