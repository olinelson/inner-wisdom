import React, { useState } from 'react'
import { Modal, Button, Table, Label, Dimmer, Placeholder, Loader } from "semantic-ui-react"
import InvoiceItem from "./InvoiceItem"
import moment from 'moment'
import { connect } from "react-redux"
import { parse } from 'url';

function InvoiceTableRow(props) {
    const [modalOpen, setModalOpen] = useState(false)
    const [voiding, setVoiding] = useState(false)
    const [sending, setSending] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [paying, setPaying] = useState(false)

    let i = props.invoice

    const deleteInvoiceHandeler = () => {
        setDeleting(true)
        fetch(`${process.env.BASE_URL}/stripe/invoices/delete`, {
            method: "POST",
            body: JSON.stringify({
                invoice: i
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
                if (res.invoice) {
                    deleteStripeIdsFromEvents(res.invoice)
                }
            })
    }

    const deleteStripeIdsFromEvents = () => {
        fetch(`${process.env.BASE_URL}/remove_many_stripe_ids`, {
            method: "POST",
            body: JSON.stringify({
                invoice: i
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
                setDeleting(false)
                props.refreshAction()
            })
    }

    const sendInvoiceHandeler = () => {
        setSending(true)
        fetch(`${process.env.BASE_URL}/stripe/invoices/send`, {
            method: "POST",
            body: JSON.stringify({
                invoice: i
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
                if (res.invoice) {
                    setSending(false)
                    setModalOpen(false)
                    props.refreshAction()
                }
            })
    }
    const markInvoiceAsPaidHandeler = () => {
        setPaying(true)
        fetch(`${process.env.BASE_URL}/stripe/invoices/mark_as_paid`, {
            method: "POST",
            body: JSON.stringify({
                invoice: i
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
                if (res.invoice) {
                    setPaying(false)
                    setModalOpen(false)
                    props.refreshAction()
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
                "X-CSRF-Token": props.csrfToken,
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
        switch (i.status) {
            case "draft":
                return <Button.Group basic>
                    <Modal
                        closeIcon
                        basic
                        size="small"
                        trigger={<Button loading={deleting} icon="delete" content="Delete" />}
                        header='Delete Invoice?'
                        content='Are you sure you would like to delete this invoice? This cannot be undone.'
                        actions={['Cancel', { key: 'yes', content: 'Yes, Delete', negative: true, onClick: () => deleteInvoiceHandeler() }]}
                    />
                    <Modal
                        closeIcon
                        basic
                        size="small"
                        trigger={<Button loading={sending} icon="paper plane" content="Finalize and Send" />}
                        header='Finalize and Send Invoice?'
                        content='Are you sure you would like to finalize and send this invoice?'
                        actions={['Cancel', { key: 'yes', content: 'Yes', positive: true, onClick: () => sendInvoiceHandeler() }]}
                    />
                    <Modal
                        closeIcon
                        basic
                        size="small"
                        trigger={<Button loading={paying} icon="dollar" content="Mark As Paid" />}
                        header='Mark As Paid?'
                        content='Are you sure you would like to mark this invoice as paid?'
                        actions={['Cancel', { key: 'yes', content: 'Yes', positive: true, onClick: () => markInvoiceAsPaidHandeler() }]}
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
                        actions={['Cancel', { key: 'yes', content: 'Yes, Void It', negative: true, onClick: () => voidInvoiceHandeler() }]}
                    />
                    <Button basic as="a" icon="download" href={i.invoice_pdf} content="PDF" />
                    <Button basic onClick={() => window.open(i.hosted_invoice_url, '_blank')} icon="chain" content="Link" />
                    {/* <Button icon="mail" content="Send Invoice" onClick={() => sendInvoiceHandeler()} /> */}

                    <Button
                        loading={sending}
                        basic
                        content="Re Send"
                        icon='mail'
                        label={{ basic: true, content: i.webhooks_delivered_at ? moment(i.webhooks_delivered_at).fromNow() : "No" }}
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
                        actions={['Cancel', { key: 'yes', content: 'Yes', positive: true, onClick: () => markInvoiceAsPaidHandeler() }]}
                    />
                </>

            default:
                return null
        }
    }


    return <>

        <Table.Row
            onClick={() => setModalOpen(true)}
            warning={i.status === "open"}
            positive={i.status === "paid"}
            negative={i.status === "void"}
            key={i.number}>

            <Table.Cell>{moment(i.created).format('Do MMM YYYY')}</Table.Cell>
            <Table.Cell>{i.status}</Table.Cell>
            <Table.Cell>{i.number}</Table.Cell>
            <Table.Cell>{"$" + i.amount_due / 100}</Table.Cell>
            <Table.Cell>{i.webhooks_delivered_at ? moment(i.webhooks_delivered_at).format('Do MMM YYYY @ h:mm a') : "No"}</Table.Cell>
        </Table.Row>

        <Modal

            open={modalOpen}
            onClose={() => setModalOpen(false)}
            closeIcon
        >


            <Modal.Header>
                <h1>Invoice</h1>
                <Label
                    content={i.status}
                    color={invoiceColorSwitch(i.status)}
                    icon={invoiceIconSwitch(i.status)}
                />
            </Modal.Header>
            <Modal.Content>
                <h4>{i.customer_name}</h4>


                <Modal.Description>

                    <Table basic selectable={i.status === "draft" ? true : false}>
                        <Table.Header>
                            <Table.Row >
                                <Table.HeaderCell>Created</Table.HeaderCell>
                                <Table.HeaderCell>Type</Table.HeaderCell>
                                <Table.HeaderCell>Amount</Table.HeaderCell>
                                <Table.HeaderCell>Duration</Table.HeaderCell>

                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {i.lines.data.map(item => <InvoiceItem invoice={i} key={item.id} item={item} />)}
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



export default connect(mapStateToProps)(InvoiceTableRow)