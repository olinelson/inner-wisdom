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

export const relevantEvents = (appointments, consults, user) => {
    let result = []

    // if (!appointments) return result

    let freeAppointments = appointments.filter(e => e.attendees == null || e.attendees.length < 1)
    let freeConsults = consults.filter(e => e.attendees == null || e.attendees.length < 1)


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

    const userComponents = () => {
        // if (props.user) return { event: PurchasableEvent }
        return { event: PurchasableEvent }

        // return { event: ReadOnlyEvent }
    }


    return (
        <FullWidthCalendarContainer fluid>
            <div style={{ width: "100%", maxWidth: "95vw", justifySelf: "center" }}>
                <h1>Appointments</h1>
                {/* <Label circular color={"blue"} content="My Appointments" /> */}
                {/* <Label circular color={"green"} content="Personal" /> */}
                {/* <Label circular color={"grey"} content="Bookable" /> */}
            </div>
            <Divider style={{ gridArea: "divider" }} />
            {/* <Calendar fullWidth purchasable events={relevantEvents(props.appointments, props.consults, props.user)} /> */}
            <CalendarContainer fullWidth>
                <BigCalendar
                    components={userComponents()}
                    startAccessor={event => new Date(event.start_time)}
                    endAccessor={event => new Date(event.end_time)}
                    selectable
                    localizer={localizer}
                    // events={props.events}
                    // events={this.props.allEvents}
                    events={relevantEvents(props.appointments, props.consults, props.user)}
                    // onView={changeDefaultViewHandeler}
                    defaultView={props.defaultCalendarView}
                    // scrollToTime={props.calendarScrollToTime}
                    // defaultDate={props.calendarScrollToTime}
                    popup
                    step={15}
                    timeslots={1}
                // onSelectSlot={this.selectSlotHandeler}
                // min={new Date(2050, 1, 1, 9)}
                // max={new Date(2050, 1, 1, 22)}
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
