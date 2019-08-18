import React from 'react'
import { Container, Header, Button, Divider } from "semantic-ui-react"
import { Jumbotron } from "./StyledComponents"
export default function Supervision() {
    return (
        <>
            <Jumbotron style={{ backgroundImage: 'url("https://storage.googleapis.com/inner_wisdom_bucket/beautiful-bonsai-botany-1671256.jpg")' }} />
            <Divider hidden />
            <Container text >

                <Header>Supervision</Header>

                <p>I began my training as a supervisor in Emotionally Focused Supervision in 1994 and completed the Psychology Board of Australia’s Approved Supervision training in 2014. I am accredited with the Australian Association of Supervisors as a trainer and currently provide clinical supervision for master’s student interns; early career psychologists and counsellors, as well as experienced mental health professionals from Psychology, Social Work and Clinical and Pastoral Counselling.</p>
                <p>I draw on self-reflective practice, creative and expressive approaches to supervision and am particularly interested in how the personal experience of the health practitioner helps or hinders their work with clients.</p>
                <Button
                    content="Schedule Appointment"
                    onClick={() => props.history.push("/appointments")}
                />

            </Container>
        </>
    )
}
