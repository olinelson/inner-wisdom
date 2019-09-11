import React, { useState, useEffect } from 'react'
import { connect } from "react-redux"
import { Card, Button, Modal, Search, Menu, Label, Form, Checkbox, Divider, Container } from "semantic-ui-react"
import { withRouter } from "react-router-dom"
import moment from "moment"
import { isUserAnAttendeeOfEvent, flatten } from "./Appointments"
import { debounce } from "debounce";
import styled from "styled-components"


function Clients(props) {
    const [first_name, setFirst_name] = useState("")
    const [last_name, setLast_name] = useState("")
    const [email, setEmail] = useState("")
    const [sendWelcomeEmail, setSendWelcomeEmail] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [filteredUsers, setFilteredUsers] = useState()

    const [users, setUsers] = useState(props.users)

    const tempPassword = Math.random().toString(36).slice(2)

    const csrfToken = document.querySelectorAll('meta[name="csrf-token"]')[0].content
    useEffect(() => {
        window.scroll({
            top: 0,
            left: 0,
        })
    }, []);

    // let allUsersExceptMe = props.users.filter(u => u.id !== props.user.id)
    let allUsersExceptMe = props.users



    const createUserHandeler = (e) => {
        setLoading(true)
        let newUser = { first_name, last_name, email, password: tempPassword, sendWelcomeEmail }
        fetch(`${process.env.BASE_URL}/clients`, {
            method: "POST",
            body: JSON.stringify({
                user: newUser
            }),
            headers: {
                "X-CSRF-Token": csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(res => res.json())
            .then((res) => {
                setLoading(false)
                setModalOpen(false)
                // props.dispatch({ type: "SET_USERS", value: res.users })
                setUsers([...users, res.newUser])
            })
    }

    const userFilter = (user, query) => {
        if (user.first_name.includes(query)) return true
        if (user.last_name.includes(query)) return true
        if (user.email.includes(query)) return true
        return false
    }

    const handleResultSelect = (e, { result }) => {
        props.history.push(`/clients/${result.id}`)
    }

    const handleSearchChange = (e, { value }) => {

        let allUsers = props.users
        let filtered = allUsers.filter(u => userFilter(u, value))
        let result = filtered.map(u => { return { title: `${u.first_name} ${u.last_name}`, id: u.id } })
        setFilteredUsers(result)

    }


    const SubMenu = styled.div`
        // display: flex;
        // justify-content: space-between;
        // width: 100%;
    `

    return (
        <Container>
            <h1>Clients</h1>
            <Menu fluid secondary >
                <Menu.Item

                    content={<Button basic onClick={() => setModalOpen(!modalOpen)} icon="plus" content="Create" />}
                />

                <Menu.Item
                    position="right"
                >

                    <Search
                        loading={loading}
                        onResultSelect={(e, { result }) => handleResultSelect(e, { result })}
                        onSearchChange={debounce(handleSearchChange, 500, {
                            leading: true,
                        })}
                        results={filteredUsers}
                    />
                </Menu.Item>



            </Menu>


            <Card.Group stackable doubling centered>

                {users.map(user => {
                    // let relevantAppointments = flatten([...props.appointments, props.consults]).filter(e => isUserAnAttendeeOfEvent(e, user))
                    // let pastAppointments = relevantAppointments.filter(a => new Date(a.start_time) < new Date)
                    // let futureAppointments = relevantAppointments.filter(a => new Date(a.start_time) > new Date)
                    // let relevantAppointments = 
                    // let pastAppointments =
                    // let futureAppointments 
                    return <Card
                        onClick={() => window.location = `/clients/${user.id}`}
                        key={user.id}>
                        <Card.Content>
                            <Card.Header>{user.first_name + " " + user.last_name}</Card.Header>
                            <Card.Meta>
                                {moment(user.created_at).format('MM/DD/YYYY')}
                            </Card.Meta>
                            <Card.Content extra>
                                <Label
                                    icon="history"
                                    // content={pastAppointments.length}
                                    content={100}
                                />
                                <Label
                                    icon="calendar"
                                    // content={futureAppointments.length}
                                    content={10}
                                />
                            </Card.Content>

                        </Card.Content>
                    </Card>

                }

                )}
            </Card.Group>



            <Modal closeIcon onClose={() => setModalOpen(false)} open={modalOpen}>
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
        </Container >
    )
}

const mapStateToProps = (state) => ({
    csrfToken: state.csrfToken,
    appointments: state.appointments,
    consults: state.consults,
    personalEvents: state.personalEvents,
    user: state.user,
    users: state.users,
    myAccountPanel: state.myAccountPanel,
    baseUrl: state.baseUrl
})


export default Clients
