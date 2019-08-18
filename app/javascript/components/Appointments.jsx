import React from 'react'
import { Container, Divider, Label, Button } from 'semantic-ui-react'
import Calendar from './Calendar';
import { connect } from 'react-redux';
import styled from "styled-components"

export const isUserAnAttendeeOfEvent = (event, user) => {
    if (event.attendees === null) return false
    for (let att of event.attendees) {
        if (att.email === user.email) return true
    }
}

export const availableAndUserBookedAppointments = (events, user, personalEvents = []) => {
    let result = []

    if (!events) return result

    if (user) {
        result = events.filter(e => e.attendees == null || e.attendees.length < 1 || isUserAnAttendeeOfEvent(e, user))

        if (personalEvents) result = result.concat(personalEvents)


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



    return (
        <FullWidthCalendarContainer fluid>
            <div style={{ width: "100%", maxWidth: "95vw", justifySelf: "center" }}>
                <h1>Appointments</h1>
                <Label circular color={"blue"} content="My Appointments" />
                {/* <Label circular color={"green"} content="Personal" /> */}
                <Label circular color={"grey"} content="Bookable" />
            </div>
            <Divider style={{ gridArea: "divider" }} />
            <Calendar fullWidth purchasable events={availableAndUserBookedAppointments(props.events, props.user, props.personalEvents)} />
        </FullWidthCalendarContainer>
    )
}

const mapStateToProps = (state) => ({
    events: state.events,
    user: state.user,
    personalEvents: state.personalEvents
})

export default connect(mapStateToProps)(Appointments)
