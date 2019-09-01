import React, { useState } from 'react'
import { Container, Divider, Label, Button, Modal, Checkbox } from 'semantic-ui-react'
import { connect } from 'react-redux';
import styled from "styled-components"
import { CalendarContainer, ModalContent } from "./StyledComponents"
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from "moment"
import Event from "./Event"

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
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [eventModalOpen, setEventModalOpen] = useState(false)
    const [booking, setBooking] = useState(false)
    // const [creating, setCreating] = useState(false)
    const [canceling, setCanceling] = useState(false)
    const [confirmation, setConfirmation] = useState(null)

    // fetch handelers
    const bookAppointment = () => {
        setBooking(true)
        fetch(`${process.env.BASE_URL}/purchase`, {
            method: "POST",
            body: JSON.stringify({
                event: selectedEvent,
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
            .then(res => {
                props.dispatch({ type: "SET_PERSONAL_AND_BUSINESS_EVENTS", value: res })
                props.dispatch({ type: "SET_NOTIFICATIONS", value: [{ id: selectedEvent.id, type: "notice", message: "Appointment Booked" }] })
                setBooking(false)
                setEventModalOpen(false)
                setConfirmation({ type: "booking", event: res.bookedEvent })
            })
            .then(() => setSelectedEvent(null))


    }
    const cancelEvent = () => {
        setCanceling(true)
        let currentTime = new Date
        let eventTime = new Date(selectedEvent.start_time)
        let hours = (eventTime.getTime() - currentTime.getTime()) / 3600000;
        const inGracePeriod = hours > 24

        let baseUrl = process.env.BASE_URL

        let newTitle = "*Canceled " + event.title
        let editedEvent = { ...event, title: newTitle }

        fetch(`${baseUrl}/cancel`, {
            method: "POST",
            body: JSON.stringify({
                inGracePeriod,
                event: selectedEvent
            }),
            headers: {
                "X-CSRF-Token": props.csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(response => response.json())
            .then((res) => props.dispatch({ type: "SET_PERSONAL_AND_BUSINESS_EVENTS", value: res }))
            .then(() => {
                setConfirmation({ type: "cancelation", event: { ...selectedEvent } })
                setEventModalOpen(false)
                setCanceling(false)
            })
            .then(() => setSelectedEvent(null))
    }

    const showPrettyStartAndEndTime = (selectedEvent) => {

        return <>
            <h4>{moment(selectedEvent.start_time).format('Do MMMM  YYYY')}</h4>
            <p>{moment(selectedEvent.start_time).format('h:mm a')} to {moment(selectedEvent.end_time).format('h:mm a')}</p>
        </>
    }

    const cancelEventConfirm = (event) => {
        let currentTime = new Date
        let eventTime = new Date(event.start_time)
        let hours = (eventTime.getTime() - currentTime.getTime()) / 3600000;
        const inGracePeriod = hours > 24

        return <Modal
            key={event.id}
            basic
            size="small"
            trigger={<Button loading={canceling} content="Cancel Appointment" />}
            header="Cancel Event"
            content={
                <ModalContent>
                    {inGracePeriod ?
                        <p>Are you sure you want to cancel this appointment? As this is more than 24 hours notice you won't be charged.</p>
                        :
                        <p>Are you sure you want to cancel this appointment? As this is less than 24 hours notice you will be charged in full.</p>}
                </ModalContent>
            }
            actions={[{ key: "nevermind", content: "Never Mind", positive: true, basic: true }, { key: "cancelEvent", basic: true, negative: true, content: "Yes, Cancel Appointment", onClick: () => cancelEvent() }]}
        />

    }

    const maybeShowCancelButtons = (event) => {
        if (event.extended_properties && event.extended_properties.private && event.extended_properties.private.cancelation === "true") {
            return null
        }
        if (isInTheFuture(event)) return cancelEventConfirm(event)

        return null
    }

    const showSelectedEventModal = () => {
        if (!selectedEvent) return null

        // anonymous event view
        if (!props.user) return <Modal
            open={eventModalOpen}
            header={selectedEvent.title}
            content={<ModalContent>{showPrettyStartAndEndTime(selectedEvent)}</ModalContent>}
            actions={[{ key: "sign in", content: "Sign In", onClick: () => window.open(`${process.env.BASE_URL}/users/sign_in`, "_self") }, { key: "Close", content: "Close", onClick: () => setEventModalOpen(false) }]}
        />

        // logged in and attended
        if (props.user && isUserAnAttendeeOfEvent(selectedEvent, props.user)) return <Modal
            open={eventModalOpen}
            header={selectedEvent.title}
            content={<ModalContent>{showPrettyStartAndEndTime(selectedEvent)}
                <p>{selectedEvent.location}</p>
            </ModalContent>}
            actions={[maybeShowCancelButtons(selectedEvent), { key: "Close", content: "Close", onClick: () => setEventModalOpen(false) }]}
        />

        // logged in and not attending - bookable
        if (props.user) return <Modal
            open={eventModalOpen}
            header={selectedEvent.title}
            content={<ModalContent>
                {showPrettyStartAndEndTime(selectedEvent)}
                <Checkbox
                    checked={selectedEvent.extended_properties && selectedEvent.extended_properties.private.skype ? true : false}
                    onChange={(e) => toggleSkypeHandeler(e)}
                    label="Skype Appointment"
                    toggle />
            </ModalContent>}
            actions={[{ key: "book", loading: booking, content: "Book Appointment", onClick: () => bookAppointment() }, { key: "Close", content: "Close", onClick: () => setEventModalOpen(false) }]}
        />
    }

    const toggleSkypeHandeler = () => {

        let newExtendedProperties = { ...selectedEvent.extended_properties.private, skype: !selectedEvent.extended_properties.private.skype || false }
        setSelectedEvent({ ...selectedEvent, extended_properties: { private: newExtendedProperties } })
    }

    const showConfirmationModal = () => {
        if (confirmation) {
            if (confirmation.type === "booking") return <Modal
                defaultOpen
                onClose={() => setConfirmation(null)}
                header="Appointment Confirmed"
                content={<ModalContent>
                    <p>This is confirmation that your booking has been confirmed. Here are the details. You will receive an email confirmation.</p>
                    {showPrettyStartAndEndTime(confirmation.event)}
                    {console.log(confirmation)}
                    <p>{confirmation.event.location}</p>
                </ModalContent>}
                actions={["Close"]}
            />

            if (confirmation.type === "cancelation") return <Modal
                defaultOpen
                onClose={() => setConfirmation(null)}
                header="Appointment Canceled"
                content={<ModalContent>
                    <p>This is confirmation that your appointment has been canceled. Here are the details. You will receive an email confirmation.</p>
                    {showPrettyStartAndEndTime(confirmation.event)}
                    <p>{confirmation.event.location}</p>
                </ModalContent>}
                actions={["Close"]}
            />


        } else return null



    }

    const selectEventHandeler = (event) => {
        setSelectedEvent(event)
        setEventModalOpen(true)
    }

    return <>
        <FullWidthCalendarContainer fluid>
            <div style={{ width: "100%", maxWidth: "95vw", justifySelf: "center" }}>
                <h1>Appointments</h1>
            </div>
            <Divider style={{ gridArea: "divider" }} />
            {/* <Calendar fullWidth purchasable events={relevantEvents(props.appointments, props.consults, props.user)} /> */}
            <CalendarContainer fullWidth>
                <BigCalendar
                    components={{ event: Event }}
                    startAccessor={event => new Date(event.start_time)}
                    endAccessor={event => new Date(event.end_time)}
                    selectable
                    localizer={localizer}
                    events={relevantEvents(props.appointments, props.consults, props.user)}
                    defaultView={props.defaultCalendarView}
                    onSelectEvent={(e) => selectEventHandeler(e)}
                    popup
                    step={15}
                    timeslots={1}
                    onSelecting={() => false}
                />
            </CalendarContainer>

        </FullWidthCalendarContainer>
        {showSelectedEventModal()}
        {showConfirmationModal()}
    </>

}

const mapStateToProps = (state) => ({
    appointments: state.appointments,
    consults: state.consults,
    user: state.user,
    personalEvents: state.personalEvents,
    defaultCalendarView: state.defaultCalendarView,
    csrfToken: state.csrfToken

})

export default connect(mapStateToProps)(Appointments)
