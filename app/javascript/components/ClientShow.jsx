import React, { useState, useEffect, useRef } from 'react'
import { Container, Card, Item, Table, Label, Menu, Button, Icon, Checkbox, Modal, Form, Header, Tab, Divider } from 'semantic-ui-react';
import { isUserAnAttendeeOfEvent, relevantEvents, flatten } from "./Appointments"
import moment from "moment"
import AdminAppointmentHistoryTable from './AdminAppointmentHistoryTable';
import InvoiceItemList from './InvoiceItemList';
import InvoiceList from './InvoiceList';
import Message from './Message'

const uuidv1 = require('uuid/v1')


function ClientShow(props) {
    const csrfToken = document.querySelectorAll('meta[name="csrf-token"]')[0].content
    const [events, setEvents] = useState([])
    const [user, setUser] = useState(props.user)
    const [loading, setLoading] = useState(true)
    const [approving, setApproving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [notifications, setNotifications] = useState([])




    useEffect(() => {
        const timer = setTimeout(() => {

            if (notifications === []) return () => clearTimeout(timer)
            if (notifications.length > 1) {
                let newVal = [...notifications]
                newVal.pop()
                setNotifications(newVal)
            }
            else if (notifications.length === 1) {
                setNotifications([])
            }
            else {
                return () => clearTimeout(timer)
            }

        }, 10000);
        return () => clearTimeout(timer);
    }, [notifications]);

    const approveUserHandeler = () => {
        setApproving(true)
        let editedUser = { ...user, approved: !user.approved }
        editUserHandeler(editedUser)
    }

    const editUserHandeler = (editedUser = user) => {
        fetch(`${process.env.BASE_URL}/clients/${user.id}`, {
            method: "PATCH",
            body: JSON.stringify({
                user: editedUser
            }),
            headers: {
                "X-CSRF-Token": csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(res => res.json())
            .catch(error => {
                setNotifications([{ id: new Date, type: "alert", message: "Could not edit client. Please try again. If this problem persists please contact your system administrator." }, ...notifications])
                console.error('Error:', error)
                setLoading(false)
            })
            .then((res) => {
                setApproving(false)
                setUser(res.user)
                setNotifications([{ id: new Date, type: "notice", message: "Client changes successfully saved" }, ...notifications])
            })
    }

    const deleteUserHandeler = () => {
        setDeleting(true)
        fetch(`${process.env.BASE_URL}/clients/${user.id}`, {
            method: "DELETE",
            headers: {
                "X-CSRF-Token": csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(res => res.json())
            .catch(error => {
                setNotifications([{ id: new Date, type: "alert", message: "Could not delete user. Please try again. If this problem persists please contact your system administrator." }, ...notifications])
                console.error('Error:', error)
                setLoading(false)
            })
            .then((res) => {
                window.location = '/clients'
            })

    }

    const addNotification = (newNotification) => {
        let current = [...notifications]
        setNotifications([newNotification, ...current])
    }

    const panes = [
        { menuItem: 'Appointment History', render: () => <AdminAppointmentHistoryTable addNotification={(e) => addNotification(e)} user={user} /> },
        { menuItem: 'Billable Items', render: () => <InvoiceItemList addNotification={(e) => addNotification(e)} user={user} /> },
        { menuItem: 'Invoices', render: () => <InvoiceList addNotification={(e) => addNotification(e)} user={user} /> },

    ]

    return <>
        <div style={{ position: "fixed", right: "1rem", zIndex: "100" }}>
            {notifications.map(n => <Message key={uuidv1()} message={n} />)}
        </div>
        <Container>

            <h1>{user.first_name + " " + user.last_name}</h1>

            <Modal
                closeIcon
                size="small"
                trigger={<Button basic content="edit" icon="edit" />}
                actions={[{ key: 'cancel', content: "Cancel", basic: true, onClick: () => setUser(props.user) }, { key: 'save', content: "Save", positive: true, basic: true, onClick: () => editUserHandeler() }]}
                header="Edit User"
                content={
                    <div style={{ margin: "1rem" }}>
                        <Form >
                            <Form.Field>
                                <label>First Name</label>
                                <input value={user.first_name} required placeholder='First Name' onChange={(e) => setUser({ ...user, first_name: e.target.value })} />
                            </Form.Field>
                            <Form.Field>
                                <label>Last Name</label>
                                <input value={user.last_name} required placeholder='Last Name' onChange={(e) => setUser({ ...user, last_name: e.target.value })} />
                            </Form.Field>
                            <Form.Field>
                                <label>Email</label>
                                <input value={user.email || ""} onChange={(e) => setUser({ ...user, email: e.target.value })} />
                            </Form.Field>
                            <Form.Field>
                                <label>Phone Number</label>
                                <input value={user.phone_number || ""} onChange={(e) => setUser({ ...user, phone_number: e.target.value })} />
                            </Form.Field>
                            <Form.Field>
                                <label>Street Address</label>
                                <input value={user.street_address || ""} onChange={(e) => setUser({ ...user, street_address: e.target.value })} />
                            </Form.Field>
                            <Form.Field>
                                <label>Apartment Number</label>
                                <input value={user.apartment_number || ""} onChange={(e) => setUser({ ...user, apartment_number: e.target.value })} />
                            </Form.Field>
                            <Form.Field>
                                <label>Suburb/City</label>
                                <input value={user.suburb || ""} onChange={(e) => setUser({ ...user, suburb: e.target.value })} />
                            </Form.Field>
                            <Form.Field>
                                <label>State</label>
                                <input value={user.address_state || ""} onChange={(e) => setUser({ ...user, address_state: e.target.value })} />
                            </Form.Field>
                            <Form.Field>
                                <label>Post Code</label>
                                <input value={user.post_code || ""} onChange={(e) => setUser({ ...user, post_code: e.target.value })} />
                            </Form.Field>
                            <Form.Field>
                                <label>Medicare Number</label>
                                <input value={user.medicare_number || ""} onChange={(e) => setUser({ ...user, medicare_number: e.target.value })} />
                            </Form.Field>
                        </Form>
                    </div>
                }
            />



            <Modal
                closeIcon
                basic
                size="small"
                trigger={<Button loading={deleting} basic content="Delete User" icon="delete" />}
                header={"Delete User"}
                content="Are you sure you would like to delete this user? This cannot be undone."
                actions={['Cancel', { key: 'delete', content: "Yes, Delete", negative: true, basic: true, onClick: () => deleteUserHandeler() }]}
            />



            <Modal
                basic
                closeIcon
                size="small"
                trigger={
                    <Button as='div' labelPosition='right'>

                        {user.approved ?
                            <><Button loading={approving} basic icon="delete" content="Un Approve" /><Label basic color='green' pointing='left' content="Approved" /></>
                            :
                            <><Button loading={approving} basic icon="check" content="Approve" /><Label basic color='red' pointing='left' content="Not Approved" /></>}
                    </Button>}
                header={user.approved ? "Un Approve User" : "Approve User"}
                content={user.approved ? "Are you sure you would like to un approve this user? They will no loger be able to book appointments, only phone consultations." : "Are you sure you would like to approve this user? This will enable them to book full appointments."}
                actions={[{ key: 'cancel', basic: true, inverted: true, content: 'cancel' }, { basic: true, key: 'done', content: user.approved ? "Yes, Un Approve" : "Yes Approve", positive: true, onClick: () => approveUserHandeler() }]}
            />
            <hr />
            <h4>Address</h4>
            <p>{user.street_address}</p>
            <p>{user.apartment_number}</p>
            <p>{user.suburb}</p>
            <p>{user.state}</p>
            <p>{user.post_code}</p>

            <h4>Email</h4>
            <p>{user.email}</p>
            <h4>Phone</h4>
            <p>{user.phone_number}</p>
            <h4>Medicare Number</h4>
            <p>{user.medicare_number}</p>



            <Tab panes={panes} renderActiveOnly={true} />
        </Container>
    </>
}


// const mapStateToProps = (state) => ({
//     appointments: state.appointments,
//     consults: state.consults,
//     // personalEvents: state.personalEvents,
//     // user: state.user,
//     users: state.users,
//     // myAccountPanel: state.myAccountPanel,
//     baseUrl: state.baseUrl,
//     defaultCalendarView: state.defaultCalendarView,
//     calendarScrollToTime: state.calendarScrollToTime,
//     csrfToken: state.csrfToken
// })

export default ClientShow
