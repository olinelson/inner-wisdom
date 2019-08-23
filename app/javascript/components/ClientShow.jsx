import React, { useState, useEffect, useRef } from 'react'
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import { Container, Card, Item, Table, Label, Menu, Button, Icon, Checkbox, Modal, Form, Header, Tab } from 'semantic-ui-react';
import { isUserAnAttendeeOfEvent, relevantEvents, flatten } from "./Appointments"
import moment from "moment"
import AppointmentHistoryTable from './AppointmentHistoryTable';
import InvoiceItems from './InvoiceItems';
import Invoices from './Invoices';


function ClientShow(props) {
    let userId = props.match.params.id
    let user = props.users.find(u => u.id == userId)

    if (!user) return props.history.push('/notfound')

    let relevantAppointments = flatten([...props.appointments, props.consults]).filter(e => isUserAnAttendeeOfEvent(e, user))


    const [first_name, set_first_name] = useState(user.first_name || "")
    const [last_name, set_last_name] = useState(user.last_name || "")
    const [phone_number, set_phone_number] = useState(user.phone_number || "")

    const [street_address, set_street_address] = useState(user.street_address || "")
    const [apartment_number, set_apartment_number] = useState(user.apartment_number || "")
    const [suburb, set_suburb] = useState(user.suburb || "")
    const [address_state, set_address_state] = useState(user.state || "")
    const [post_code, set_post_code] = useState(user.post_code || "")

    const [email, set_email] = useState(user.email || "")
    const [editModal, setEditModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [approveModal, setApproveModal] = useState(false)
    const [loading, setLoading] = useState(false)

    const [approved, setApproved] = useState(user.approved)

    let chronologicalSorted = relevantAppointments.sort((b, a) => new Date(a.start_time) - new Date(b.end_time))

    function useEffectSkipFirst(fn, arr) {
        const isFirst = useRef(true);

        useEffect(() => {
            if (isFirst.current) {
                isFirst.current = false;
                return;
            }

            fn();
        }, arr);
    }

    useEffectSkipFirst(
        () => {
            console.log("hi", approved);
            editUserHandeler()
        },
        [approved]
    );

    const approveUserHandeler = () => {
        setApproveModal(false)
        setApproved(!user.approved)
        // .then(() => console.log("done", approved))

    }




    const editUserHandeler = () => {
        let editedUser = { first_name, last_name, email, street_address, apartment_number, post_code, suburb, state: address_state, approved }

        fetch(`${props.baseUrl}/clients/${user.id}`, {
            method: "PATCH",
            body: JSON.stringify({
                user: editedUser
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
                setEditModal(false)
                props.dispatch({ type: "SET_USERS", value: res.users })
            })
    }

    const deleteUserHandeler = () => {
        fetch(`${props.baseUrl}/clients/${user.id}`, {
            method: "DELETE",
            headers: {
                "X-CSRF-Token": props.csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(res => res.json())
            .then((res) => {
                props.history.push('/clients')
                props.dispatch({ type: "SET_USERS", value: res.users })
            })
    }

    const panes = [
        { menuItem: 'Appointment History', render: () => <Tab.Pane content={<AppointmentHistoryTable events={relevantAppointments} user={user} />} /> },
        { menuItem: 'To Be Invoiced', render: () => <InvoiceItems user={user} /> },
        { menuItem: 'Invoices', render: () => <Invoices user={user} /> },

    ]

    return (
        <Container>

            <h1>{user.first_name + " " + user.last_name}</h1>
            <Button
                basic
                content="edit"
                onClick={() => setEditModal(true)}
                icon="edit"
            />
            <Button
                basic
                content="Delete User"
                onClick={() => setDeleteModal(true)}
                icon="delete"

            />

            <Button as='div' labelPosition='right'>
                <Button basic icon="check" content="approve" onClick={() => setApproveModal(true)} />
                {user.approved ?
                    <Label basic color='green' pointing='left' content="Approved" />
                    :
                    <Label basic color='red' pointing='left' content="Not Approved" />
                }

            </Button>


            <hr />
            <h4>Address</h4>
            <p>{user.street_address}</p>
            <p>{user.apartment_number}</p>
            <p>{user.suburb}</p>
            <p>{user.state}</p>
            <p>{user.post_code}</p>
            <hr />
            <h4>Email</h4>
            <p>{user.email}</p>


            <Tab panes={panes} renderActiveOnly={true} />





            <Modal onClose={() => setEditModal(false)} open={editModal}>
                <Modal.Header>Edit Client</Modal.Header>
                <Modal.Content image>
                    <Modal.Description>
                        <Form onSubmit={(e) => editUserHandeler(e)}>
                            <Form.Field>
                                <label>First Name</label>
                                <input value={first_name} onChange={(e) => set_first_name(e.target.value)} required placeholder='First Name' />
                            </Form.Field>
                            <Form.Field>
                                <label>Last Name</label>
                                <input value={last_name} onChange={(e) => set_last_name(e.target.value)} required placeholder='Last Name' />
                            </Form.Field>
                            <Form.Field>
                                <label>Email</label>
                                <input value={email || ""} onChange={(e) => set_email(e.target.value)} required placeholder='newclient@gmail.com' />
                            </Form.Field>
                            <Form.Field>
                                <label>Phone Number</label>
                                <input value={phone_number || ""} onChange={(e) => set_phone_number(e.target.value)} />
                            </Form.Field>
                            <Form.Field>
                                <label>Street Address</label>
                                <input value={street_address || ""} onChange={(e) => set_street_address(e.target.value)} />
                            </Form.Field>
                            <Form.Field>
                                <label>Apartment Number</label>
                                <input value={apartment_number || ""} onChange={(e) => set_apartment_number(e.target.value)} />
                            </Form.Field>
                            <Form.Field>
                                <label>Suburb/City</label>
                                <input value={suburb || ""} onChange={(e) => set_suburb(e.target.value)} />
                            </Form.Field>
                            <Form.Field>
                                <label>State</label>
                                <input value={address_state || ""} onChange={(e) => set_address_state(e.target.value)} />
                            </Form.Field>
                            <Form.Field>
                                <label>Post Code</label>
                                <input value={post_code || ""} onChange={(e) => set_post_code(e.target.value)} />
                            </Form.Field>

                            <Button loading={loading} type="submit">Submit</Button>
                        </Form>
                    </Modal.Description>
                </Modal.Content>
            </Modal >

            <Modal onClose={() => setDeleteModal(false)} open={deleteModal} basic size='small'>
                <Header icon='user delete' content='Delete User' />
                <Modal.Content>
                    <p>
                        Are you sure you would like to delete this user? This cannot be undone.
            </p>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        onClick={() => deleteUserHandeler()}
                        color='red'
                        inverted
                        icon="checkmark"
                        content="Yes, Delete"
                    />
                    <Button
                        onClick={() => setDeleteModal(false)}
                        basic
                        color='green'
                        inverted
                        icon="remove"
                        content="Cancel"
                    />
                </Modal.Actions>
            </Modal>

            <Modal onClose={() => setApproveModal(false)} open={approveModal} basic size='small'>
                <Header icon='user' content='Approve User' />
                <Modal.Content>
                    {user.approved ?
                        <p>Are you sure you would like to un approve this user? They will no loger be able to book appointments, only phone consultations.</p>
                        :
                        <p>Are you sure you would like to approve this user? This will enable them to book full appointments.</p>
                    }

                </Modal.Content>
                <Modal.Actions>
                    <Button
                        onClick={() => approveUserHandeler()}
                        color='red'
                        inverted
                        icon="checkmark"
                        content={user.approved ? "Yes, Un Approve" : "Yes Approve"}
                    />
                    <Button
                        onClick={() => setApproveModal(false)}
                        basic
                        color='green'
                        inverted
                        icon="remove"
                        content="Cancel"
                    />
                </Modal.Actions>
            </Modal>



        </Container>
    )
}


const mapStateToProps = (state) => ({
    appointments: state.appointments,
    consults: state.consults,
    // personalEvents: state.personalEvents,
    // user: state.user,
    users: state.users,
    // myAccountPanel: state.myAccountPanel,
    baseUrl: state.baseUrl,
    defaultCalendarView: state.defaultCalendarView,
    calendarScrollToTime: state.calendarScrollToTime,
    csrfToken: state.csrfToken
})

export default withRouter(connect(mapStateToProps)(ClientShow))
