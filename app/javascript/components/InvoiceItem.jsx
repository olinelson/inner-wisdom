import React, { useState } from 'react'
import { Table, Label, Icon, Input, Modal, Button, Header } from "semantic-ui-react"
import moment from 'moment'
import { connect } from "react-redux"

function InvoiceItem(props) {
    const [i, setI] = useState(props.item)
    const [loading, setLoading] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [deleted, setDeleted] = useState(false)


    const isEditable = () => {
        if (props.invoice) {
            if (props.invoice.status === "open" || props.invoice.status === "void") return false
        }
        return true
    }

    const [editable, setEditable] = useState(isEditable)

    const updateItemHandeler = () => {
        setLoading(true)
        fetch(`${process.env.BASE_URL}/stripe/invoice_items`, {
            method: "PATCH",
            body: JSON.stringify({
                invoice_item: i
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
                setLoading(false)
                setI(res.updated_item)
                setModalOpen(false)
                // setModalOpen(false)
                // props.dispatch({ type: "SET_USERS", value: res.users })
            })
    }

    const removeStripeIdFromEvent = (invoice_item) => {
        fetch(`${process.env.BASE_URL}/remove_stripe_id_from_event`, {
            method: "POST",
            body: JSON.stringify({
                invoice_item
            }),
            headers: {
                "X-CSRF-Token": props.csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(res => res.json())
            .then(res => props.dispatch({ type: "SET_PERSONAL_AND_BUSINESS_EVENTS", value: res }))
            .then(() => {
                setModalOpen(false)
                setLoading(false)
                setDeleted(true)
            })
    }


    const deleteItemHandeler = () => {

        setLoading(true)
        fetch(`${process.env.BASE_URL}/stripe/invoice_items/delete`, {
            method: "POST",
            body: JSON.stringify({
                invoice_item: i
            }),
            headers: {
                "X-CSRF-Token": props.csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(res => res.json())
            .then(() => removeStripeIdFromEvent(i))
    }

    let strArray = i.amount.toString().split("")
    strArray.splice(strArray.length - 2, 0, ".")
    let prettyPrice = strArray.join("")

    let duration = moment(i.metadata.end_time) - moment(i.metadata.start_time)
    let prettyDuration = moment.duration(duration).humanize()




    return <>
        <Table.Row onClick={editable ? () => setModalOpen(true) : null} >

            <Table.Cell>{moment(i.metadata.start_time).format('Do MMMM YYYY, h:mm a')}</Table.Cell>
            <Table.Cell>{i.description}</Table.Cell>
            <Table.Cell>{"$" + prettyPrice}</Table.Cell>
            <Table.Cell>{prettyDuration}</Table.Cell>
            <Table.Cell>
                {/* <Label>
                    <Icon name='user' />
                    attendees
                    </Label> */}
            </Table.Cell>
        </Table.Row>

        <Modal onClose={() => setModalOpen(false)} open={modalOpen} >
            <Modal.Header>{i.number}</Modal.Header>
            <Modal.Content>

                <Table >
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Date</Table.HeaderCell>
                            <Table.HeaderCell>Description</Table.HeaderCell>
                            <Table.HeaderCell>Amount</Table.HeaderCell>
                            <Table.HeaderCell>Duration</Table.HeaderCell>
                            {/* <Table.HeaderCell>Attendees</Table.HeaderCell> */}
                            {/* <Table.HeaderCell>Invoiced</Table.HeaderCell> */}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>{moment(i.metadata.start_time).format('Do MMMM YYYY, h:mm a')}</Table.Cell>
                            <Table.Cell><Input onChange={(e) => setI({ ...i, description: e.target.value })} value={i.description} /></Table.Cell>
                            <Table.Cell><Input onChange={(e) => setI({ ...i, amount: e.target.value })} value={i.amount} /></Table.Cell>
                            <Table.Cell>{prettyDuration}</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
                <Button loading={loading} onClick={() => updateItemHandeler()}>Save</Button>
                <Button loading={loading} onClick={() => deleteItemHandeler()}>Delete Billable Item</Button>
            </Modal.Content>
        </Modal>
    </>
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



export default connect(mapStateToProps)(InvoiceItem)