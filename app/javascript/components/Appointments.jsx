import React from 'react'
import { Container, Divider } from 'semantic-ui-react'
import Calendar from './Calendar';
import { connect } from 'react-redux';
import styled from "styled-components"

export const isUserAnAttendeeOfEvent = (event, user) => {
    if (event.attendees === null) return false
    for (let att of event.attendees) {
        if (att.email === user.email) return true
    }
}

export const availableAndUserBookedAppointments = (events, user) => {
    let result = []

    if (!events) return result

    if (user) {
        result = events.filter(e => e.attendees == null || e.attendees.length < 1 || isUserAnAttendeeOfEvent(e, user))

    } else {
        result = events.filter(e => e.attendees == null || e.attendees.length < 1)
    }

    return result
}


export const FullWidthCalendarContainer = styled(Container)`
        margin-top: 4rem;
        display: grid !Important;
        grid-template-columns: 1fr;
        grid-template-areas: "heading" "divider" "panel";a
        justify-content: center ;
    `

function Appointments(props) {

    // const isUserAnAttendeeOfEvent = (event) => {
    //     if (event.attendees === null) return false
    //     for (let att of event.attendees) {
    //         if (att.email === props.user.email) return true
    //     }
    // }




    return (
        <FullWidthCalendarContainer>
            <h1>Appointments</h1>
            <Divider style={{ gridArea: "divider" }} />
            <Calendar fullWidth purchasable events={availableAndUserBookedAppointments(props.events, props.user)} />
        </FullWidthCalendarContainer>
    )
}

const mapStateToProps = (state) => ({
    events: state.events,
    user: state.user
})

export default connect(mapStateToProps)(Appointments)
