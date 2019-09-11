import React, { useState } from 'react'
import { Table, Modal, Icon, Label, Button, Checkbox, Dimmer, Loader } from "semantic-ui-react"
import moment from 'moment'
import { connect } from "react-redux"

const uuidv1 = require('uuid/v1')

function GoogleEventTableRow(props) {
    const [loading, setLoading] = useState(false)
    const csrfToken = document.querySelectorAll('meta[name="csrf-token"]')[0].content
    const [event, setEvent] = useState(props.event)
    let type = ""

    if (event.calendar.id === process.env.APPOINTMENTS_CALENDAR_ID) type = "Appointment"
    if (event.calendar.id === process.env.CONSULTS_CALENDAR_ID) type = "Phone Consult"

    let onAnInvoice = event.extended_properties && event.extended_properties.private.stripe_id.length > 0 ? true : false
    let isPaid = event.extended_properties && event.extended_properties.private.paid === "true"

    let duration = moment.duration(moment(event.end_time) - moment(event.start_time)).humanize()

    const updateGoogleCalEvent = (event) => {
        fetch(`${process.env.BASE_URL}/events/update`, {
            method: "POST",
            body: JSON.stringify({
                event: event
            }),
            headers: {
                "X-CSRF-Token": csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Error:', error)
                setLoading(false)
                props.dispatch({ type: "ADD_NOTIFICATION", value: { id: uuidv1(), type: "alert", message: "Error Updating Calendar Event" } })
            })
            .then(r => {
                setLoading(false)
                setEvent(r.editedEvent)
            })
    }

    const createInvoiceItem = () => {
        setLoading(true)
        fetch(`${process.env.BASE_URL}/stripe/invoice_items/create`, {
            method: "POST",
            body: JSON.stringify({
                event,
                user: props.user,
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
                setLoading(false)
                props.dispatch({ type: "ADD_NOTIFICATION", value: { id: uuidv1(), type: "alert", message: "Error Creating Invoice Item" } })
            })
            .then((res) => {
                if (res.invoice_item) {
                    let editedEvent = { ...event, extended_properties: { private: { paid: false, stripe_id: res.invoice_item.id } } }
                    updateGoogleCalEvent(editedEvent)
                }
            })
    }


    return (
        <Table.Row>


            <Table.Cell>{moment(event.start_time).format('Do MMMM  YYYY h:mm a')}</Table.Cell>
            <Table.Cell>{type}</Table.Cell>
            <Table.Cell>{duration}</Table.Cell>
            <Table.Cell>
                <Label>
                    <Icon name='user' />
                    {props.user.first_name + " " + props.user.last_name}
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
// const mapStateToProps = (state) => ({
//     csrfToken: state.csrfToken
// })

export default GoogleEventTableRow