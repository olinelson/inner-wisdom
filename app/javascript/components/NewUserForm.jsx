import React, { useState } from 'react'
import { Form, Container, Divider, Header, Modal, Button, ModalContent, Checkbox } from "semantic-ui-react"
import ClientConsentForm from "./ClientConsentForm"

export default function NewUserForms(props) {

    const [newUser, setNewUser] = useState({
        email: "",
        first_name: "",
        last_name: "",
        street_address: "",
        apartment_number: "",
        suburb: "",
        state: "",
        post_code: null,
        phone_number: "",
        medicare: "",
        password: "",
        password_confirm: "",
        consent: false
    })

    const states = [
        {
            key: 'NSW',
            text: 'NSW',
            value: 'NSW',
        },
        {
            key: 'VIC',
            text: 'VIC',
            value: 'VIC',
        },
        {
            key: 'QLD',
            text: 'QLD',
            value: 'QLD',
        },
        {
            key: 'SA',
            text: 'SA',
            value: 'SA',
        },
        {
            key: 'WA',
            text: 'WA',
            value: 'WA',
        },
        {
            key: 'TAS',
            text: 'TAS',
            value: 'TAS',
        },
        {
            key: 'ACT',
            text: 'ACT',
            value: 'ACT',
        },
        {
            key: 'NT',
            text: 'NT',
            value: 'NT',
        }
    ]

    console.log(props)

    const createUserHandeler = () => {
        fetch(`${process.env.BASE_URL}/users`, {
            method: "POST",
            body: JSON.stringify({
                user: newUser
            }),
            headers: {
                "X-CSRF-Token": document.querySelectorAll('meta[name="csrf-token"]')[0].content,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        }).then(e => e.json())
            .then(e => console.log(e))

    }


    return <p>I, {(newUser.first_name + " " + newUser.last_name)}
        {" "}have read and understood this
                        {" "}
        <Modal
            closeIcon
            trigger={<a style={{ cursor: "pointer" }}>Consent Form</a>}
            header={< Header as='h1'>Inner Wisdom Psychology<Header.Subheader>Susan Stephenson</Header.Subheader></Header>}
            content={<ModalContent><ClientConsentForm /></ModalContent>}
        // actions={['Snooze', { key: 'done', content: 'Done', positive: true }]}
        />
        {". "}
        I agree to the conditions for the counselling psychology service provided by Susan Stephenson.
                </p>

    // for when I get custom sign up working

    // return <Container text>
    //     <h1>Sign Up</h1>
    //     <Divider />
    //     <Form>
    //         <Header as='h3' icon='users' content='Contact Details' />
    //         <Form.Group widths='equal'>
    //             <Form.Input value={newUser.first_name} onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })} fluid label='First name' placeholder='Sigmund' />
    //             <Form.Input value={newUser.last_name} onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })} fluid label='Last name' placeholder='Freud' />

    //         </Form.Group>

    //         <Form.Input label="Phone" value={newUser.phone_number} onChange={(e) => setNewUser({ ...newUser, phone_number: e.target.value })} placeholder='0401 111 123' />
    //         <Form.Input label="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} placeholder='sigmundfreud@gmail.com' />

    //         <Divider hidden />

    //         <Header as='h3' icon='building' content='Address' />

    //         <Form.Group>
    //             <Form.Input label="Street Address" value={newUser.street_address} onChange={(e) => setNewUser({ ...newUser, street_address: e.target.value })} placeholder='42 Wallaby Way' />
    //             <Form.Input label="Apt. Number" value={newUser.apartment_number} onChange={(e) => setNewUser({ ...newUser, apartment_number: e.target.value })} placeholder='Apt 1' />
    //         </Form.Group>
    //         <Form.Group>
    //             <Form.Input label="Suburb" value={newUser.suburb} onChange={(e) => setNewUser({ ...newUser, suburb: e.target.value })} placeholder='Sydney' />
    //             <Form.Dropdown
    //                 label="state"
    //                 onChange={(e, d) => setNewUser({ ...newUser, state: d.value })}
    //                 placeholder='NSW'
    //                 fluid
    //                 selection
    //                 options={states}
    //             />
    //             <Form.Input label="Post Code" value={newUser.post_code || ""} onChange={(e) => setNewUser({ ...newUser, post_code: e.target.value })} placeholder='2000' />
    //         </Form.Group>

    //         <Divider hidden />

    //         <Header as='h3' icon='medkit' content='Medicare Number' />
    //         <Form.Input label="Medicare Number" value={newUser.medicare} onChange={(e) => setNewUser({ ...newUser, medicare: e.target.value })} />


    //         <Header as='h3' icon='key' content='Password' />
    //         {/* <Form.Group> */}
    //         <Form.Input type="password" label="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
    //         <Form.Input type="password" label="Password Confirm" value={newUser.password_confirm} onChange={(e) => setNewUser({ ...newUser, password_confirm: e.target.value })} />


    //         <Form.Group>
    //             <Form.Field>
    //                 <Checkbox checked={newUser.consent} onChange={() => setNewUser({ ...newUser, consent: !newUser.consent })} />
    //             </Form.Field>
    //             <Form.Field>
    //                 <p>I, {(newUser.first_name + " " + newUser.last_name)}
    //                     {" "}have read and understood this
    //                     {" "}
    //                     <Modal
    //                         closeIcon
    //                         trigger={<a style={{ cursor: "pointer" }}>Consent Form</a>}
    //                         header={< Header as='h1'>Inner Wisdom Psychology<Header.Subheader>Susan Stephenson</Header.Subheader></Header>}
    //                         content={<ModalContent><ClientConsentForm /></ModalContent>}
    //                     // actions={['Snooze', { key: 'done', content: 'Done', positive: true }]}
    //                     />
    //                     {". "}
    //                     I agree to the conditions for the counselling psychology service provided by Susan Stephenson.
    //             </p>
    //             </Form.Field>
    //         </Form.Group>


    //         <Divider hidden />

    //         <Button content="Sign Up" onClick={() => createUserHandeler()} />

    //     </Form>

    // </Container>
}
