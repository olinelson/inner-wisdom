import React, { useState } from 'react'
import styled from "styled-components"
import { Card, Label, Popup, Rating, Segment, Input, Loader, Divider, Dropdown, Modal, Grid, Header, Icon, Button } from 'semantic-ui-react';
import { connect } from "react-redux"
import moment from 'moment'
import DayPicker from 'react-day-picker';

import Checkout from "./Checkout"

function PurchasableEvent(props) {

    const event = props.event
    const [modalOpen, setModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)


    const showPrettyStartAndEndTime = () => {

        return <>
            <h4>{moment(event.start_time).format('Do MMMM  YYYY')}</h4>
            <p>{moment(event.start_time).format('h:mm a')} to {moment(event.end_time).format('h:mm a')}</p>
        </>
    }

    console.log(props)

    const onTokenHandeler = () => {
        fetch(`${props.baseUrl}/purchase`, {
            method: "POST",
            body: JSON.stringify({
                event: event,
                user: props.user
            }),
            headers: {
                "X-CSRF-Token": props.csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(res => res.json())
            .then((res) => props.dispatch({ type: "SET_EVENTS", value: res.events }))


    }

    const ifUserShowCheckout = () => {
        if (props.user) return <Checkout
            ammount={8000}
            email={props.user.email}
            onToken={onTokenHandeler}
        />
        return <>
            <Button content="Pay With Card" disabled />
            <Divider />
            <span><a href={`${props.baseUrl}/users/sign_in`}>Sign in</a> to make an appointment</span>
        </>
    }

    const modal = () => {

        return <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
        >
            <Header content={event.title} />
            <Modal.Content >
                <Modal.Description>
                    {showPrettyStartAndEndTime()}
                    <Divider hidden />

                    <div>
                        <p>$80</p>
                        {/* {showEventAttendees()} */}
                    </div>
                    <Divider hidden />
                    {/* {userPickerDropDown()} */}
                </Modal.Description>
                {ifUserShowCheckout()}
            </Modal.Content>
        </Modal>
    }


    return <>

        <Label
            style={{ height: "100%", width: "100%" }}
            color="blue"
            onClick={() => setModalOpen(true)}
        >
            <Loader size="mini" inverted active={loading} inline style={{ marginRight: ".5rem", marginLeft: "-.25rem" }} />
            {event.title}



        </Label>

        {modal()}


    </>
}



const mapStateToProps = (state, props) => ({

    user: state.user,
    users: state.users,
    events: state.events,

    csrfToken: state.csrfToken,
    baseUrl: state.baseUrl
})



export default connect(mapStateToProps)(PurchasableEvent)
