import React, { useState } from 'react'
import { Header, Modal, ModalContent } from "semantic-ui-react"
import ClientConsentForm from "./ClientConsentForm"

export default function UserConsentCheckbox(props) {


    return <p>I have read and understood this
                        {" "}
        <Modal
            closeIcon
            trigger={<a style={{ cursor: "pointer" }}>Consent Form</a>}
            header={< Header as='h1'>Inner Wisdom Psychology<Header.Subheader>Susan Stephenson</Header.Subheader></Header>}
            content={<ModalContent><ClientConsentForm /></ModalContent>}
            actions={['Done']}
        />
        {". "}
        I agree to the conditions for the counselling psychology service provided by Susan Stephenson.
                </p>
}
