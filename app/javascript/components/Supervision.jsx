import React from 'react'
import { Container, Header, Button } from "semantic-ui-react"

export default function Supervision() {
    return (
        <Container text >

            <Header>Supervision page</Header>

            <Button
                content="Schedule Appointment"
                onClick={() => props.history.push("/appointments")}
            />

        </Container>
    )
}
