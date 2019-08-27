import React, { useState } from 'react'
import { Table, Modal, Icon, Label, Button, Checkbox, Dimmer, Loader } from "semantic-ui-react"
import moment from 'moment'
import { connect } from "react-redux"

function GoogleEventTableRow(props) {
    const [loading, setLoading] = useState(false)

    const a = props.event
    let type = ""

    if (a.calendar.id === process.env.APPOINTMENTS_CALENDAR_ID) type = "Appointment"
    if (a.calendar.id === process.env.CONSULTS_CALENDAR_ID) type = "Phone Consult"

    let onAnInvoice = a.extended_properties && a.extended_properties.private.stripe_id.length > 0 ? true : false
    let isPaid = a.extended_properties && a.extended_properties.private.paid === "true"

    let duration = moment.duration(moment(a.end_time) - moment(a.start_time))

    const formattedDuration = (duration) => {
        let hours = duration.hours()
        let minutes = duration.minutes()

        hours < 1 ? hours = '' : hours = `${hours} hr`
        minutes < 1 ? minutes = '' : minutes = ` ${minutes} min`

        return hours + minutes

    }

    const toogleAppointmentPaid = (a) => {
        setLoading(true)
        let bool = a.extended_properties.private.paid === "true"

        let editedEvent = {
            ...a, extended_properties: {
                private: {
                    paid: !bool,
                    stripe_id: ""
                }
            }
        }
        updateGoogleCalEvent(editedEvent)
    }

    const updateGoogleCalEvent = (event) => {
        fetch(`${process.env.BASE_URL}/update`, {
            method: "POST",
            body: JSON.stringify({
                event: event
            }),
            headers: {
                "X-CSRF-Token": props.csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(response => response.json())

            .then((res) => props.dispatch({ type: "SET_PERSONAL_AND_BUSINESS_EVENTS", value: res }))
            .then(() => setLoading(false))
    }

    const createInvoiceItem = (event) => {
        setLoading(true)
        fetch(`${process.env.BASE_URL}/stripe/invoice_items/create`, {
            method: "POST",
            body: JSON.stringify({
                event: event,
                user: props.user,
            }),
            headers: {
                "X-CSRF-Token": props.csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(res => res.json())
            .then((res) => {
                if (res.invoice_item) {
                    let editedEvent = { ...event, extended_properties: { private: { paid: false, stripe_id: res.invoice_item.id } } }
                    updateGoogleCalEvent(editedEvent)

                }

            })
    }


    return (
        <Table.Row>


            <Table.Cell>{moment(a.start_time).format('Do MMMM  YYYY h:mm a')}</Table.Cell>
            <Table.Cell>{type}</Table.Cell>
            <Table.Cell>{formattedDuration(duration)}</Table.Cell>
            <Table.Cell>
                <Label>
                    <Icon name='user' />
                    {props.user.first_name + " " + props.user.last_name}
                </Label>
            </Table.Cell>
            <Table.Cell>

                {onAnInvoice ? <Checkbox checked={false} /> :
                    <Modal
                        closeIcon
                        trigger={
                            <Checkbox checked={isPaid} />
                        }
                        header={isPaid ? "Mark appointment as un paid" : "Mark appointment as paid"}
                        content={"Are you sure you wish to mark this appointment as " + (isPaid ? " un paid." : " paid.")}
                        actions={['Cancel', { key: 'yes', content: 'Yes', positive: true, onClick: () => toogleAppointmentPaid(a) }]}
                    />
                }

            </Table.Cell>
            <Table.Cell>
                {onAnInvoice ? <Icon name="check" />
                    :
                    <Button
                        disabled={onAnInvoice || isPaid ? true : false || loading}
                        onClick={() => createInvoiceItem(a)}
                        content={"Bill Item"} />}

            </Table.Cell>
            <Table.Cell>
                {loading ? <Loader active={loading} inline size="tiny" /> :
                    <div style={{ width: "1.5rem" }} />
                }
            </Table.Cell>
        </Table.Row>
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

export default connect(mapStateToProps)(GoogleEventTableRow)