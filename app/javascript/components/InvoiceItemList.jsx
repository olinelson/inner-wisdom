import React, { useEffect, useState } from 'react'
import { Tab, Table, Button } from "semantic-ui-react"
import moment from "moment"
import InvoiceItem from './InvoiceItem'

import { useStateValue } from '../context/ClientShowContext'
import { getInvoiceItems, getInvoices } from './ClientShowApp'

const uuidv1 = require('uuid/v1')

function InvoiceItemList(props) {
    const [appState, dispatch] = useStateValue();

    const {
        events,
        csrfToken,
        user,
        invoiceItems,
        creating,
        loadingInvoiceItems } = appState

    const createNewInvoice = () => {
        dispatch({
            type: 'setCreating',
            creating: true
        })

        fetch(`${process.env.BASE_URL}/stripe/invoices/new`, {
            method: "POST",
            body: JSON.stringify({
                user: user
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
                dispatch({
                    type: 'addNotification',
                    notification: { id: new Date, type: "alert", message: "Could not create new invoice. Please try again. If this problem persists please contact your system administrator." }
                })
                console.error('Error:', error)
                dispatch({
                    type: 'setCreating',
                    creating: false
                })
            })
            .then((res) => {
                if (res.invoice) {
                    dispatch({
                        type: 'addNotification',
                        notification: { id: new Date, type: "notice", message: "New invoice created successfully." }
                    })

                    dispatch({
                        type: 'setInvoiceItems',
                        invoiceItems: null
                    })
                    getInvoiceItems(appState, dispatch)
                    getInvoices(appState, dispatch)
                }
                dispatch({
                    type: 'setCreating',
                    creating: false
                })
            })

    }


    // useEffect(() => {
    //     getInvoiceItems()
    // }, [])


    const invoiceItemsTableRows = () => {
        if (invoiceItems) {
            if (invoiceItems.length < 1) return <Table.Row><Table.Cell><p>No billable items yet... Or they are all on invoices</p></Table.Cell></Table.Row>
            return invoiceItems.map(i => {

                let strArray = i.amount.toString().split("")
                strArray.splice(strArray.length - 2, 0, ".")
                let prettyPrice = strArray.join("")

                let duration = moment(i.metadata.end_time) - moment(i.metadata.start_time)
                let prettyDuration = moment.duration(duration).humanize()

                return <InvoiceItem key={i.id} customer={user} item={i} />

            }
            )
        }
    }
    return (
        <Tab.Pane loading={loadingInvoiceItems}>
            <Button loading={creating} disabled={!invoiceItems || invoiceItems.length < 1 ? true : false} onClick={() => createNewInvoice()}>Add All To New Invoice</Button>
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


export default InvoiceItemList