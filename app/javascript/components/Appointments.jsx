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

export function flatten(arr) {
    return [].concat(...arr)
}

export const relevantEvents = (appointments, consults, user) => {
    let result = []

    if (!appointments) return result

    let freeAppointments = appointments.filter(e => e.attendees == null || e.attendees.length < 1)
    let freeConsults = consults.filter(e => e.attendees == null || e.attendees.length < 1)


    if (user) {
        let usersAppointments = appointments.filter(e => isUserAnAttendeeOfEvent(e, user))
        let usersConsults = consults.filter(e => isUserAnAttendeeOfEvent(e, user))

        if (user.vetted) result = flatten([...usersAppointments, usersConsults, freeAppointments])
        else result = flatten([...freeConsults, usersConsults])

    } else {
        result = flatten([...freeConsults, freeAppointments])
    }

    console.log(result)
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
            <Calendar fullWidth purchasable events={relevantEvents(props.appointments, props.consults, props.user)} />
        </FullWidthCalendarContainer>
    )
}

const mapStateToProps = (state) => ({
    appointments: state.appointments,
    consults: state.consults,
    user: state.user,
    personalEvents: state.personalEvents

})

export default connect(mapStateToProps)(Appointments)
