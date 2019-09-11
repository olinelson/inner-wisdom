import React, { useEffect, useState } from 'react'
import { Tab, Table } from "semantic-ui-react"
import InvoiceTableRow from './InvoiceTableRow';

function InvoiceList(props) {
    const [loading, setLoading] = useState(true)
    const [invoices, setInvoices] = useState(null)
    const csrfToken = document.querySelectorAll('meta[name="csrf-token"]')[0].content

    const getInvoices = () => {
        fetch(`${process.env.BASE_URL}/stripe/invoices`, {
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
                setInvoices(res.invoices)
            })
            .then(() => setLoading(false))
    }

    useEffect(() => {
        getInvoices()

    }, [loading])

    const invoicesTableRows = () => {
        if (invoices) {
            return invoices.data.map(i => {
                // let time = moment.duration(i.webhooks_delivered_at).humanize()
                return <InvoiceTableRow refreshAction={() => setLoading(true)} invoice={i} key={i.id} />
            }
            )
        }
        return null
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
                            <Table.HeaderCell>Email Delivered</Table.HeaderCell>

                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {invoicesTableRows()}
                    </Table.Body>
                </Table>

            </Tab.Pane>
        </>
    )
}


export default InvoiceList