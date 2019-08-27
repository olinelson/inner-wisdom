import React, { useState } from 'react'
import { Modal, Button, Table } from "semantic-ui-react"
import InvoiceItem from "./InvoiceItem"
import moment from 'moment'
import { connect } from "react-redux"

function InvoiceTableRow(props) {
    const [modalOpen, setModalOpen] = useState(false)
    let i = props.invoice

    const deleteInvoiceHandeler = () => {
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
                    setSelectedInvoice(null)
                    setLoading(true)
                    deleteStripeIdsFromEvents(res.invoice)
                }
            })
            .then(() => setLoading(false))
    }

    const sendInvoiceHandeler = () => {
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
        // .then(res => res.json())
        // .then((res) => {
        //     if (res.invoice) {
        //         setLoading(true)
        //     }
        // })
        // .then(() => setLoading(false))
    }

    const voidInvoiceHandeler = () => {
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
                    setLoading(true)
                }
            })
        // .then(() => setLoading(false))
    }

    const showActionButtons = () => {
        switch (i.status) {
            case "draft":
                return <Button.Group basic>
                    <Modal
                        closeIcon
                        basic
                        size="small"
                        trigger={<Button icon="delete" content="Delete" />}
                        header='Delete Invoice?'
                        content='Are you sure you would like to delete this invoice? This cannot be undone.'
                        actions={['Cancel', { key: 'yes', content: 'Yes, Delete', negative: true, onClick: () => deleteInvoiceHandeler() }]}
                    />
                    <Modal
                        closeIcon
                        basic
                        size="small"
                        trigger={<Button icon="paper plane" content="Finalize and Send" />}
                        header='Finalize and Send Invoice?'
                        content='Are you sure you would like to finalize and send this invoice?'
                        actions={['Cancel', { key: 'yes', content: 'Yes', positive: true, onClick: () => sendInvoiceHandeler() }]}
                    />
                </Button.Group>

            case "open":
                return <Button.Group basic>
                    <Modal
                        closeIcon
                        basic
                        size="small"
                        trigger={<Button icon="delete" content="Void Invoice" />}
                        header='Void Invoice?'
                        content='Are you sure you would like to void this invoice? This cannot be undone.'
                        actions={['Cancel', { key: 'yes', content: 'Yes, Void It', negative: true, onClick: () => voidInvoiceHandeler() }]}
                    />
                    <Button as="a" icon="download" href={i.invoice_pdf} content="PDF" />
                    <Button as="a" icon="chain" href={i.hosted_invoice_url} content="Link" />
                    <Button icon="mail" content="Send Invoice" onClick={() => sendInvoiceHandeler()} />
                </Button.Group>

            default:
                return null
        }
    }


    return <>

        <Table.Row
            onClick={() => setModalOpen(true)}
            warning={i.status === "open" || i.status == "draft"}
            positive={i.status === "paid"}
            negative={i.status === "void"}
            key={i.number}>

            <Table.Cell>{moment(i.created).format('Do MMM YYYY')}</Table.Cell>
            <Table.Cell>{i.status}</Table.Cell>
            <Table.Cell>{i.number}</Table.Cell>
            <Table.Cell>{i.amount_due}</Table.Cell>
            <Table.Cell>{i.amount_paid}</Table.Cell>
            <Table.Cell>{i.status_transitions.finalized_at ? moment(i.status_transitions.finalized_at).format('Do MMM YYYY @ h:mm a') : "No"}</Table.Cell>
        </Table.Row>

        <Modal

            open={modalOpen}
            onClose={() => setModalOpen(false)}
            closeIcon
        >
            <Modal.Header>Invoice</Modal.Header>
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