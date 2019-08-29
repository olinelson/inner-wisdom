import React from 'react'
import { Container, Divider, Label, Button } from 'semantic-ui-react'
import Calendar from './Calendar';
import { connect } from 'react-redux';
import styled from "styled-components"
import { CalendarContainer } from "./StyledComponents"
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from "moment"
import ReadOnlyEvent from "./ReadOnlyEvent"
import PurchasableEvent from "./PurchasableEvent"

export const isUserAnAttendeeOfEvent = (event, user) => {
    if (event.attendees === null) return false
    for (let att of event.attendees) {
        if (att.email === user.email) return true
    }
}

export function flatten(arr) {
    return [].concat(...arr)
}

export const isInTheFuture = (event) => {
    let now = new Date
    let eventTime = new Date(event.start_time)
    return now < eventTime
}

export const relevantEvents = (appointments, consults, user) => {
    let result = []

    // if (!appointments) return result

    let freeAppointments = appointments.filter(e => (e.attendees == null || e.attendees.length < 1) && isInTheFuture(e))
    let freeConsults = consults.filter(e => (e.attendees == null || e.attendees.length < 1) && isInTheFuture(e))


    if (user) {
        let usersAppointments = appointments.filter(e => isUserAnAttendeeOfEvent(e, user))
        let usersConsults = consults.filter(e => isUserAnAttendeeOfEvent(e, user))

        if (user.approved) result = flatten([...usersAppointments, usersConsults, freeAppointments])
        else result = flatten([...freeConsults, usersConsults])

    } else {
        result = flatten([...freeConsults, freeAppointments])
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
    const localizer = momentLocalizer(moment)

    return (
        <FullWidthCalendarContainer fluid>
            <div style={{ width: "100%", maxWidth: "95vw", justifySelf: "center" }}>
                <h1>Appointments</h1>
            </div>
            <Divider style={{ gridArea: "divider" }} />
            {/* <Calendar fullWidth purchasable events={relevantEvents(props.appointments, props.consults, props.user)} /> */}
            <CalendarContainer fullWidth>
                <BigCalendar
                    components={{ event: PurchasableEvent }}
                    startAccessor={event => new Date(event.start_time)}
                    endAccessor={event => new Date(event.end_time)}
                    selectable
                    localizer={localizer}
                    events={relevantEvents(props.appointments, props.consults, props.user)}
                    defaultView={props.defaultCalendarView}
                    popup
                    step={15}
                    timeslots={1}
                    onSelecting={() => false}
                />
            </CalendarContainer>
        </FullWidthCalendarContainer>
    )
}

const mapStateToProps = (state) => ({
    appointments: state.appointments,
    consults: state.consults,
    user: state.user,
    personalEvents: state.personalEvents,
    defaultCalendarView: state.defaultCalendarView

})

export default connect(mapStateToProps)(Appointments)
