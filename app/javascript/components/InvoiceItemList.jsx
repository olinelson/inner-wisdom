import React, { useEffect, useState } from 'react'
import { Tab, Table, Button } from "semantic-ui-react"
import moment from "moment"
import InvoiceItem from './InvoiceItem'

const uuidv1 = require('uuid/v1')

function InvoiceItemList(props) {
    const csrfToken = document.querySelectorAll('meta[name="csrf-token"]')[0].content
    const [loading, setLoading] = useState(true)
    const [invoiceItems, setInvoiceItems] = useState(null)
    const [creating, setCreating] = useState(false)

    const getInvoiceItems = () => {
        fetch(`${process.env.BASE_URL}/stripe/invoice_items`, {
            method: "POST",
            body: JSON.stringify({
                user: props.user
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
                if (res.invoice_items.data) {
                    setInvoiceItems(res.invoice_items)
                } else {
                    setInvoiceItems(null)
                }

            })
            .then(() => setLoading(false))
    }

    const createNewInvoice = () => {
        setCreating(true)
        fetch(`${process.env.BASE_URL}/stripe/invoices/new`, {
            method: "POST",
            body: JSON.stringify({
                user: props.user
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
                setCreating(false)
                setLoading(false)
                props.dispatch({ type: "ADD_NOTIFICATION", value: { id: uuidv1(), type: "alert", message: "Error Creating Invoice" } })
            })
            .then((res) => {
                if (res.invoice) {
                    setInvoiceItems(null)
                }
            })
            .then(() => setCreating(false))
            .then(() => setLoading(false))
        // .then(() => props.dispatch({ type: "ADD_NOTIFICATION", value: { id: uuidv1(), type: "notice", message: "New Invoice Created" } }))
    }


    useEffect(() => {
        getInvoiceItems()
    }, [loading])


    const invoiceItemsTableRows = () => {
        if (invoiceItems) {
            if (invoiceItems.data.length < 1) return <Table.Row><Table.Cell><p>No billable items yet...</p></Table.Cell></Table.Row>
            return invoiceItems.data.map(i => {

                let strArray = i.amount.toString().split("")
                strArray.splice(strArray.length - 2, 0, ".")
                let prettyPrice = strArray.join("")

                let duration = moment(i.metadata.end_time) - moment(i.metadata.start_time)
                let prettyDuration = moment.duration(duration).humanize()

                return <InvoiceItem key={i.id} customer={props.user} item={i} />

            }
            )
        }
    }

    return (
        <Tab.Pane loading={loading}>
            <Button loading={creating} disabled={!invoiceItems || invoiceItems.data.length < 1 ? true : false} onClick={() => createNewInvoice()}>Add All To New Invoice</Button>
            <Table selectable basic="very" >
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Date</Table.HeaderCell>
                        <Table.HeaderCell>Description</Table.HeaderCell>
                        <Table.HeaderCell>Amount</Table.HeaderCell>
                        <Table.HeaderCell>Duration</Table.HeaderCell>
                        <Table.HeaderCell>Attendees</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {invoiceItemsTableRows()}
                </Table.Body>
            </Table>

        </Tab.Pane>
    )
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



export default InvoiceItemList