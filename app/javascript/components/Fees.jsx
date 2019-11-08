import React, { useEffect } from 'react'
import { Header, Accordion, Container, Table, List } from "semantic-ui-react"

export default function Fees() {


    const panels = [
        // {
        //     key: 'how-long-session',
        //     title: 'How long are the sessions?',
        //     content: [
        //         'Sessions are generally 60 minutes long.  Usually I will offer people a regular time so that it is easy to remember and plan for attending.',
        //     ].join(' '),
        // },
        // {
        //     key: 'how-many-sessions',
        //     title: 'How many sessions are needed?',
        //     content: [
        //         'This varies from person to person and depends upon the situation and context for each client. The aim is for us to uncover what is most important to you, which often means reflecting on past situations, on your hopes, values and goals for the future, as well as what is happening now.  This helps to develop a clearer picture about what causes problems, how they can be understood, and what can be done to address them.',
        //     ].join(' '),
        // },
        {
            key: 'medicare-rebate',
            title: 'What is the fee for psychological treatment? Are Medicare rebates available?',
            content: [
                'The Australian Psychological Society recommended fee is $254/hour. My standard fee is $160 for individuals and $200 for couples. If you have a referral from your GP - a Mental Health Care Plan - Medicare subsides up to 10 sessions a calendar year and you will only pay an $80 gap fee. For pensioners, unemployed people and fulltime students, the gap fee is $50. Many Health Funds also cover psychology. Fees will be discussed at your initial free phone consultation.',
            ].join(' '),
        },
        {
            key: 'health-fund-rebate',
            title: 'Are Health Fund rebates available?',
            content: [
                'Yes, a variety of private Health Funds provide rebates for Psychology. Please check with your provider for more details.',
            ].join(' '),
        },
        {
            key: 'how-do-I-pay',
            title: 'How can I pay for my sessions?  ',
            content: [
                'I accept cash, EFTPOS or direct deposit.',
            ].join(' '),
        },
        // {
        //     key: 'offer-skype',
        //     title: 'Do you offer Skype or telephone appointments?  ',
        //     content: [
        //         'Yes. I am happy to discuss your needs and circumstances and work using Skype or Facetime for counselling clients and supervisees.',
        //     ].join(' '),
        // },
        // {
        //     key: 'how-make-appointment',
        //     title: 'How do I make an appointment?',
        //     content: [
        //         'You can book a free 15 minute telephone consultation online. If we decide to go ahead, an appointment can be usually be made within 72 hours. Existing and returning clients can book sessions online.',
        //     ].join(' '),
        // },
        // {
        //     key: 'in-emergency',
        //     title: 'What do I do in an emergency?',
        //     content: {
        //         content: (
        //             <>
        //                 <p>Please contact any of the following organisation for prompt assistance:</p>

        //                 <Table basic='very' celled collapsing>
        //                     <Table.Header>
        //                         <Table.Row>
        //                             <Table.HeaderCell>Organisation</Table.HeaderCell>
        //                             <Table.HeaderCell>Phone Number</Table.HeaderCell>
        //                         </Table.Row>
        //                     </Table.Header>

        //                     <Table.Body>
        //                         <Table.Row>
        //                             <Table.Cell>Lifeline</Table.Cell>
        //                             <Table.Cell>13 11 14</Table.Cell>
        //                         </Table.Row>
        //                         <Table.Row>
        //                             <Table.Cell>Headspace – For young people 12-25 </Table.Cell>
        //                             <Table.Cell>1800 650 890</Table.Cell>
        //                         </Table.Row>
        //                         <Table.Row>
        //                             <Table.Cell>Anxiety Disorders Information & Support Line </Table.Cell>
        //                             <Table.Cell>1300 794 992</Table.Cell>
        //                         </Table.Row>
        //                         <Table.Row>
        //                             <Table.Cell>Mensline 24/7</Table.Cell>
        //                             <Table.Cell>1300 789 978</Table.Cell>
        //                         </Table.Row>
        //                         <Table.Row>
        //                             <Table.Cell>Sexual assault counselling</Table.Cell>
        //                             <Table.Cell>1800 806 292</Table.Cell>
        //                         </Table.Row>
        //                         <Table.Row>
        //                             <Table.Cell>Women's DV Helpline</Table.Cell>
        //                             <Table.Cell>1800 007 339</Table.Cell>
        //                         </Table.Row>
        //                     </Table.Body>
        //                 </Table>
        //             </>
        //         )

        //     }

        // },
        {
            key: 'cant-make-it',
            title: 'What if I can\'t make it to my appointment?',
            content: [
                'If you are unable to attend for any reason, please notify me via mobile, text or email as soon as possible. Anything less than 24 hours’ notice or failing to attend a session will incur a cancellation fee of 100%. Late arrivals will result in a short session as I may have other clients booked in following you.',
            ].join(' '),
        },
        // {
        //     key: 'confidential',
        //     title: 'Is what I say confidential?',
        //     content: {
        //         content: (
        //             <>
        //                 <p>Yes, no one can access your records without your permission, unless: exist:</p>
        //                 <List bulleted>
        //                     <List.Item>They are subpoenaed by a court</List.Item>
        //                     <List.Item>If your own or another person's safety is considered to be at risk</List.Item>
        //                     <List.Item>If I am required to fulfil my legal obligation as a mandatory reporter</List.Item>
        //                 </List>
        //             </>
        //         )
        //     }
        // },

    ]



    return <Container text>
        <Header as="h1" content="Fees and Rebates" />
        <Accordion defaultActiveIndex={0} fluid styled panels={panels} />
    </Container>
}
