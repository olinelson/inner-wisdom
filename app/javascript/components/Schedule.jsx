import React, { useState } from 'react'
import { connect } from 'react-redux';

// components / styles
import { Divider, Modal, Popup, Button, Input, Label, Icon, Segment, Header, Dropdown, Checkbox, Form } from 'semantic-ui-react'
import { BusinessEventSegment, CenteredFlexDiv, CalendarContainer, MondalContent } from "./StyledComponents"
import { FullWidthCalendarContainer } from "./Appointments"
import Event from "./Event"
import UserPickerDropDown from './UserPickerDropDown';


// packages
import moment from "moment"
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import TimePicker from 'rc-time-picker';
import "rc-time-picker/assets/index.css"
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar'


const localizer = momentLocalizer(moment)

const repeatOptions = [
    { key: 'norepeat', value: null, text: 'no repeat' },
    { key: 'daily', value: 'daily', text: 'daily' },
    { key: 'weekly', value: 'weekly', text: 'weekly' },
    { key: 'monthly', value: 'monthly', text: 'monthly' },
    { key: 'yearly', value: 'yearly', text: 'yearly' },
]

function Schedule(props) {
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [selectedSlot, setSelectedSlot] = useState(null)
    const [loading, setLoading] = useState(false)

    // fetch handelers
    const createEventHandeler = (isAppointmentSlot, isConsultSlot) => {
        setLoading(true)
        let event = { ...selectedSlot }

        fetch(`${process.env.BASE_URL}/create`, {
            method: "POST",
            body: JSON.stringify({
                event: event,
                appointmentSlot: isAppointmentSlot,
                consultSlot: isConsultSlot,
            }),
            headers: {
                "X-CSRF-Token": props.csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(response => response.json())
            .then(res => props.dispatch({ type: "SET_PERSONAL_AND_BUSINESS_EVENTS", value: res }))
            .then(res => {
                setSelectedSlot(null)
                setLoading(false)
            })
    }

    const updateSelectedEventHandeler = () => {
        setLoading(true)
        fetch(`${process.env.BASE_URL}/update`, {
            method: "POST",
            body: JSON.stringify({
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
                setSelectedEvent(null)
                setLoading(false)
            })
    }

    const deleteSelectedEventHandeler = () => {
        setLoading(true)
        fetch(`${process.env.BASE_URL}/delete`, {
            method: "DELETE",
            body: JSON.stringify({
                event: selectedEvent
            }),
            headers: {
                "X-CSRF-Token": props.csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(res => res.json())
            .then((res) => {
                props.dispatch({ type: "SET_PERSONAL_AND_BUSINESS_EVENTS", value: res })
                setLoading(false)
                setSelectedEvent(null)
            })
    }

    // attendee helper methods
    const addAttendeeToEvent = (user, event, setStateAction) => {
        let attendees = event.attendees
        if (attendees == null) setStateAction({ ...event, attendees: [user] })
        else setStateAction({ ...event, attendees: [...event.attendees, user] })
    }

    const removeAttendeeFromEvent = (user, event, setStateAction) => {
        let attendees = event.attendees.filter(a => a.email !== user.email)
        setStateAction({ ...event, attendees })
    }

    const showEventAttendees = (event, onDelete, setStateAction) => {
        if (event && event.attendees) {
            let users = event.attendees
            return users.map(u => <Label key={u.email} style={{ margin: ".1rem" }}>
                <Icon name='user' />
                {u.first_name ? u.first_name + " " + u.last_name : u.displayName}
                <Icon name='delete' onClick={() => onDelete(u, event, setStateAction)} />
            </Label>
            )
        }
        return null
    }


    // time setting components
    const changeDayHandeler = (dt, event, setStateAction) => {
        let dateTime = new Date(dt)
        let newMonth = dateTime.getMonth()
        let newDay = dateTime.getDate()

        let start_time = new Date(event.start_time)
        start_time.setMonth(newMonth)
        start_time.setDate(newDay)

        let end_time = new Date(event.end_time)
        end_time.setMonth(newMonth)
        end_time.setDate(newDay)
        setStateAction({ ...event, start_time, end_time })
    }

    const eventTimeSetter = (event, setStateAction) => {
        let startTime = moment(event.start_time)
        let endTime = moment(event.end_time)

        let startTimeOptions = [startTime]
        let endTimeOptions = [endTime]

        for (let i = 0; i < 22; i++) {
            let addEndTime = moment(endTimeOptions[endTimeOptions.length - 1]).add(30, 'm')
            let subEndTime = moment(endTimeOptions[0]).subtract(30, 'm')

            let addStartTime = moment(startTimeOptions[startTimeOptions.length - 1]).add(30, 'm')
            let subStartTime = moment(startTimeOptions[0]).subtract(30, 'm')

            startTimeOptions = [subStartTime, ...startTimeOptions, addStartTime]
            endTimeOptions = [subEndTime, ...endTimeOptions, addEndTime]
        }

        const now = moment().hour(0).minute(0)

        return <>

            <Popup
                on="click"
                content={
                    <DayPicker
                        onDayClick={(dt) => changeDayHandeler(dt, event, setStateAction)}
                        selectedDays={new Date(event.start_time)}
                    />
                }
                trigger={
                    <h4 style={{ textAlign: "center", cursor: "pointer" }}>{moment(event.start_time).format('Do MMMM  YYYY')}<Icon name="caret down" /></h4>
                }
            />
            <span>
                <TimePicker
                    showSecond={false}
                    value={startTime}
                    onChange={(e) => setStateAction({ ...event, start_time: e._d })}
                    format='h:mm a'
                    use12Hours
                    inputReadOnly
                />
                <TimePicker
                    showSecond={false}
                    value={endTime}
                    onChange={(e) => setStateAction({ ...event, end_time: e._d })}
                    format='h:mm a'
                    use12Hours
                    inputReadOnly
                />
            </span>
        </>
    }

    // creating event helpers
    const selectSlotHandeler = (e) => {
        if (props.user.admin) setSelectedSlot({ ...e, title: "", location: "", start_time: e.start, end_time: e.end, personal: false })
    }

    const personalOrBusinessToggle = () => {
        let e = selectedSlot
        if (!e || !props.user.google_calendar_email || props.user.google_calendar_email.length < 1) return null

        let label = null
        if (e.personal) {
            label = <Label color="green">Personal</Label>

        } else {
            label = <Label color="blue">Business</Label>
        }


        return <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>

            {label}
            <Checkbox onChange={() => setSelectedSlot({ ...selectedSlot, personal: !selectedSlot.personal })} toggle />
        </div>
    }

    // modal options
    const creatingPersonalEventOptions = (e) => {
        if (e && e.personal) return <Segment textAlign="center" placeholder>
            {eventTimeSetter(selectedSlot, setSelectedSlot)}
            <Divider hidden />
            <Form>
                <Form.Field>
                    <label>Title</label>
                    <Input
                        placeholder='New Event Name' value={selectedSlot.title || ""}
                        onChange={(e) => setSelectedSlot({ ...selectedSlot, title: e.target.value })}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Location</label>
                    <Input
                        value={selectedSlot.location || ""}
                        onChange={(e) => setSelectedSlot({ ...selectedSlot, location: e.target.value })}
                        placeholder='42 Wallaby Way Sydney'
                    />
                </Form.Field>
                <Button loading={loading} color="green" onClick={() => createEventHandeler(false)} type="submit">Create</Button>
            </Form>
        </Segment>
    }

    const creatingBusinessEventOptions = (e) => {



        if (e && e.personal === false) return <BusinessEventSegment>
            <Dropdown onChange={(e, d) => setSelectedSlot({ ...selectedSlot, recurrence: { freq: d.value } })} defaultValue={null} placeholder='No Repeat' options={repeatOptions} />
            <div style={{ gridArea: "timePicker" }}>
                {eventTimeSetter(selectedSlot, setSelectedSlot)}
            </div>
            <CenteredFlexDiv style={{ gridArea: "newAppointment" }} >
                <Header icon>
                    <Icon name='bookmark' />
                    Book New Appointment
                             </Header>
                <Popup content='This will create a confirmed appointment slot that will only be visible to admin and its attendees.' trigger={<Button loading={loading} primary onClick={() => createEventHandeler(false)}>Create</Button>} />
                <Divider hidden />

                <div>
                    {showEventAttendees(e, removeAttendeeFromEvent, setSelectedSlot)}
                </div>

                <Divider hidden />
                <UserPickerDropDown event={e} addAttendeeHandeler={(u) => addAttendeeToEvent(u, selectedSlot, setSelectedSlot)} />
            </CenteredFlexDiv>

            <CenteredFlexDiv style={{ gridArea: "newAppSlot" }}>
                <Header icon>
                    <Icon name='time' />
                    New Appointment Slot
                    </Header>
                <Popup content='This will create a "bookable" appointment slot visable to all clients.' trigger={<Button loading={loading} color="grey" onClick={() => createEventHandeler(true)} >Create</Button>} />


            </CenteredFlexDiv>
            <CenteredFlexDiv style={{ gridArea: "newConsultSlot" }}>
                <Header icon>
                    <Icon name='time' />
                    New Consultation Slot
                    </Header>
                <Popup content='This will create a "bookable" consultation slot visable to all clients.' trigger={<Button loading={loading} color="yellow" onClick={() => createEventHandeler(false, true)} >Create</Button>} />
            </CenteredFlexDiv>

        </BusinessEventSegment>
    }

    // modals
    const editingEventModal = () => {
        let e = selectedEvent
        if (!e) return null
        return <Modal
            open={selectedEvent ? true : false}
            onClose={() => setSelectedEvent(null)}
        >
            <Modal.Header><Input value={e.title} onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })} /></Modal.Header>
            <Modal.Content >
                {props.user.google_calendar_email && props.user.google_calendar_email === e.calendar.id ? null :
                    <p>Business Event Options</p>
                }
                <Dropdown onChange={(e, d) => setSelectedEvent({ ...selectedEvent, recurrence: { freq: d.value } })} defaultValue={null} placeholder='No Repeat' options={repeatOptions} />
                {eventTimeSetter(selectedEvent, setSelectedEvent)}
                <div>
                    {showEventAttendees(e, removeAttendeeFromEvent, setSelectedEvent)}
                </div>
                <UserPickerDropDown event={e} addAttendeeHandeler={(u) => addAttendeeToEvent(u, selectedEvent, setSelectedEvent)} />
            </Modal.Content>
            <Modal.Actions>
                <Button loading={loading} onClick={() => updateSelectedEventHandeler()}>Save</Button>
                <Button loading={loading} onClick={() => deleteSelectedEventHandeler()}>Delete</Button>
            </Modal.Actions>
        </Modal >
    }

    const creatingEventModal = () => {
        let e = selectedSlot
        return <Modal
            open={selectedSlot ? true : false}
            onClose={() => setSelectedSlot(null)}
        >
            <Modal.Header>Create Event</Modal.Header>
            <Modal.Content >
                {personalOrBusinessToggle(e)}

                {creatingBusinessEventOptions(e)}

                {creatingPersonalEventOptions(e)}

            </Modal.Content>

        </Modal >
    }

    return <>

        <FullWidthCalendarContainer fluid >
            <div style={{ width: "100%", maxWidth: "95vw", justifySelf: "center" }}>
                <h1>Schedule</h1>
            </div>

            <Divider style={{ gridArea: "divider" }} />
            <CalendarContainer fullWidth>
                <BigCalendar
                    components={{ event: Event }}
                    startAccessor={event => new Date(event.start_time)}
                    endAccessor={event => new Date(event.end_time)}
                    selectable
                    localizer={localizer}
                    onSelectEvent={(e) => setSelectedEvent(e)}
                    events={props.allEvents}
                    defaultView={props.defaultCalendarView}
                    defaultDate={new Date}
                    popup
                    step={15}
                    timeslots={1}
                    onSelectSlot={(e) => selectSlotHandeler(e)}
                />
            </CalendarContainer>
        </FullWidthCalendarContainer>

        {creatingEventModal()}
        {editingEventModal()}

    </>
}


function flatten(arr) {
    return [].concat(...arr)
}


const mapStateToProps = (state) => ({
    appointments: state.appointments,
    consults: state.consults,
    personalEvents: state.personalEvents,
    allEvents: flatten([...state.appointments, state.consults, state.personalEvents]),
    user: state.user,
    users: state.users,
    csrfToken: state.csrfToken,
    baseUrl: state.baseUrl,
    businessCalendarAddress: state.businessCalendarAddress,
    defaultCalendarView: state.defaultCalendarView
})

export default connect(mapStateToProps)(Schedule)

