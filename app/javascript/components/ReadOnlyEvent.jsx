import React, { useState } from 'react'
import styled from "styled-components"
import { Card, Label, Popup, Rating, Segment, Input, Loader, Divider, Dropdown, Modal, Grid, Header, Icon, Button } from 'semantic-ui-react';
import { connect } from "react-redux"
import moment from 'moment'
import DayPicker from 'react-day-picker';

import Checkout from "./Checkout"

function ReadOnlyEvent(props) {

    console.log("in read only event")

    const event = props.event
    const [modalOpen, setModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    let currentTime = new Date
    let eventTime = new Date(event.start_time)
    let hours = (eventTime.getTime() - currentTime.getTime()) / 3600000;

    const [inGracePeriod, setInGracePeriod] = useState(hours > 24)
    const [isCanceled, setIsCanceled] = useState(event.title.toLowerCase().includes("canceled"))

    const colorPicker = () => {
        if (isCanceled) return "red"
        return "blue"
    }

    // let currentTime = new Date
    // let eventTime = new Date(event.start_time)
    // let hours = (eventTime.getTime() - currentTime.getTime()) / 3600000;

    // if (hours < 24) return setInGracePeriod(false)



    const showPrettyStartAndEndTime = (selectedEvent) => {
        return <>
            <h4>{moment(selectedEvent.start_time).format('Do MMMM  YYYY')}</h4>
            <p>{moment(selectedEvent.start_time).format('h:mm a')} to {moment(selectedEvent.end).format('h:mm a')}</p>
        </>
    }

    // const isAnEmptySlot = () => {
    //     if (!personal && event.attendees == null) return true
    //     return false
    // }

    const cancelEvent = () => {
        setLoading(true)
        let baseUrl = process.env.BASE_URL

        let newTitle = "*Canceled " + event.title
        let editedEvent = { ...event, title: newTitle }
        setModalOpen(false)

        fetch(`${baseUrl}/cancel`, {
            method: "POST",
            body: JSON.stringify({
                inGracePeriod,
                event: editedEvent
            }),
            headers: {
                "X-CSRF-Token": props.csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(response => response.json())
            .then((res) => props.dispatch({ type: "SET_PERSONAL_AND_BUSINESS_EVENTS", value: { scrollToEvent: res.scrollToEvent, events: res.events, personalEvents: res.personalEvents } }))
    }

    const cancelationFee = () => {
        // let currentTime = new Date
        // let eventTime = new Date(event.start_time)
        // let hours = (eventTime.getTime() - currentTime.getTime()) / 3600000;

        if (!inGracePeriod) return <>
            <p>As this is less than 24 hours notice you will be charged in full</p>
        </>

        return <p>As this is more than 24 hours notice this cancellation is free.</p>
    }

    const cancelEventModal = () => {
        return <Modal trigger={<Button basic icon="trash" content='Cancel Appoitment' />} basic size='small'>
            <Header icon='trash' content='Delete Post' />
            <Modal.Content>
                <p>Are you sure you want to cancel this appointment?</p>

                {cancelationFee()}
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => cancelEvent()} color='red' inverted>
                    <Icon name='remove' /> Cancel Appointment
                            </Button>
                <Button color='green' inverted>
                    <Icon name='checkmark' /> Never Mind
                            </Button>
            </Modal.Actions>
        </Modal>
    }

    const modal = () => {
        return <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
        >
            <Header content={event.title} />
            <Modal.Content >
                <Modal.Description>
                    {showPrettyStartAndEndTime(event)}
                    <Divider hidden />
                    <p>{event.location}</p>
                    {isCanceled || currentTime > eventTime ? null : cancelEventModal()}
                </Modal.Description>

            </Modal.Content>
        </Modal>
    }





    return <>
        <Label
            style={{ height: "100%", width: "100%" }}
            color={colorPicker()}
            onClick={() => setModalOpen(true)}
        >
            <Loader size="mini" inverted active={loading} inline style={{ marginRight: ".5rem", marginLeft: "-.25rem" }} />
            {event.title}



        </Label>

        {modal()}


    </>
}



const mapStateToProps = (state, props) => ({
    // events: state.events,
    // personalEvents: state.personalEvents,
    // allEvents: state.events.concat(state.personalEvents),
    user: state.user,
    users: state.users,
    events: state.events,
    // users: state.users,
    csrfToken: state.csrfToken,
    baseUrl: state.baseUrl
})



export default connect(mapStateToProps)(ReadOnlyEvent)
