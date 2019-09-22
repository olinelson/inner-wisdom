import React, { useState, useEffect } from 'react'
import { Container, Divider, Button, Modal, Form, Header, Message as StaticMessage, Loader } from 'semantic-ui-react'
import styled from "styled-components"
import { CalendarContainer, ModalContent } from "./StyledComponents"
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from "moment"
import Event from "./Event"
import Message from "./Message"

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
        display: grid !Important;
        grid-template-columns: 1fr;
        grid-template-areas: "heading" "divider" "panel";a
        justify-content: center ;
    `

const uuidv1 = require('uuid/v1')

function Appointments(props) {
    const localizer = momentLocalizer(moment)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [eventModalOpen, setEventModalOpen] = useState(false)
    const [booking, setBooking] = useState(false)

    const [loading, setLoading] = useState(true)
    const [canceling, setCanceling] = useState(false)
    const [confirmation, setConfirmation] = useState(null)
    const [events, setEvents] = useState([])
    const [notifications, setNotifications] = useState([])

    const csrfToken = document.querySelectorAll('meta[name="csrf-token"]')[0].content

    useEffect(() => {
        if (props.current_user) {
            getPrivateEvents()
        } else {
            getPublicEvents()
        }
    }, []);


    useEffect(() => {
        const timer = setTimeout(() => {
            if (notifications === []) return () => clearTimeout(timer)
            if (notifications.length > 1) {
                let newVal = [...notifications]
                newVal.pop()
                setNotifications(newVal)
            }
            else if (notifications.length === 1) {
                setNotifications([])
            }
            else {
                return () => clearTimeout(timer)
            }

        }, 5000);
        return () => clearTimeout(timer);
    }, [notifications]);

    const getPrivateEvents = () => {
        fetch(`${process.env.BASE_URL}/events/current_user`, {
            headers: {
                "X-CSRF-Token": csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(r => r.json())
            .catch(error => {
                setNotifications([{ id: new Date, type: "alert", message: "Could not get events. Please refresh the page and try again. If this problem persists please contact your system administrator." }, ...notifications])
                console.error('Error:', error)
                setLoading(false)
            })
            .then(r => {
                setEvents(r.events)
                setLoading(false)
            })
    }

    const getPublicEvents = () => {
        fetch(`${process.env.BASE_URL}/events/public`, {
            headers: {
                "X-CSRF-Token": csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        }).then(r => r.json())
            .catch(error => {
                setNotifications([{ id: new Date, type: "alert", message: "Could not get events. Please refresh the page and try again. If this problem persists please contact your system administrator." }, ...notifications])
                console.error('Error:', error)
            })
            .then(r => {
                setEvents(r.appointments.concat(r.consults))
                setLoading(false)
            })
    }

    // fetch handelers
    const bookAppointment = () => {
        setBooking(true)
        fetch(`${process.env.BASE_URL}/events/book`, {
            method: "POST",
            body: JSON.stringify({
                event: selectedEvent,
            }),
            headers: {
                "X-CSRF-Token": csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(res => res.json())
            .catch(error => {
                setNotifications([{ id: new Date, type: "alert", message: "Could not book appointment. Please refresh the page and try again. If this problem persists please contact your system administrator." }, ...notifications])
                console.error('Error:', error)
                setBooking(false)
                setEventModalOpen(false)
                setSelectedEvent(null)
            })
            .then(res => {

                let currentEvents = [...events].filter(e => e.id !== res.editedEvent.id)
                setEvents(currentEvents.concat(res.editedEvent))
                setBooking(false)
                setEventModalOpen(false)
                setConfirmation({ type: "booking", event: res.editedEvent })
                setNotifications([{ id: new Date, type: "notice", message: "Appointment successfully booked!" }, ...notifications])
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

        fetch(`${baseUrl}/events/cancel`, {
            method: "POST",
            body: JSON.stringify({
                inGracePeriod,
                event: selectedEvent
            }),
            headers: {
                "X-CSRF-Token": csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(response => response.json())
            .catch(error => {
                setNotifications([{ id: new Date, type: "alert", message: "Could not cancel this event. Please try again. If this problem persists please contact your system administrator." }, ...notifications])
                console.error('Error:', error)
                setEventModalOpen(false)
                setCanceling(false)
            })
            .then((res) => {
                let currentEvents = [...events].filter(e => e.id !== res.editedEvent.id)
                setEvents(currentEvents.concat(res.editedEvent))
                setEventModalOpen(false)
                setCanceling(false)
                setConfirmation({ type: "cancelation", event: { ...res.editedEvent } })
                setNotifications([{ id: new Date, type: "warning", message: "Appointment successully canceled" }, ...notifications])
            })
            .then(() => setSelectedEvent(null))
    }

    const showPrettyStartAndEndTime = (selectedEvent) => {

        return <>
            <Header textAlign="center" as='h2' >
                {moment(selectedEvent.start_time).format('Do MMMM  YYYY')}
                <Header.Subheader>
                    {moment(selectedEvent.start_time).format('h:mm a')} to {moment(selectedEvent.end_time).format('h:mm a')}
                </Header.Subheader>
            </Header>
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
        if (!props.current_user) return <>
            <Modal
                open={eventModalOpen}
                header={selectedEvent.title}
                content={<ModalContent>

                    <StaticMessage
                        warning
                        header={showPrettyStartAndEndTime(selectedEvent)}
                        content={<p>To book an appointment you must first <a href={`${process.env.BASE_URL}/users/sign_in`}>sign in</a>. If you do not have an account yet you can <a href={`${process.env.BASE_URL}/users/sign_up`}>sign up</a> for free.</p>}
                    />

                </ModalContent>
                }
                actions={[{ key: "Close", content: "Close", onClick: () => setEventModalOpen(false) }]}
            />
        </>

        // logged in and attended
        if (props.current_user && isUserAnAttendeeOfEvent(selectedEvent, props.current_user)) return <Modal
            open={eventModalOpen}
            header={selectedEvent.title}
            content={<ModalContent>{showPrettyStartAndEndTime(selectedEvent)}
                <p>{selectedEvent.location}</p>
            </ModalContent>}
            actions={[maybeShowCancelButtons(selectedEvent), { key: "Close", content: "Close", onClick: () => setEventModalOpen(false) }]}
        />

        // logged in and not attending - bookable
        if (props.current_user) return <Modal
            open={eventModalOpen}
            header={selectedEvent.title}
            content={<ModalContent>
                {showPrettyStartAndEndTime(selectedEvent)}
                {selectedEvent.calendar.id === process.env.CONSULTS_CALENDAR_ID ?
                    <>
                        <p>Would you like to book a <b>free</b> phone call consultation at this time?</p>
                        <p>After this consultation you will be able to reserve in-person and skype appointments.</p>
                    </>
                    :
                    <>
                        <p>Would you like to book an appointment at this time?</p>
                        <p>If this is intended to be a skype appointment, check the toggle below.</p>

                        <Form >
                            <Form.Group inline >
                                <Form.Radio
                                    label='Skype'
                                    name='radioGroup'
                                    value='that'
                                    checked={selectedEvent.extended_properties.private.skype === "true"}
                                    onChange={() => toggleSkypeHandeler()}
                                />
                                {" "}
                                <Form.Radio
                                    label='In Person'
                                    name='radioGroup'
                                    value='that'
                                    checked={selectedEvent.extended_properties.private.skype === "false"}
                                    onChange={() => toggleSkypeHandeler()}
                                />
                            </Form.Group>
                        </Form>
                    </>
                }
                <Divider hidden />
                <p>Note that appointments canceled with less than 24 hours notice must be paid in full.</p>
            </ModalContent>}
            actions={[{ key: "book", disabled: isSelectedEventInThePast(), loading: booking, content: "Book Appointment", onClick: () => bookAppointment() }, { key: "Close", content: "Close", onClick: () => setEventModalOpen(false) }]}
        />
    }

    const isSelectedEventInThePast = () => {
        if (new Date(selectedEvent.start_time) > new Date) return false
        return true
    }


    const toggleSkypeHandeler = () => {
        let skype = selectedEvent.extended_properties.private.skype
        if (skype === "true") skype = "false"
        else skype = "true"
        let newExtendedProperties = { ...selectedEvent.extended_properties.private, skype }
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
        {/* <Container fluid>
            <Message key={uuidv1()} message={{
                id: new Date, type: "notice", message: <>
                    <p>To book an appointment you must first <a href={`${process.env.BASE_URL}/users/sign_up`}>sign in</a>. If you do not have an account yet you can <a href={`${process.env.BASE_URL}/users/sign_up`}>sign up</a> for free.</p>


                </>
            }} />
        </Container> */}

        <div style={{ position: "fixed", right: "1rem", zIndex: "100" }}>
            {!props.current_user ?
                <Message key={uuidv1()} message={{
                    id: new Date, type: "notice", message: <>
                        <p>To book an appointment you must first <a href={`${process.env.BASE_URL}/users/sign_in`}>sign in</a>. If you do not have an account yet you can <a href={`${process.env.BASE_URL}/users/sign_up`}>sign up</a> for free.</p>


                    </>
                }} />
                :
                null}

            {notifications.map(n => <Message key={uuidv1()} message={n} />)}
        </div>

        <FullWidthCalendarContainer fluid>
            <div style={{ width: "100%", maxWidth: "95vw", justifySelf: "center" }}>
                <h1>Appointments</h1>
                <p>To make a booking click on an appointment in the calendar below.</p>
                {props.current_user && props.current_user.approved === false ?
                    <p>Please choose a suitable time for your free 15 minute phone consultation. After your phone consultation is complete and you think Inner Wisdom is a good fit for you, you will be able to book full length Skype and in-person appointments.</p>
                    : null
                }
            </div>
            <Divider hidden style={{ gridArea: "divider" }} />
            {/* <Calendar fullWidth purchasable events={relevantEvents(props.appointments, props.consults, props.user)} /> */}
            <CalendarContainer fullWidth>
                {loading ?
                    <Loader inline="centered" active />
                    :
                    <BigCalendar
                        components={{ event: Event }}
                        startAccessor={event => new Date(event.start_time)}
                        endAccessor={event => new Date(event.end_time)}
                        selectable
                        localizer={localizer}
                        events={events}
                        // defaultView={props.defaultCalendarView}
                        onSelectEvent={(e) => selectEventHandeler(e)}
                        popup
                        step={15}
                        timeslots={1}
                        onSelecting={() => false}
                        views={['month', 'day', 'week']}
                    />
                }

            </CalendarContainer>

        </FullWidthCalendarContainer>
        {showSelectedEventModal()}
        {showConfirmationModal()}
    </>

}

// const mapStateToProps = (state) => ({
//     appointments: state.appointments,
//     consults: state.consults,
//     user: state.user,
//     personalEvents: state.personalEvents,
//     defaultCalendarView: state.defaultCalendarView,
//     csrfToken: state.csrfToken

// })

export default Appointments
