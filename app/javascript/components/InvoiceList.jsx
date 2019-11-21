import React, { useEffect, useState } from 'react'
import { Tab, Table } from "semantic-ui-react"
import InvoiceTableRow from './InvoiceTableRow';

import { useStateValue } from '../context/ClientShowContext'


function InvoiceList() {
    const [{
        csrfToken,
        invoices,
        user,
        loadingInvoices

    }, dispatch] = useStateValue();

    const invoicesTableRows = () => {
        if (invoices) {
            return invoices.data.map(i => {
                return <InvoiceTableRow invoice={i} key={i.id} />
            }
            )
        }
        return null
    }

    return (
        <>
            <Tab.Pane loading={loadingInvoices}>
                <Table selectable basic="very" >
                    <Table.Header>
                        <Table.Row >
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