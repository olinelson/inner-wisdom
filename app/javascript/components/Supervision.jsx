import React from 'react'
import { Container, Header, Button, Divider, Image } from "semantic-ui-react"
import { Jumbotron, ImageDiv, TwoColumnContainer } from "./StyledComponents"
import styled from "styled-components"
export default function Supervision() {

    return <TwoColumnContainer text >
        <h1 style={{ gridArea: "heading", textAlign: "right", alignSelf: "flex-end" }}>Supervision</h1>
        <ImageDiv gridArea="img" height="50vh" src="https://storage.googleapis.com/inner_wisdom_bucket/bigbonsai.jpg" />
        <div style={{ gridArea: "p1", textAlign: "right" }}>
            <p>I began my training as a supervisor in Emotionally Focused Supervision in 1994 and completed the Psychology Board of Australia’s Approved Supervision training in 2014. I am accredited with the Australian Association of Supervisors as a trainer and currently provide clinical supervision for master’s student interns; early career psychologists and counsellors, as well as experienced mental health professionals from Psychology, Social Work and Clinical and Pastoral Counselling.</p>
            <p>I draw on self-reflective practice, creative and expressive approaches to supervision and am particularly interested in how the personal experience of the health practitioner helps or hinders their work with clients.</p>
        </div>
    </TwoColumnContainer>


}
