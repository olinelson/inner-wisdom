import React, { Component } from 'react'
import { Container, Divider, Modal, Popup, Select, Button, Label, Icon, Segment, Grid, Header, Dropdown, Checkbox, Form } from 'semantic-ui-react'
import Calendar from './Calendar';
import { connect } from 'react-redux';
import styled from "styled-components"
import moment from "moment"
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import TimePicker from 'rc-time-picker';
import Event from "./Event"
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar'

import { BusinessEventSegment, CenteredFlexDiv, CalendarContainer } from "./StyledComponents"

import { FullWidthCalendarContainer } from "./Appointments"
import UserPickerDropDown from './UserPickerDropDown';
const localizer = momentLocalizer(moment)
const AdminComponents = {
    event: Event // used by each view (Month, Day, Week)
}
// let PurchasableComponents = {
//     event: PurchasableEvent
// }
// let ReadOnlyComponents = {
//     event: ReadOnlyEvent

// }

class Schedule extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selectedEvent: null,
            selectedSlot: null,
            showCheckout: false,
            dialogOpen: false,
            creatingEvent: false,
            newAppointment: null,
            loading: false,
        }
    }

    showPrettyStartAndEndTime = (selectedEvent) => {

        return <>
            <h4>{moment(selectedEvent.start_time).format('Do MMMM  YYYY')}</h4>
            <p>{moment(selectedEvent.start_time).format('h:mm a')} to {moment(selectedEvent.end).format('h:mm a')}</p>
        </>
    }


    showEventAttendees = (event, onDelete) => {
        if (event && event.attendees) {
            let users = event.attendees
            return users.map(u => <Label style={{ margin: ".1rem" }} key={u.id}>
                <Icon name='user' />
                {u.first_name + " " + u.last_name}
                <Icon name='delete' onClick={() => onDelete(u)} />
            </Label>
            )
        }
        return null
    }


    addAttendeeToSelectedEvent = (user) => {
        let attendees = this.state.selectedEvent.attendees
        if (attendees == null) this.setState({ selectedEvent: { ...this.state.selectedEvent, attendees: [user] } })
        else this.setState({ selectedEvent: { ...this.state.selectedEvent, attendees: [...this.state.selectedEvent.attendees, user] } })
    }

    removeAttendeeFromSelectedEvent = (user) => {
        let attendees = this.state.selectedEvent.attendees.filter(a => a.id !== user.id)
        this.setState({ selectedEvent: { ...this.state.selectedEvent, attendees } })
    }


    // =====================================

    createEventHandeler = (isAppointmentSlot, isConsultSlot) => {
        // let placeholder = { ...this.state.selectedEvent, placeholder: true }
        // this.props.dispatch({ type: "ADD_APPOINTMENT", value: placeholder })
        this.setState({ loading: true })
        let event = { ...this.state.selectedEvent }

        fetch(`${process.env.BASE_URL}/create`, {
            method: "POST",
            body: JSON.stringify({
                event: event,
                appointmentSlot: isAppointmentSlot,
                consultSlot: isConsultSlot,
            }),
            headers: {
                "X-CSRF-Token": this.props.csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(response => response.json())
            .then(res => this.props.dispatch({ type: "SET_PERSONAL_AND_BUSINESS_EVENTS", value: res }))
            .then(res => this.setState({ creatingEvent: false, loading: false }))


    }

    eventClickHandeler = (event) => {

        this.setState({ selectedEvent: event, dialogOpen: true })
    }

    selectSlotHandeler = (e) => {
        if (this.props.user.admin) this.setState({ creatingEvent: true, selectedSlot: { ...e, title: "", location: "", start_time: e.start, end_time: e.end, personal: false } })

    }

    changeDayHandeler = (dt) => {
        let event = this.state.creatingEvent

        let dateTime = new Date(dt)
        let newMonth = dateTime.getMonth()
        let newDay = dateTime.getDate()

        let start_time = new Date(event.start_time)
        start_time.setMonth(newMonth)
        start_time.setDate(newDay)

        let end_time = new Date(event.end_time)
        end_time.setMonth(newMonth)
        end_time.setDate(newDay)

        this.setState({ creatingEvent: { ...this.state.creatingEvent, start_time, end_time } })
    }

    changeTitleHandeler = (e) => {
        this.setState({ creatingEvent: { ...this.state.creatingEvent, title: e.target.value } })
    }

    eventTimeSetter = () => {
        let event = this.state.creatingEvent

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

        let formattedendEndTimeOptions = endTimeOptions.map(op => {
            return {
                key: op._d,
                text: moment(op._d).format("h:mm a"),
                value: op._d.toString(),
            }
        })

        let formattedendStartTimeOptions = startTimeOptions.map(op => {
            return {
                key: op._d,
                text: moment(op._d).format("h:mm a"),
                value: op._d.toString(),
            }
        })

        const now = moment().hour(0).minute(0)


        return <>

            <Popup
                on="click"
                content={<DayPicker
                    onDayClick={this.changeDayHandeler}
                    selectedDays={new Date(event.start_time)}
                />}
                trigger={<h4 style={{ textAlign: "center", cursor: "pointer" }}>{moment(event.start_time).format('Do MMMM  YYYY')}<Icon name="caret down" /></h4>} />

            <span>
                <TimePicker
                    showSecond={false}
                    value={startTime}
                    onChange={(e) => this.setState({ creatingEvent: { ...this.state.creatingEvent, start_time: e._d } })}
                    format='h:mm a'
                    use12Hours
                    inputReadOnly
                />
                <TimePicker
                    showSecond={false}
                    value={endTime}
                    onChange={(e) => this.setState({ creatingEvent: { ...this.state.creatingEvent, end_time: e._d } })}
                    format='h:mm a'
                    use12Hours
                    inputReadOnly
                />
            </span>

        </>
    }



    personalOrBusinessToggle = () => {
        let e = this.state.selectedEvent
        if (!e || !this.props.user.google_calendar_email || this.props.user.google_calendar_email.length < 1) return null


        let label = null
        if (e.personal) {
            label = <Label color="green">Personal</Label>

        } else {
            label = <Label color="blue">Business</Label>
        }


        return <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>

            {label}
            <Checkbox onChange={() => this.setState({ selectedEvent: { ...this.state.selectedEvent, personal: !this.state.selectedEvent.personal } })} toggle />
        </div>

    }


    creatingPersonalEventOptions = (e) => {

        if (e && e.personal) return <Segment textAlign="center" placeholder>
            {this.eventTimeSetter()}
            <Divider hidden />
            <Form>
                <Form.Field>
                    <label>Title</label>
                    <input
                        placeholder='New Event Name' value={this.state.selectedEvent.title}
                        onChange={(e) => this.setState({ selectedEvent: { ...this.state.selectedEvent, title: e.target.value } })}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Location</label>
                    <input
                        value={this.state.selectedEvent.location}
                        onChange={(e) => this.setState({ selectedEvent: { ...this.state.selectedEvent, location: e.target.value } })}
                        placeholder='42 Wallaby Way Sydney'
                    />
                </Form.Field>


                <Button loading={this.state.loading} color="green" onClick={() => this.createEventHandeler(false)} type="submit">Create</Button>
            </Form>
        </Segment>
    }



    creatingBusinessEventOptions = (e) => {
        const repeatOptions = [
            { key: 'norepeat', value: null, text: 'no repeat' },
            { key: 'daily', value: 'daily', text: 'daily' },
            { key: 'weekly', value: 'weekly', text: 'weekly' },
            { key: 'monthly', value: 'monthly', text: 'monthly' },
            { key: 'yearly', value: 'yearly', text: 'yearly' },

        ]


        if (e && e.personal === false) return <BusinessEventSegment>


            <Dropdown onChange={(e, d) => this.setState({ creatingEvent: { ...this.state.creatingEvent, recurrence: { freq: d.value } } })} defaultValue={null} placeholder='No Repeat' options={repeatOptions} />

            <div style={{ gridArea: "timePicker" }}>
                {this.eventTimeSetter(e)}
            </div>




            <CenteredFlexDiv style={{ gridArea: "newAppointment" }} >
                <Header icon>
                    <Icon name='bookmark' />
                    Book New Appointment
                             </Header>
                <Popup content='This will create a confirmed appointment slot that will only be visible to admin and its attendees.' trigger={<Button loading={this.state.loading} primary onClick={() => this.createEventHandeler(false)}>Create</Button>} />
                <Divider hidden />

                <div>
                    {this.showEventAttendees(e, this.removeAttendeeFromSelectedEvent)}
                </div>

                <Divider hidden />
                <UserPickerDropDown event={e} addAttendeeHandeler={this.addAttendeeToSelectedEvent} />
            </CenteredFlexDiv>


            <CenteredFlexDiv style={{ gridArea: "newAppSlot" }}>
                <Header icon>
                    <Icon name='time' />
                    New Appointment Slot
                    </Header>
                <Popup content='This will create a "bookable" appointment slot visable to all clients.' trigger={<Button loading={this.state.loading} color="grey" onClick={() => this.createEventHandeler(true)} >Create</Button>} />


            </CenteredFlexDiv>
            <CenteredFlexDiv style={{ gridArea: "newConsultSlot" }}>
                <Header icon>
                    <Icon name='time' />
                    New Consultation Slot
                    </Header>
                <Popup content='This will create a "bookable" consultation slot visable to all clients.' trigger={<Button loading={this.state.loading} color="yellow" onClick={() => this.createEventHandeler(false, true)} >Create</Button>} />


            </CenteredFlexDiv>

        </BusinessEventSegment>
    }


    creatingEventModal = () => {

        let e = this.state.selectedSlot
        return <Modal
            open={this.state.selectedSlot ? true : false}
            onClose={() => this.setState({ selectedSlot: null })}
        >
            <Modal.Header>Create Event</Modal.Header>
            <Modal.Content >
                {this.personalOrBusinessToggle(e)}

                {this.creatingBusinessEventOptions(e)}

                {/* {this.creatingPersonalEventOptions(e)} */}

            </Modal.Content>

        </Modal >
    }

    deleteEventHandeler = () => {
        // setLoading(true)


        fetch(`${process.env.BASE_URL}/delete`, {
            method: "DELETE",
            body: JSON.stringify({
                event: this.state.selectedEvent
            }),
            headers: {
                "X-CSRF-Token": this.props.csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(res => res.json())
            .then((res) => {
                this.props.dispatch({ type: "SET_PERSONAL_AND_BUSINESS_EVENTS", value: res })
            })

    }

    render() {
        return <>

            <FullWidthCalendarContainer fluid >
                <div style={{ width: "100%", maxWidth: "95vw", justifySelf: "center" }}>
                    <h1>Schedule</h1>
                    {/* <Label circular color={"blue"} content="Business" /> */}
                    {/* <Label circular color={"green"} content="Personal" /> */}
                    {/* <Label circular color={"grey"} content="Bookable" /> */}
                </div>


                <Divider style={{ gridArea: "divider" }} />
                <CalendarContainer fullWidth>
                    <BigCalendar
                        components={AdminComponents}
                        startAccessor={event => new Date(event.start_time)}
                        endAccessor={event => new Date(event.end_time)}
                        selectable
                        localizer={localizer}
                        // events={props.events}
                        // events={this.props.allEvents}
                        onSelectEvent={(e) => this.setState({ selectedEvent: e })}
                        events={this.props.appointments}
                        // onView={changeDefaultViewHandeler}
                        defaultView={this.props.defaultCalendarView}
                        // scrollToTime={props.calendarScrollToTime}
                        defaultDate={new Date}
                        // scrollToTime={new Date}
                        popup
                        step={15}
                        timeslots={1}
                        onSelectSlot={(e) => this.selectSlotHandeler(e)}
                    // min={new Date(2050, 1, 1, 9)}
                    // max={new Date(2050, 1, 1, 22)}
                    />
                </CalendarContainer>
                {/* {this.creatingEventModal()} */}
                {/* <Modal
                    onClose={() => this.setState({ selectedEvent: null })}
                    open={this.state.selectedEvent ? true : false}
                    header={this.state.selectedEvent ? this.state.selectedEvent.title : null}
                    actions={[{ key: "delete", content: "delete", onClick: () => this.deleteEventHandeler() }]}
                /> */}
            </FullWidthCalendarContainer>

            // creating modal
            {this.creatingEventModal()}
        </>




    }

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

