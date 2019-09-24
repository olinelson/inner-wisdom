import React from 'react'
import { Header, Container, Divider } from "semantic-ui-react"


export default function ClientConsentForm() {
    return <>
        <Header as="h3" content="Client Information & Consent" />
        {/* <Divider hidden /> */}
        <Header as="h4" content="Welcome" />
        <p>Clients’ privacy, rights and responsibilities are important issues. As a Psychologist registered with the Psychology Board of Australia, I follow the legal and ethical considerations that are outlined below. Please read and sign this form, then email it or bring it to your appointment. If you have any questions, don't hesitate to ask.</p>

        <Header as="h4" content="Access To Client Information" />
        <p>As part of providing informed psychological assessment and counselling to you, I need to collect and record personal information that is relevant to your situation, such as your name, contact information, medical history and other information like summaries of what happens during sessions. </p>

        <p>Your personal information is kept securely (in locked filing cabinets or with password protection on line) and, in the interests of your privacy, is not accessed by anyone else except with your permission. At any stage you can request in writing, to access to your client file (subject to exceptions in the relevant legislation). </p>

        <p>A more detailed description about how to access your personal information, or how to lodge a complaint about the management of your personal information is provided, in my “Privacy policy for management of personal information”. If you do not wish for your personal information to be collected in this way, I may not be in a position to provide the psychological service to you.</p>

        <Header as="h4" content="Disclosure Of Personal Information" />
        <p>All personal information gathered will <em>not</em> be disclosed except when:</p>
        <ol>
            <li>it is subpoenaed by a court; or</li>
            <li>failure to disclose the information would place you or another person at serious risk to life, health or safety; or</li>
            <li>your prior approval has been obtained to
                <ol type="a">
                    <li>provide a written report to another professional or agency. e.g., a GP or a lawyer; or</li>
                    <li>discuss the material with another person, eg. a parent, employer or health provider; or </li>
                </ol>
            </li>
            <li>disclosure is otherwise required or authorised by law, eg. mandatory reporting of child abuse.</li>
        </ol>

        <p>Your personal information is not disclosed to overseas recipients, unless you consent, or such disclosure is otherwise required by law. Your personal information will not be used, sold, rented or disclosed for any other purpose.</p>

        <Header as="h4" content="Cancellation Policy" />
        <p>If, for some reason you need to cancel or postpone your appointment, please give at least 24 hours’ notice, otherwise you will be charged the cost for the session.</p>
    </>
}
