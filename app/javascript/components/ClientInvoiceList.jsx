import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { Tab, Table, Label, Icon, Modal, Header, Button } from "semantic-ui-react"
import moment from "moment"
import InvoiceItem from './InvoiceItem';
import InvoiceTableRow from './InvoiceTableRow';

function InvoiceList(props) {
    const [invoices, setInvoices] = useState(null)
    const [loading, setLoading] = useState(false)

    const getInvoices = () => {
        fetch(`${process.env.BASE_URL}/stripe/invoices`, {
            method: "POST",
            body: JSON.stringify({
                user: props.user,
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


    const invoicesTableRows = () => {
        if (invoices && invoices.length) {

            return invoices.data.map(i => {
                if (i.status === "draft") return null

                let time = moment.duration(i.webhooks_delivered_at).humanize()
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

        return <Table.Row><Table.Cell>no invoices yet...</Table.Cell></Table.Row>
    }

    return (
        <>
            <Tab.Pane loading={loading} style={{ gridArea: "panel", margin: "0rem !important" }}>
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

            </Tab.Pane>
        </>
    )
}

const mapStateToProps = (state) => ({
    // appointments: state.appointments,
    // consults: state.consults,
    // // personalEvents: state.personalEvents,
    user: state.user,
    // users: state.users,
    // // myAccountPanel: state.myAccountPanel,
    // baseUrl: state.baseUrl,
    // defaultCalendarView: state.defaultCalendarView,
    // calendarScrollToTime: state.calendarScrollToTime,
    csrfToken: state.csrfToken
})



export default connect(mapStateToProps)(InvoiceList)