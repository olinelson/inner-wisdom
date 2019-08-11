import React, { useState } from 'react'
import { connect } from "react-redux"
import { Card, Button, Modal, Form, Checkbox } from "semantic-ui-react"
import { withRouter } from "react-router-dom"


function Clients(props) {
    const [first_name, setFirst_name] = useState("")
    const [last_name, setLast_name] = useState("")
    const [email, setEmail] = useState("")
    // const [tempPassword, setTempPassword] = useState("")
    // const [confirmTempPassword, setConfirmTempPassword] = useState("")
    const [sendWelcomeEmail, setSendWelcomeEmail] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const tempPassword = Math.random().toString(36).slice(2)

    let allUsersExceptMe = props.users.filter(u => u.id !== props.user.id)

    const createUserHandeler = (e) => {
        setLoading(true)
        let newUser = { first_name, last_name, email, password: tempPassword, sendWelcomeEmail }
        fetch(`${props.baseUrl}/clients`, {
            method: "POST",
            body: JSON.stringify({
                user: newUser
            }),
            headers: {
                "X-CSRF-Token": props.csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(res => res.json())
            .then((res) => {
                setLoading(false)
                setModalOpen(false)
                props.dispatch({ type: "SET_USERS", value: res.users })
            })
    }





    return (
        <div>
            <h4>Clients</h4>
            <Button onClick={() => setModalOpen(!modalOpen)} icon="plus" content="Create" />
            <Modal onClose={() => setModalOpen(false)} open={modalOpen}>
                <Modal.Header>Create New Client</Modal.Header>
                <Modal.Content image>
                    <Modal.Description>
                        <Form onSubmit={(e) => createUserHandeler(e)}>
                            <Form.Field>
                                <label>First Name</label>
                                <input value={first_name} onChange={(e) => setFirst_name(e.target.value)} required placeholder='First Name' />
                            </Form.Field>
                            <Form.Field>
                                <label>Last Name</label>
                                <input value={last_name} onChange={(e) => setLast_name(e.target.value)} required placeholder='Last Name' />
                            </Form.Field>
                            <Form.Field>
                                <label>Email</label>
                                <input value={email} onChange={(e) => setEmail(e.target.value)} required placeholder='newclient@gmail.com' />
                            </Form.Field>
                            <Form.Field>
                                <Checkbox checked={sendWelcomeEmail} onChange={() => setSendWelcomeEmail(!sendWelcomeEmail)} label='Send User Welcome Email' />
                            </Form.Field>
                            <Button loading={loading} type="submit">Create</Button>
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
    csrfToken: state.csrfToken,
    events: state.events,
    personalEvents: state.personalEvents,
    user: state.user,
    users: state.users,
    myAccountPanel: state.myAccountPanel,
    baseUrl: state.baseUrl
})


export default withRouter(connect(mapStateToProps)(Clients))
