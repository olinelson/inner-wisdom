import React, { useState } from 'react'
import { Table, Label, Input, Modal, } from "semantic-ui-react"
import moment from 'moment'

import { useStateValue } from '../context/ClientShowContext'
import { getEvents, getInvoiceItems, getInvoices } from './ClientShowApp'

function InvoiceItem(props) {
    const [i, setI] = useState(props.item)
    // const [loading, setLoading] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [deleted, setDeleted] = useState(false)

    const [appState,
        dispatch] = useStateValue();

    const { csrfToken } = appState

    const refreshAction = () => {
        getInvoices(appState, dispatch)
        getInvoiceItems(appState, dispatch)
        getEvents(appState, dispatch)
    }



    const editable = props.invoice && props.invoice.status === "paid" ? false : true

    // const [editable, setEditable] = useState(isEditable)

    const updateItemHandler = () => {
        // setLoading(true)
        fetch(`${process.env.BASE_URL}/stripe/invoice_items`, {
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
            .then(res => res.json())
            .catch(error => {
                console.error('Error:', error)
                // setLoading(false)
                refreshAction()
            })
            .then((res) => {
                // setLoading(false)

                setI(res.updated_item)
                setModalOpen(false)
                if (props.invoice) {

                    refreshAction()
                }
            })
    }

    const removeStripeIdFromEvent = async (invoice_item) => {
        setModalOpen(false)
        const res = await fetch(`${process.env.BASE_URL}/remove_stripe_id_from_event`, {
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
            await res.json()
            dispatch({
                type: 'removeInvoiceItemAndUpdateEvent',
                invoiceItem: invoice_item
            })
            getEvents(appState, dispatch)
        } catch (error) {
            console.error('Error:', error)
        }



    }


    const deleteItemHandler = async () => {
        setDeleted(true)
        const res = await fetch(`${process.env.BASE_URL}/stripe/invoice_items/delete`, {
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
            await res.json()
            removeStripeIdFromEvent(i)
        } catch{
            console.error('Error:', error)
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
                trigger={<Table.Row >
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
                            <Table.Cell>{prettyDuration}</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>}
                actions={['Cancel', { key: 'save', content: 'Save', positive: true, onClick: () => updateItemHandler() }, { key: 'delete', content: 'Delete', negative: true, onClick: () => deleteItemHandler() }]}
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

export default InvoiceItem