import React from 'react'
import { Container, Header, Button, Divider } from "semantic-ui-react"
import { Jumbotron } from "./StyledComponents"
export default function Training() {
    return (
        <>
            {/* <Jumbotron style={{ backgroundImage: 'url("https://storage.googleapis.com/inner_wisdom_bucket/beautiful-bonsai-botany-1671256.jpg")' }} /> */}
            <Divider hidden />
            <Container text >

                <Header as="h1">Training</Header>

                <p>I have spent 20 years as a trainer of mental health professionals in a variety of areas, including: counselling skills and theories; grief and loss; mental health in adulthood; treating psychological and emotional trauma; practitioner well-being and  burnout and training pastoral and Clinical Supervisors.</p>
                <p>Currently, I lecture Post graduate students in the School of Counselling at Excelsia College, Sydney.</p>
                {/* <Button
                    content="Schedule Appointment"
                    onClick={() => props.history.push("/appointments")}
                /> */}

            </Container>
        </>
    )
}