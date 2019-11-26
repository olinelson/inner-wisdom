import React, { useEffect } from 'react'
import { Header, Accordion, Container, Table, List } from "semantic-ui-react"

export default function Fees() {


    const panels = [
        {
            key: 'medicare-rebate',
            title: 'What is the fee for psychological treatment? Are Medicare rebates available?',
            content: [
                'The Australian Psychological Society recommended fee is $254/hour. My standard fee is $150 for individuals and $180 for couples. If you have a referral from your GP - a Mental Health Care Plan - Medicare subsides up to 10 sessions a calendar year and you will only pay an $70 gap fee. For pensioners, unemployed people and fulltime students, the gap fee is $20. Many Health Funds also cover psychology. Fees will be discussed at your initial free phone consultation.',
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

        {
            key: 'cant-make-it',
            title: 'What if I can\'t make it to my appointment?',
            content: [
                'If you are unable to attend for any reason, please notify me via mobile, text or email as soon as possible. Anything less than 24 hours’ notice or failing to attend a session will incur a cancellation fee of 100%. Late arrivals will result in a short session as I may have other clients booked in following you.',
            ].join(' '),
        },


    ]



    return <Container text>
        <Header as="h1" content="Fees and Rebates" />
        <Accordion defaultActiveIndex={0} fluid styled panels={panels} />
    </Container>
}
