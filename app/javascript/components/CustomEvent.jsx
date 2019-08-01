import React from 'react'
import styled from "styled-components"
import { Card, Label } from 'semantic-ui-react';

export default function CustomEvent(props) {

    let event = props.event

    let EventCard = styled(Card)`
        background-color: ${() => event.type === "personal" ? "#EAAE00" : "#009C95"} !important;
        height: 100%;
    `


    return (

        <Label
            style={{ height: "100%" }}
            color={event.type === "personal" ? "green" : "blue"}
        >
            {event.title}

        </Label>


    )
}
