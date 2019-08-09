import React, { useState } from 'react'
import { connect } from "react-redux"
import { Card, Button, Modal, Form, Checkbox } from "semantic-ui-react"
import { withRouter } from "react-router-dom"


function Clients(props) {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [tempPassword, setTempPassword] = useState("")
    const [confirmTempPassword, setConfirmTempPassword] = useState("")
    const [sendWelcomeEmail, setSendWelcomeEmail] = useState(false)


    let allUsersExceptMe = props.users.filter(u => u.id !== props.user.id)

    const createUserHandeler = (e) => {
        console.log(e.target)
        // fetch(`${props.baseUrl}/delete`, {
        //     method: "DELETE",
        //     body: JSON.stringify({
        //         event: event
        //     }),
        //     headers: {
        //         "X-CSRF-Token": props.csrfToken,
        //         "Content-Type": "application/json",
        //         Accept: "application/json",
        //         "X-Requested-With": "XMLHttpRequest"
        //     }
        // })
        //     .then(res => res.json())
        //     .then((res) => {
        //         props.dispatch({ type: "SET_PERSONAL_AND_BUSINESS_EVENTS", value: { scrollToEvent: res.scrollToEvent, events: res.events, personalEvents: res.personalEvents } })
        //     })
    }


    return (
        <div>
            <h4>Clients</h4>
            <Modal trigger={<Button icon="plus" content="Create" />}>
                <Modal.Header>Create New Client</Modal.Header>
                <Modal.Content image>
                    <Modal.Description>
                        <Form onSubmit={(e) => createUserHandeler(e)}>
                            <Form.Field>
                                <label>First Name</label>
                                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder='First Name' />
                            </Form.Field>
                            <Form.Field>
                                <label>Last Name</label>
                                <input value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder='Last Name' />
                            </Form.Field>
                            <Form.Field>
                                <label>Email</label>
                                <input value={email} onChange={(e) => setEmail(e.target.value)} required placeholder='newclient@gmail.com' />
                            </Form.Field>
                            <Form.Field>
                                <label>Temp. Password</label>
                                <input value={tempPassword} onChange={(e) => setTempPassword(e.target.value)} required />
                            </Form.Field>
                            <Form.Field>
                                <label>Confirm Temp. Password</label>
                                <input value={confirmTempPassword} onChange={(e) => setConfirmTempPassword(e.target.value)} required />
                            </Form.Field>
                            <Form.Field>
                                <Checkbox checked={sendWelcomeEmail} onChange={() => setSendWelcomeEmail(!sendWelcomeEmail)} label='Send User Welcome Email' />
                            </Form.Field>
                            <Button type="submit">Create</Button>
                        </Form>
                    </Modal.Description>
                </Modal.Content>
            </Modal >
            <Card.Group>

                {allUsersExceptMe.map(user => <Card
                    onClick={() => props.history.push(`/clients/${user.id}`)}
                    key={user.id}>
                    <Card.Content>
                        <Card.Header>{user.first_name + " " + user.last_name}</Card.Header>
                        <Card.Meta>{user.created}</Card.Meta>
                        <Card.Description>Matthew is a pianist living in Nashville.</Card.Description>
                    </Card.Content>
                </Card>)}
            </Card.Group>
        </div >
    )
}

const mapStateToProps = (state) => ({
    events: state.events,
    personalEvents: state.personalEvents,
    user: state.user,
    users: state.users,
    myAccountPanel: state.myAccountPanel,
    baseUrl: state.baseUrl
})


export default withRouter(connect(mapStateToProps)(Clients))
