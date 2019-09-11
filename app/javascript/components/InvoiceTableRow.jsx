import React, { useState } from 'react'
import { Modal, Button, Table, Label, Icon, Dimmer, Placeholder, Loader } from "semantic-ui-react"
import InvoiceItem from "./InvoiceItem"
import moment from 'moment'
import { connect } from "react-redux"
import { parse } from 'url';

const uuidv1 = require('uuid/v1')

function InvoiceTableRow(props) {

    const [modalOpen, setModalOpen] = useState(false)
    const [voiding, setVoiding] = useState(false)
    const [sending, setSending] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [paying, setPaying] = useState(false)

    const csrfToken = document.querySelectorAll('meta[name="csrf-token"]')[0].content


    const invoice = props.invoice

    const deleteInvoiceHandeler = () => {
        setDeleting(true)
        fetch(`${process.env.BASE_URL}/stripe/invoices/delete`, {
            method: "POST",
            body: JSON.stringify({
                invoice
            }),
            headers: {
                "X-CSRF-Token": csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(res => res.json())
            .then((res) => {
                if (res.invoice) {
                    deleteStripeIdsFromEvents(res.invoice)
                }
            })
    }

    const deleteStripeIdsFromEvents = () => {
        fetch(`${process.env.BASE_URL}/remove_many_stripe_ids`, {
            method: "POST",
            body: JSON.stringify({
                invoice
            }),
            headers: {
                "X-CSRF-Token": csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(res => res.json())
            // .then(res => props.dispatch({ type: "SET_PERSONAL_AND_BUSINESS_EVENTS", value: res }))
            .then(() => {
                setDeleting(false)
                props.refreshAction()
            })
    }

    const sendInvoiceHandeler = () => {
        setSending(true)
        fetch(`${process.env.BASE_URL}/stripe/invoices/send`, {
            method: "POST",
            body: JSON.stringify({
                invoice
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
                setSending(false)
                setModalOpen(false)
                props.dispatch({ type: "ADD_NOTIFICATION", value: { id: uuidv1(), type: "alert", message: "Error Finalizing and Sending Invoice" } })
            })
            .then((res) => {
                if (res.invoice) {
                    setSending(false)
                    setModalOpen(false)
                    props.refreshAction()
                    // props.dispatch({ type: "ADD_NOTIFICATION", value: { id: uuidv1(), type: "notice", message: "Invoice Finalized and Sent" } })
                }
            })
    }
    const markInvoiceAsPaidHandeler = () => {
        setPaying(true)
        fetch(`${process.env.BASE_URL}/stripe/invoices/mark_as_paid`, {
            method: "POST",
            body: JSON.stringify({
                invoice
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
                setPaying(false)
                setModalOpen(false)
                props.dispatch({ type: "ADD_NOTIFICATION", value: { id: uuidv1(), type: "alert", message: "Error Marking Invoice as Paid" } })
            })
            .then((res) => {
                if (res.invoice) {
                    setPaying(false)
                    setModalOpen(false)
                    setInvoice({ ...invoice, status: "paid" })
                    // props.refreshAction()
                    // props.dispatch({ type: "ADD_NOTIFICATION", value: { id: uuidv1(), type: "notice", message: "Invoice Marked as Paid" } })
                }
            })
    }

    const voidInvoiceHandeler = () => {
        setVoiding(true)
        fetch(`${process.env.BASE_URL}/stripe/invoices/void`, {
            method: "POST",
            body: JSON.stringify({
                invoice: i
            }),
            headers: {
                "X-CSRF-Token": csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(res => res.json())
            .then((res) => {
                if (res.invoice) {
                    setVoiding(false)
                    setModalOpen(false)
                    props.refreshAction()
                }
            })
        // .then(() => setLoading(false))
    }

    const invoiceIconSwitch = (status) => {
        switch (status) {
            case "draft":
                return "edit"
            case "open":
                return "payment"
            case "paid":
                return "dollar sign"
            case "void":
                return "trash"

        }
    }
    const invoiceColorSwitch = (status) => {
        switch (status) {
            case "open":
                return "orange"
            case "paid":
                return "green"
            case "void":
                return "red"

        }
    }

    const showActionButtons = () => {
        switch (invoice.status) {
            case "draft":
                return <Button.Group basic>
                    <Modal
                        closeIcon
                        basic
                        size="small"
                        trigger={<Button loading={deleting} icon="delete" content="Delete" />}
                        header='Delete Invoice?'
                        content='Are you sure you would like to delete this invoice? This cannot be undone.'
                        actions={[{ key: 'cancel', basic: true, content: "Cancel", inverted: true }, { basic: true, key: 'yes', content: 'Yes, Delete', negative: true, onClick: () => deleteInvoiceHandeler() }]}
                    />
                    <Modal
                        closeIcon
                        basic
                        size="small"
                        trigger={<Button loading={sending} icon="paper plane" content="Finalize and Send" />}
                        header='Finalize and Send Invoice?'
                        content='Are you sure you would like to finalize and send this invoice?'
                        actions={[{ key: "cancel", basic: true, inverted: true, content: "cancel" }, { key: 'yes', basic: true, key: 'yes', content: 'Yes', positive: true, onClick: () => sendInvoiceHandeler() }]}
                    />
                    <Modal
                        closeIcon
                        basic
                        size="small"
                        trigger={<Button loading={paying} icon="dollar" content="Mark As Paid" />}
                        header='Mark As Paid?'
                        content='Are you sure you would like to mark this invoice as paid?'
                        actions={[{ basic: true, key: "cancel", inverted: true, content: 'Cancel' }, { basic: true, key: 'yes', content: 'Yes', positive: true, onClick: () => markInvoiceAsPaidHandeler() }]}
                    />
                </Button.Group>

            case "open":
                return <>
                    <Modal
                        closeIcon
                        basic
                        size="small"
                        trigger={<Button basic loading={voiding} icon="delete" content="Void Invoice" />}
                        header='Void Invoice?'
                        content='Are you sure you would like to void this invoice? This cannot be undone.'
                        actions={[{ content: 'Cancel', key: 'cancel', basic: true, inverted: true }, { basic: true, key: 'yes', content: 'Yes, Void It', negative: true, onClick: () => voidInvoiceHandeler() }]}
                    />
                    <Button basic as="a" icon="download" href={invoice.invoice_pdf} content="PDF" />
                    <Button basic onClick={() => window.open(invoice.hosted_invoice_url, '_blank')} icon="chain" content="Link" />
                    {/* <Button icon="mail" content="Send Invoice" onClick={() => sendInvoiceHandeler()} /> */}

                    <Button
                        loading={sending}
                        basic
                        content="Re Send"
                        icon='mail'
                        labelPosition='right'
                        onClick={() => sendInvoiceHandeler()}
                    />
                    <Modal
                        closeIcon
                        basic
                        size="small"
                        trigger={<Button basic loading={paying} icon="dollar" content="Mark As Paid" />}
                        header='Mark As Paid?'
                        content='Are you sure you would like to mark this invoice as paid?'
                        actions={[{ key: "cancel", content: "Cancel", basic: true, inverted: true }, { basic: true, key: 'yes', content: 'Yes', positive: true, onClick: () => markInvoiceAsPaidHandeler() }]}
                    />
                </>

            default:
                return null
        }
    }


    return <>
        <Table.Row
            onClick={() => setModalOpen(true)}
            warning={invoice.status === "open"}
            positive={invoice.status === "paid"}
            negative={invoice.status === "void"}
            key={invoice.number}>

            <Table.Cell>{moment(invoice.created).format('Do MMM YYYY')}</Table.Cell>
            <Table.Cell>{invoice.status}</Table.Cell>
            <Table.Cell>{invoice.number}</Table.Cell>
            <Table.Cell>{"$" + invoice.amount_due / 100}</Table.Cell>
            <Table.Cell>{invoice.status === "open" || invoice.status === "paid" ? <Icon name="check" /> : <Icon name="close" />}</Table.Cell>
        </Table.Row>

        <Modal

            open={modalOpen}
            onClose={() => setModalOpen(false)}
            closeIcon
        >


            <Modal.Header>
                <h1>Invoice</h1>
                <Label
                    content={invoice.status}
                    color={invoiceColorSwitch(invoice.status)}
                    icon={invoiceIconSwitch(invoice.status)}
                />
            </Modal.Header>
            <Modal.Content>
                <h4>{invoice.customer_name}</h4>


                <Modal.Description>

                    <Table basic selectable={invoice.status === "draft" ? true : false}>
                        <Table.Header>
                            <Table.Row >
                                <Table.HeaderCell>Created</Table.HeaderCell>
                                <Table.HeaderCell>Type</Table.HeaderCell>
                                <Table.HeaderCell>Amount</Table.HeaderCell>
                                <Table.HeaderCell>Duration</Table.HeaderCell>

                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {invoice.lines.data.map(item => <InvoiceItem {...props} setInvoice={(e) => setInvoice(e)} invoice={invoice} key={item.id} item={item} />)}
                        </Table.Body>
                    </Table>

                </Modal.Description >
            </Modal.Content>
            <Modal.Actions>
                {showActionButtons()}
            </Modal.Actions>
        </Modal>

    </>

}


// const mapStateToProps = (state) => ({
//     // appointments: state.appointments,
//     // consults: state.consults,
//     // // personalEvents: state.personalEvents,
//     // // user: state.user,
//     // users: state.users,
//     // // myAccountPanel: state.myAccountPanel,
//     // baseUrl: state.baseUrl,
//     // defaultCalendarView: state.defaultCalendarView,
//     // calendarScrollToTime: state.calendarScrollToTime,
//     csrfToken: state.csrfToken
// })



export default InvoiceTableRow