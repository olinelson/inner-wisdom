import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { Tab, Table, Label, Icon, Modal, Header, Button } from "semantic-ui-react"
import moment from "moment"
import InvoiceItem from './InvoiceItem';

function Invoices(props) {
    const [loading, setLoading] = useState(true)
    const [invoices, setInvoices] = useState(null)
    const [selectedInvoice, setSelectedInvoice] = useState(null)


    const createNewInvoice = () => {
        fetch(`${process.env.BASE_URL}/stripe/invoices/new`, {
            method: "POST",
            body: JSON.stringify({
                user: props.user
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
                    let data = [...invoices.data, res.invoice]
                    setInvoices({ ...invoices, data })
                }
            })
            .then(() => setLoading(false))
    }

    const sendInvoiceHandeler = () => {
        fetch(`${process.env.BASE_URL}/stripe/invoices/send`, {
            method: "POST",
            body: JSON.stringify({
                invoice: selectedInvoice
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
                    setSelectedInvoice(null)
                }
            })
            .then(() => setLoading(false))
    }

    const voidInvoiceHandeler = () => {
        fetch(`${process.env.BASE_URL}/stripe/invoices/void`, {
            method: "POST",
            body: JSON.stringify({
                invoice: selectedInvoice
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
            .then(() => setLoading(false))
    }

    const deleteInvoiceHandeler = () => {
        fetch(`${process.env.BASE_URL}/stripe/invoices/delete`, {
            method: "POST",
            body: JSON.stringify({
                invoice: selectedInvoice
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
                // this is to toggle the loading of the panel
                if (res.invoice) {
                    setSelectedInvoice(null)
                    setLoading(true)
                }
            })
            .then(() => setLoading(false))
    }


    const getInvoices = () => {
        fetch(`${process.env.BASE_URL}/stripe/invoices`, {
            method: "POST",
            body: JSON.stringify({
                user: props.user
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
                setInvoices(res.invoices)
            })
            .then(() => setLoading(false))
    }


    useEffect(() => {
        getInvoices()
    }, [loading])

    const showActionButtons = () => {
        let i = selectedInvoice
        switch (i.status) {
            case "draft":
                return <>
                    <Modal
                        basic
                        size="small"
                        trigger={<Button>Delete</Button>}
                        header='Delete Invoice?'
                        content='Are you sure you would like to delete this invoice? This cannot be undone.'
                        actions={['Cancel', { key: 'yes', content: 'Yes, Delete', negative: true, onClick: () => deleteInvoiceHandeler() }]}
                    />
                    <Modal
                        basic
                        size="small"
                        trigger={<Button>Finalize and Send</Button>}
                        header='Finalize and Send Invoice?'
                        content='Are you sure you would like to finalize and send this invoice?'
                        actions={['Cancel', { key: 'yes', content: 'Yes', positive: true, onClick: () => sendInvoiceHandeler() }]}
                    />
                </>

            case "open":
                return <>
                    <Modal
                        basic
                        size="small"
                        trigger={<Button>Void Invoice</Button>}
                        header='Void Invoice?'
                        content='Are you sure you would like to void this invoice? This cannot be undone.'
                        actions={['Cancel', { key: 'yes', content: 'Yes, Void It', negative: true, onClick: () => voidInvoiceHandeler() }]}
                    />
                    <Button as="a" href={i.invoice_pdf} content="PDF" />
                    <Button as="a" href={i.hosted_invoice_url} content="Link" />
                    <Button content="Send Invoice" onClick={() => sendInvoiceHandeler()} />
                </>

            default:
                return null
        }
    }


    const showInvoiceModal = () => {
        if (selectedInvoice == null) return null
        let i = selectedInvoice
        return <Modal closeIcon onClose={() => setSelectedInvoice(null)} closeOnDimmerClick open={selectedInvoice !== null}>
            <Modal.Header>Inv No. {i.number}</Modal.Header>
            <Modal.Content image>
                <Modal.Description>
                    <Header>{i.customer_name}</Header>
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
                    {showActionButtons()}

                </Modal.Description>
            </Modal.Content>
        </Modal>
    }



    const invoicesTableRows = () => {



        if (invoices) {

            return invoices.data.map(i => {

                let time = moment.duration(i.webhooks_delivered_at).humanize()


                return <Table.Row key={i.number} onClick={() => setSelectedInvoice(i)}>

                    <Table.Cell>{moment(i.created).format('Do MMM YYYY')}</Table.Cell>
                    <Table.Cell>{i.status}</Table.Cell>
                    <Table.Cell>{i.number}</Table.Cell>
                    <Table.Cell>{i.amount_due}</Table.Cell>
                    <Table.Cell>{i.amount_paid}</Table.Cell>
                    <Table.Cell>{i.status_transitions.finalized_at ? moment(i.status_transitions.finalized_at).format('Do MMM YYYY @ h:mm a') : "No"}</Table.Cell>
                </Table.Row>
            }
            )
        }
    }

    return (
        <>
            <Tab.Pane loading={loading}>
                <Table selectable basic="very" >
                    <Table.Header>
                        <Table.Row >
                            <Table.HeaderCell>Created</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                            <Table.HeaderCell>Invoice No.</Table.HeaderCell>
                            <Table.HeaderCell>Amount Due</Table.HeaderCell>
                            <Table.HeaderCell>Amount Paid</Table.HeaderCell>
                            <Table.HeaderCell>Email Delivered</Table.HeaderCell>

                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {invoicesTableRows()}
                    </Table.Body>
                </Table>

            </Tab.Pane>

            {showInvoiceModal()}
        </>
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



export default connect(mapStateToProps)(Invoices)