import React, { useState } from 'react'
import { Modal, Button, Table, Label, Icon, } from "semantic-ui-react"
import InvoiceItem from "./InvoiceItem"
import moment from 'moment'
import { getInvoices, getInvoiceItems, getEvents, refreshAction } from './ClientShowApp'

import { useStateValue } from './ClientShowContext';


const uuidv1 = require('uuid/v1')

function InvoiceTableRow(props) {

    const [appState, dispatch] = useStateValue();

    const { csrfToken } = appState

    const [modalOpen, setModalOpen] = useState(false)
    const [voiding, setVoiding] = useState(false)
    const [sending, setSending] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [paying, setPaying] = useState(false)

    const invoice = props.invoice

    const deleteInvoiceHandler = async () => {
        setDeleting(true)
        const res = await fetch(`${process.env.BASE_URL}/api/v1/stripe/invoices/delete`, {
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
        try {
            const json = await res.json()
            if (json.invoice) {
                deleteStripeIdsFromEvents(json.invoice)
            }
        } catch (error) {
            dispatch({
                type: 'addNotification',
                notification: { id: new Date, type: "alert", message: "Could not delete invoice. Please try again. If this problem persists please contact your system administrator." }
            })

            console.error('Error:', error)
            setDeleting(false)
            refreshAction(appState, dispatch)

        }

    }

    const deleteStripeIdsFromEvents = async () => {
        const res = await fetch(`${process.env.BASE_URL}/api/v1/remove_many_stripe_ids`, {
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
        try {
            if (res.ok) {
                dispatch({
                    type: 'addNotification',
                    notification: { id: new Date, type: "notice", message: "Multiple Billable Items Deleted" }
                })
            }

        } catch (error) {
            dispatch({
                type: 'addNotification',
                notification: { id: new Date, type: "alert", message: "Could not update events. Please try again. If this problem persists please contact your system administrator." }
            })
            console.error('Error:', error)

        }
        refreshAction(appState, dispatch)
    }

    const sendInvoiceHandler = async () => {
        setSending(true)
        const res = await fetch(`${process.env.BASE_URL}/api/v1/stripe/invoices/send`, {
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
        try {
            if (!res.ok) throw "Invoice not sent"
            setSending(false)
            setModalOpen(false)
            dispatch({
                type: 'addNotification',
                notification: { id: new Date, type: "notice", message: "Invoice finalized and sent." }
            })
            refreshAction(appState, dispatch)
        } catch (error) {
            dispatch({
                type: 'addNotification',
                notification: { id: new Date, type: "alert", message: "Could not finalize and send invoice. Please try again. If this problem persists please contact your system administrator." }
            })
            console.error('Error:', error)
            setSending(false)
            setModalOpen(false)
            refreshAction(appState, dispatch)
        }
    }

    const markInvoiceAsPaidHandler = async () => {
        setPaying(true)
        const res = await fetch(`${process.env.BASE_URL}/api/v1/stripe/invoices/mark_as_paid`, {
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

        try {
            if (!res.ok) throw "Invoice not marked as paid"
            setPaying(false)
            setModalOpen(false)
            refreshAction(appState, dispatch)
            dispatch({
                type: 'addNotification',
                notification: { id: new Date, type: "notice", message: "Invoice marked as paid." }
            })

        } catch (error) {
            dispatch({
                type: 'addNotification',
                notification: { id: new Date, type: "alert", message: "Could not mark as paid. Please try again. If this problem persists please contact your system administrator." }
            })
            console.error('Error:', error)
            setPaying(false)
            setModalOpen(false)
            refreshAction(appState, dispatch)

        }
    }

    const voidInvoiceHandler = async () => {
        setVoiding(true)
        const res = await fetch(`${process.env.BASE_URL}/api/v1/stripe/invoices/void`, {
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
        try {
            const json = await res.json()
            if (json.invoice) {
                dispatch({
                    type: 'addNotification',
                    notification: { id: new Date, type: "warning", message: "Invoice successfully voided." }
                })
                setVoiding(false)
                setModalOpen(false)
                refreshAction(appState, dispatch)
            }
        } catch (error) {
            dispatch({
                type: 'addNotification',
                notification: { id: new Date, type: "alert", message: "Could not void invoice. Please try again. If this problem persists please contact your system administrator." }
            })
            console.error('Error:', error)
            setVoiding(false)
            setModalOpen(false)
            refreshAction(appState, dispatch)
        }
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
                        actions={[{ key: 'cancel', basic: true, content: "Cancel", inverted: true }, { basic: true, key: 'yes', content: 'Yes, Delete', negative: true, onClick: () => deleteInvoiceHandler() }]}
                    />
                    <Modal
                        closeIcon
                        basic
                        size="small"
                        trigger={<Button loading={sending} icon="paper plane" content="Finalize and Send" />}
                        header='Finalize and Send Invoice?'
                        content='Are you sure you would like to finalize and send this invoice?'
                        actions={[{ key: "cancel", basic: true, inverted: true, content: "cancel" }, { key: 'yes', basic: true, key: 'yes', content: 'Yes', positive: true, onClick: () => sendInvoiceHandler() }]}
                    />
                    <Modal
                        closeIcon
                        basic
                        size="small"
                        trigger={<Button loading={paying} icon="dollar" content="Mark As Paid" />}
                        header='Mark As Paid?'
                        content='Are you sure you would like to mark this invoice as paid?'
                        actions={[{ basic: true, key: "cancel", inverted: true, content: 'Cancel' }, { basic: true, key: 'yes', content: 'Yes', positive: true, onClick: () => markInvoiceAsPaidHandler() }]}
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
                        actions={[{ content: 'Cancel', key: 'cancel', basic: true, inverted: true }, { basic: true, key: 'yes', content: 'Yes, Void It', negative: true, onClick: () => voidInvoiceHandler() }]}
                    />
                    <Button basic as="a" icon="download" href={invoice.invoice_pdf} content="PDF" />
                    <Button basic onClick={() => window.open(invoice.hosted_invoice_url, '_blank')} icon="chain" content="Link" />

                    <Button
                        loading={sending}
                        basic
                        content="Re Send"
                        icon='mail'
                        labelPosition='right'
                        onClick={() => sendInvoiceHandler()}
                    />
                    <Modal
                        closeIcon
                        basic
                        size="small"
                        trigger={<Button basic loading={paying} icon="dollar" content="Mark As Paid" />}
                        header='Mark As Paid?'
                        content='Are you sure you would like to mark this invoice as paid?'
                        actions={[{ key: "cancel", content: "Cancel", basic: true, inverted: true }, { basic: true, key: 'yes', content: 'Yes', positive: true, onClick: () => markInvoiceAsPaidHandler() }]}
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

            <Table.Cell>{invoice.status}</Table.Cell>
            <Table.Cell>{invoice.number}</Table.Cell>
            <Table.Cell>{"$" + invoice.amount_due / 100}</Table.Cell>
            <Table.Cell>{invoice.status === "open" || invoice.status === "paid" ? <Icon name="check" /> : <Icon name="close" />}</Table.Cell>
        </Table.Row>

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} closeIcon >
            <Modal.Header>
                <h1>Invoice</h1>
                <Label content={invoice.status} color={invoiceColorSwitch(invoice.status)} icon={invoiceIconSwitch(invoice.status)} />
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



export default InvoiceTableRow