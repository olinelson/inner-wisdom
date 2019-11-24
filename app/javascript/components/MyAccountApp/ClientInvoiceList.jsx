import React, { useEffect, useState } from 'react'
import { Table, Button, Loader, Divider } from "semantic-ui-react"
import moment from "moment"

function InvoiceList(props) {
    const [invoices, setInvoices] = useState(null)
    const [loading, setLoading] = useState(true)
    const csrfToken = document.querySelectorAll('meta[name="csrf-token"]')[0].content

    const getInvoices = () => {
        fetch(`${process.env.BASE_URL}/stripe/invoices`, {
            method: "POST",
            body: JSON.stringify({
                user: props.client,
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
            })
            .then((res) => {
                setInvoices(res.invoices)
                setLoading(false)
            })
    }


    useEffect(() => {
        getInvoices()
    }, [loading])


    const invoicesTableRows = () => {

        if (invoices && invoices.data.length) {

            return invoices.data.map(i => {
                if (i.status === "draft") return null

                // let time = moment.duration(i.webhooks_delivered_at).humanize()
                return <Table.Row
                    warning={i.status === "open"}
                    positive={i.status === "paid"}
                    negative={i.status === "void"}
                    key={i.number}>

                    <Table.Cell>{moment(i.created).format('Do MMM YYYY')}</Table.Cell>
                    <Table.Cell>{i.status}</Table.Cell>
                    <Table.Cell>{i.number}</Table.Cell>
                    <Table.Cell>{"$" + i.amount_due / 100}</Table.Cell>
                    <Table.Cell>{<Button basic icon="chain" onClick={() => window.open(i.hosted_invoice_url, '_blank')} />}</Table.Cell>
                    <Table.Cell>{<Button basic icon="download" as="a" href={i.invoice_pdf} />}</Table.Cell>
                </Table.Row>
            }
            )
        }
    }


    if (loading) return <><Divider hidden /><Loader active /><Divider hidden /></>

    if (!loading && !invoices.data.length) return <p>No invoices yet...</p>

    return <Table basic="very" >
        <Table.Header>
            <Table.Row >
                <Table.HeaderCell>Created</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Invoice No.</Table.HeaderCell>
                <Table.HeaderCell>Due</Table.HeaderCell>
                <Table.HeaderCell>Link</Table.HeaderCell>
                <Table.HeaderCell>PDF</Table.HeaderCell>

            </Table.Row>
        </Table.Header>

        <Table.Body>

            {invoicesTableRows()}
        </Table.Body>
    </Table>
}



export default InvoiceList