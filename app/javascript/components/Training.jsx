import React from 'react'
import { TwoColumnContainer, ImageDiv } from "./StyledComponents"
export default function Training() {
    return <TwoColumnContainer text  >
        <h1 style={{ gridArea: "heading", textAlign: "right", alignSelf: "flex-end" }}>Training</h1>
        <div style={{ gridArea: "p1", textAlign: "right" }}>
            <p>I have spent 20 years as a trainer of mental health professionals in a variety of areas, including: counselling skills and theories; grief and loss; mental health in adulthood; treating psychological and emotional trauma; practitioner well-being and  burnout and training pastoral and Clinical Supervisors.</p>
            <p>Currently, I lecture Post graduate students in the School of Counselling at Excelsia College, Sydney.</p>
        </div>
        <ImageDiv height="50vh" gridArea="img" src="https://storage.googleapis.com/inner_wisdom_bucket/ballpen-blur-close-up-1925536.jpg" />
    </TwoColumnContainer>


}