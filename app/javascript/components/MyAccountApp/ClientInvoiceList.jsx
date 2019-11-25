import React from 'react'
import { Table, Button, Loader, Divider } from "semantic-ui-react"
import moment from "moment"

function InvoiceList(props) {
    const { loading, invoices } = props

    const invoicesTableRows = () => {

        if (invoices && invoices.data.length) {

            return invoices.data.map(i => {
                if (i.status === "draft") return null

                return (
                    <Table.Row
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
                )

            }
            )
        }
    }

    if (loading) return <><Divider hidden /><Loader active /><Divider hidden /></>

    if (!loading && !invoices.data.length) return <p>No invoices yet...</p>

    return (
        <Table basic="very" >
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
    )

}

export default InvoiceList