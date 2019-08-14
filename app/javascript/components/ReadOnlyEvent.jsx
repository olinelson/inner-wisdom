import React, { useState } from 'react'
import styled from "styled-components"
import { Card, Label, Popup, Rating, Segment, Input, Loader, Divider, Dropdown, Modal, Grid, Header, Icon, Button } from 'semantic-ui-react';
import { connect } from "react-redux"
import moment from 'moment'
import DayPicker from 'react-day-picker';

import Checkout from "./Checkout"

function ReadOnlyEvent(props) {

    const event = props.event
    const [modalOpen, setModalOpen] = useState(false)

    const showPrettyStartAndEndTime = (selectedEvent) => {

        return <>
            <h4>{moment(selectedEvent.start_time).format('Do MMMM  YYYY')}</h4>
            <p>{moment(selectedEvent.start_time).format('h:mm a')} to {moment(selectedEvent.end).format('h:mm a')}</p>
        </>
    }
    const isAnEmptySlot = () => {
        if (!personal && event.attendees == null) return true
        return false
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
                    <p>session confirmed. address to do...</p>
                    <p>{event.location}</p>
                </Modal.Description>

            </Modal.Content>
        </Modal>
    }

    return <>

        <Label
            style={{ height: "100%", width: "100%" }}
            color={"blue"}
            onClick={() => setModalOpen(true)}
        >

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
