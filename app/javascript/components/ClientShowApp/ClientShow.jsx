import React, { useEffect, useState } from 'react'
import { Container, Label, Button, Modal, Form, Tab } from 'semantic-ui-react';
import AdminAppointmentHistoryTable from './AdminAppointmentHistoryTable';
import InvoiceItemList from './InvoiceItemList';
import InvoiceList from './InvoiceList';

import { useStateValue } from './ClientShowContext';

import { refreshAction } from './ClientShowApp'

function ClientShow() {

    const [appState, dispatch] = useStateValue();
    const { user, emailError, csrfToken } = appState

    const [approving, setApproving] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const setUser = (user) => {
        dispatch({
            type: 'setUser',
            user
        })
    }

    useEffect(() => {
        refreshAction(appState, dispatch)
    }, [])

    const isEmailValid = (email) => {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return (true)
        }
        return (false)
    }

    const setAndValidateEmail = (emailAddress) => {
        if (isEmailValid(emailAddress) === false) setEmailError(true)
        else setEmailError(false)
        setUser({ ...user, email: emailAddress })
    }

    const approveUserHandler = () => {
        setApproving(true)
        let editedUser = { ...user, approved: !user.approved }
        editUserHandler(editedUser)
    }

    const editUserHandler = async (editedUser = user) => {
        const res = await fetch(`${process.env.BASE_URL}/api/v1/clients/${user.id}`, {
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
        try {
            const json = await res.json()
            setApproving(false)
            setUser(json.user)
            dispatch({
                type: 'addNotification',
                notification: { id: new Date, type: "notice", message: "Client changes successfully saved" }
            })
        } catch (error) {
            dispatch({
                type: 'addNotification',
                notification: { id: new Date, type: "alert", message: "Could not edit client. Please try again. If this problem persists please contact your system administrator." }
            })
            console.error('Error:', error)
            setLoading(false)
        }
    }

    const deleteUserHandler = async () => {
        setDeleting(true)
        const res = await fetch(`${process.env.BASE_URL}/api/v1/clients/${user.id}`, {
            method: "DELETE",
            headers: {
                "X-CSRF-Token": csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
        try {
            if (res.ok) window.location = '/clients'
        } catch (error) {
            dispatch({
                type: 'addNotification',
                notification: { id: new Date, type: "alert", message: "Could not delete user. Please try again. If this problem persists please contact your system administrator." }
            })
            console.error('Error:', error)
            setLoading(false)
        }
    }

    const panes = [
        { menuItem: 'Appointment History', render: () => <AdminAppointmentHistoryTable /> },
        { menuItem: 'Billable Items', render: () => <InvoiceItemList /> },
        { menuItem: 'Invoices', render: () => <InvoiceList /> },

    ]

    return <Container>

        <h1>{user.first_name + " " + user.last_name}</h1>

        {/* edit user modal */}
        <Modal
            size="small"
            trigger={<Button basic content="edit" icon="edit" />}
            actions={[{ key: 'cancel', content: "Cancel", basic: true, onClick: () => setUser(props.user) }, { key: 'save', disabled: emailError, content: "Save", positive: true, basic: true, onClick: () => editUserHandler() }]}
            header="Edit User"
            content={
                <div style={{ margin: "1rem" }}>
                    <Form >
                        <Form.Input value={user.first_name || ""} label={"First Name"} placeholder='Bob' onChange={(e) => setUser({ ...user, first_name: e.target.value })} />

                        <Form.Input value={user.last_name || ""} label="Last Name" placeholder='Johnson' onChange={(e) => setUser({ ...user, last_name: e.target.value })} />

                        <Form.Input error={emailError ? "Invalid Email Address" : false} type="email" value={user.email || ""} label="Email" required placeholder='bobjohnson@example.com' onChange={(e) => setAndValidateEmail(e.target.value)} />

                        <Form.Input value={user.phone_number || ""} label="Phone Number" placeholder='0400123123' onChange={(e) => setUser({ ...user, phone_number: e.target.value })} />

                        <Form.Input value={user.street_address || ""} label="Street Address" placeholder='42 Wallaby Way' onChange={(e) => setUser({ ...user, street_address: e.target.value })} />

                        <Form.Input value={user.apartment_number || ""} label="Apartment No." placeholder='1' onChange={(e) => setUser({ ...user, apartment_number: e.target.value })} />

                        <Form.Input value={user.suburb || ""} label="Suburb" placeholder='Hornsby' onChange={(e) => setUser({ ...user, suburb: e.target.value })} />

                        <Form.Input value={user.state || ""} label="State" placeholder='NSW' onChange={(e) => setUser({ ...user, state: e.target.value })} />

                        <Form.Input value={user.post_code || ""} label="Post Code" placeholder='2017' onChange={(e) => setUser({ ...user, post_code: e.target.value })} />

                        <Form.Input value={user.medicare_number || ""} label="Medicare Number" placeholder='123456789' onChange={(e) => setUser({ ...user, medicare_number: e.target.value })} />

                    </Form>
                </div>
            }
        />


        {/* delete user modal */}
        <Modal
            closeIcon
            basic
            size="small"
            trigger={<Button loading={deleting} basic content="Delete User" icon="delete" />}
            header={"Delete User"}
            content="Are you sure you would like to delete this user? This cannot be undone."
            actions={[{ key: 'Cancel', content: 'Cancel', basic: true, inverted: true }, { key: 'delete', content: "Yes, Delete", negative: true, basic: true, onClick: () => deleteUserHandler() }]}
        />


        {/* approve user modal */}
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
            content={user.approved ? "Are you sure you would like to un approve this user? They will no longer be able to book appointments, only phone consultations." : "Are you sure you would like to approve this user? This will enable them to book full appointments."}
            actions={[{ key: 'cancel', basic: true, inverted: true, content: 'cancel' }, { basic: true, key: 'done', content: user.approved ? "Yes, Un Approve" : "Yes Approve", positive: true, onClick: () => approveUserHandler() }]}
        />

        {/* display of user details */}
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


        {/* invoice manageent panes */}
        <Tab panes={panes} renderActiveOnly={true} />

    </Container>
}

export default ClientShow
