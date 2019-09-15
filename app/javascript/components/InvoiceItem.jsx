import React, { useState } from 'react'
import { Table, Label, Input, Modal, } from "semantic-ui-react"
import moment from 'moment'


function InvoiceItem(props) {
    const [i, setI] = useState(props.item)
    const [loading, setLoading] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [deleted, setDeleted] = useState(false)

    const csrfToken = document.querySelectorAll('meta[name="csrf-token"]')[0].content


    const editable = props.invoice && props.invoice.status === "paid" ? false : true

    // const [editable, setEditable] = useState(isEditable)

    const updateItemHandeler = () => {
        setLoading(true)
        fetch(`${process.env.BASE_URL}/stripe/invoice_itemsX`, {
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
                setLoading(false)
                props.refreshAction()
            })
            .then((res) => {
                setLoading(false)

                setI(res.updated_item)
                setModalOpen(false)
                if (props.invoice) {

                    props.refreshAction()
                    // let filteredItems = { ...props.invoice }.lines.data.filter(item => item.id !== i.id)
                    // props.setInvoice({ ...props.invoice, lines: { ...props.invoice.lines, data: [...filteredItems, res.updated_item] } })
                }


            })
    }

    const removeStripeIdFromEvent = (invoice_item) => {
        fetch(`${process.env.BASE_URL}/remove_stripe_id_from_event`, {
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
            .then(res => res.json())
            .catch(error => {
                // props.addNotification({ id: new Date, type: "alert", message: "Could not retreive events. Please try again. If this problem persists please contact your system administrator." })
                console.error('Error:', error)
                setLoading(false)
                setModalOpen(false)
            })
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
                "X-CSRF-Token": csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(res => res.json())
            .catch(error => {
                // props.addNotification({ id: new Date, type: "alert", message: "Could not retreive events. Please try again. If this problem persists please contact your system administrator." })
                console.error('Error:', error)
                setLoading(false)
                setModalOpen(false)
            })
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

export default InvoiceItem