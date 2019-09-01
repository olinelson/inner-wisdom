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

            })
    }


    const deleteItemHandeler = () => {
        setDeleted(true)
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
        {editable ?
            <Modal
                trigger={<Table.Row disabled={deleted} >
                    <Table.Cell>{moment(i.metadata.start_time).format('Do MMMM YYYY, h:mm a')}</Table.Cell>
                    <Table.Cell>{i.description}</Table.Cell>
                    <Table.Cell>{"$" + prettyPrice}</Table.Cell>
                    <Table.Cell>{prettyDuration}</Table.Cell>
                </Table.Row>}
                header={i.number}
                content={<Table >
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Date</Table.HeaderCell>
                            <Table.HeaderCell>Description</Table.HeaderCell>
                            <Table.HeaderCell>Amount</Table.HeaderCell>
                            <Table.HeaderCell>Duration</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>{moment(i.metadata.start_time).format('Do MMMM YYYY, h:mm a')}</Table.Cell>
                            <Table.Cell><Input onChange={(e) => setI({ ...i, description: e.target.value })} value={i.description} /></Table.Cell>
                            <Table.Cell>
                                <Input labelPosition='right' type='text' placeholder='80'>
                                    <Label basic>$</Label>
                                    <input type="number" onChange={(e) => setI({ ...i, amount: e.target.value * 100 })} value={parseInt(i.amount) / 100 === 0 ? "" : parseInt(i.amount) / 100} />
                                    <Label>.00</Label>
                                </Input>
                            </Table.Cell>
                            {/* <Input onChange={(e) => setI({ ...i, amount: e.target.value })} value={i.amount} /></Table.Cell> */}
                            <Table.Cell>{prettyDuration}</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>}
                actions={['Cancel', { key: 'save', content: 'Save', positive: true, onClick: () => updateItemHandeler() }, { key: 'delete', content: 'Delete', negative: true, onClick: () => deleteItemHandeler() }]}
            />
            :
            <Table.Row disabled={deleted} >

                <Table.Cell>{moment(i.metadata.start_time).format('Do MMMM YYYY, h:mm a')}</Table.Cell>
                <Table.Cell>{i.description}</Table.Cell>
                <Table.Cell>{"$" + prettyPrice}</Table.Cell>
                <Table.Cell>{prettyDuration}</Table.Cell>
            </Table.Row>
        }
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