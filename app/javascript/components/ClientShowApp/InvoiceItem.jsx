import React, { useState } from 'react'
import { Table, Label, Input, Modal, } from "semantic-ui-react"
import moment from 'moment'

import InvoiceNotificationManager from './InvoiceNotificationManager'

import { useStateValue } from './ClientShowContext'
import { refreshAction } from './ClientShowApp'

function InvoiceItem(props) {
    const [i, setI] = useState(props.item)
    const [modalOpen, setModalOpen] = useState(false)

    const [deleting, setDeleting] = useState(false)
    const [saving, setSaving] = useState(false)



    const [appState,
        dispatch] = useStateValue();

    const { csrfToken } = appState


    let editable = true

    if (props.invoice) {
        let status = props.invoice.status

        if (status === "paid" || status === "void" || status === "open") editable = false
    }
    // props.invoice && props.invoice.status === "paid" ? false : true

    const updateItemHandler = async () => {
        setSaving(true)
        // setLoading(true)
        const res = await fetch(`${process.env.BASE_URL}/api/v1/stripe/invoice_items`, {
            method: "PATCH",
            body: JSON.stringify({
                invoice_item: i
            }),
            headers: {
                "X-CSRF-Token": csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
        try {
            if (!res.ok) throw 'Could not update invoice item'
            const json = await res.json()
            setI(json.updated_item)
            setModalOpen(false)
            refreshAction(appState, dispatch)

            dispatch({
                type: 'addNotification',
                notification: { id: new Date, type: "notice", message: "Changes Saved" }
            })
        } catch (error) {
            console.error('Error:', error)
            dispatch({
                type: 'addNotification',
                notification: { id: new Date, type: "alert", message: "Couldn't update billable item. Price must be either a whole number or have 2 decimal places." }
            })
            refreshAction(appState, dispatch)
        }
        setSaving(false)

    }

    const removeStripeIdFromEvent = async (invoice_item) => {

        const res = await fetch(`${process.env.BASE_URL}/api/v1/remove_stripe_id_from_event`, {
            method: "POST",
            body: JSON.stringify({
                invoice_item
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
                    type: 'removeInvoiceItemAndUpdateEvent',
                    invoiceItem: invoice_item
                })
                // getEvents(appState, dispatch)
                dispatch({
                    type: 'addNotification',
                    notification: {
                        id: new Date, type: "warning", message: "Billable Item Deleted"
                    }
                })
            }
        } catch (error) {
            console.error('Error:', error)
        }
        setModalOpen(false)
        refreshAction(appState, dispatch)
    }


    const deleteItemHandler = async () => {
        setDeleting(true)
        const res = await fetch(`${process.env.BASE_URL}/api/v1/stripe/invoice_items/delete`, {
            method: "POST",
            body: JSON.stringify({
                invoice_item: i
            }),
            headers: {
                "X-CSRF-Token": csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
        try {
            if (res.ok) removeStripeIdFromEvent(i)

        } catch{
            console.error('Error:', error)
            setModalOpen(false)
            refreshAction(appState, dispatch)
        }

    }

    let strArray = i.amount.toString().split("")
    strArray.splice(strArray.length - 2, 0, ".")
    let prettyPrice = strArray.join("")

    let duration = moment(i.metadata.end_time) - moment(i.metadata.start_time)
    let prettyDuration = moment.duration(duration).humanize()


    return <>

        {editable ?
            <Modal
                open={modalOpen}
                onOpen={() => setModalOpen(true)}
                trigger={<Table.Row >
                    <Table.Cell>{moment(i.metadata.start_time).format('Do MMMM YYYY, h:mm a')}</Table.Cell>
                    <Table.Cell>{i.description}</Table.Cell>
                    <Table.Cell>{"$" + prettyPrice}</Table.Cell>
                    <Table.Cell>{prettyDuration}</Table.Cell>
                </Table.Row>}
                header={i.number}
                content={
                    <>
                        <Table >
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
                                        <Input labelPosition='left' label="$" type='text' placeholder='80' type="number" onChange={(e) => setI({ ...i, amount: e.target.value * 100 })} value={i.amount / 100 || ""} />
                                    </Table.Cell>
                                    <Table.Cell>{prettyDuration}</Table.Cell>
                                </Table.Row>
                            </Table.Body>

                        </Table>
                    </>
                }
                actions={[{ key: 'cancel', content: 'Cancel', onClick: () => setModalOpen(false) }, { key: 'save', loading: saving, content: 'Save', positive: true, onClick: () => updateItemHandler() }, { key: 'delete', content: 'Delete', loading: deleting, negative: true, onClick: () => deleteItemHandler() }]}
            />

            :
            <Table.Row  >

                <Table.Cell>{moment(i.metadata.start_time).format('Do MMMM YYYY, h:mm a')}</Table.Cell>
                <Table.Cell>{i.description}</Table.Cell>
                <Table.Cell>{"$" + prettyPrice}</Table.Cell>
                <Table.Cell>{prettyDuration}</Table.Cell>
            </Table.Row>
        }
    </>
}

export default InvoiceItem