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

export const availableAppointments = (events) => {
    if (!events) return []
    let result = events.filter(e => e.attendees == null || e.attendees.length < 1)
    return result
}


export const FullWidthCalendarContainer = styled(Container)`
        margin-top: 4rem;
        display: grid !Important;
        grid-template-columns: 1fr;
        grid-template-areas: "heading" "divider" "panel";
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
            <h1>Available Appointments</h1>
            <Divider style={{ gridArea: "divider" }} />
            <Calendar fullWidth purchasable events={availableAppointments(props.events)} />
        </FullWidthCalendarContainer>
    )
}

const mapStateToProps = (state) => ({
    events: state.events,
    user: state.user
})

export default connect(mapStateToProps)(Appointments)
