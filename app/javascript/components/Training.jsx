import React from 'react'
import { Container, Header, Button } from "semantic-ui-react"

export default function Training() {
    return (
        <Container text >

            <Header>Training page</Header>

            <Button
                content="Schedule Appointment"
                onClick={() => props.history.push("/appointments")}
            />

        </Container>
    )
}