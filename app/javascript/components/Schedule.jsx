import React, { Component } from 'react'
import { Container, Divider, Modal, Popup, Button, Label, Icon, Segment, Grid, Header, Dropdown, Checkbox, Form } from 'semantic-ui-react'
import Calendar from './Calendar';
import { connect } from 'react-redux';
import styled from "styled-components"
import moment from "moment"
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import TimePicker from 'rc-time-picker';

import { FullWidthCalendarContainer } from "./Appointments"

class Schedule extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selectedEvent: null,
            showCheckout: false,
            dialogOpen: false,
            creatingEvent: false,
            newAppointment: null,
        }
    }

    showPrettyStartAndEndTime = (selectedEvent) => {

        return <>
            <h4>{moment(selectedEvent.start_time).format('Do MMMM  YYYY')}</h4>
            <p>{moment(selectedEvent.start_time).format('h:mm a')} to {moment(selectedEvent.end).format('h:mm a')}</p>
        </>
    }



    // updateSelectedEventHandeler = () => {
    //     this.setState({ dialogOpen: false })
    //     fetch(`${this.props.baseUrl}/update`, {
    //         method: "POST",
    //         body: JSON.stringify({
    //             event: this.state.selectedEvent
    //         }),
    //         headers: {
    //             "X-CSRF-Token": this.props.csrfToken,
    //             "Content-Type": "application/json",
    //             Accept: "application/json",
    //             "X-Requested-With": "XMLHttpRequest"
    //         }
    //     })
    //         .then(response => response.json())
    //         // .then(e => console.log(e))
    //     .then((res) => this.props.dispatch({ type: "SET_PERSONAL_AND_BUSINESS_EVENTS", value: { event: res.events, personalEvents: res.personalEvents, scrollToEvent: res.scrollToEvent } }))
    // }


    // ATTENDEE METHODS ====================
    allUsersNotAttending = (event) => {
        let users = this.props.users
        if (event == null) return users

        if (!event.attendees || event.attendees.length < 1) return users

        const isAnAttendee = (user) => {
            for (let u of event.attendees) {
                if (u.id === user.id) return false
            }
            return true
        }

        let result = users.filter(isAnAttendee)
        return result

    }

    allUsersNotAttendingList = (event, addAttendeeHandeler) => {
        let users = this.allUsersNotAttending(event)
        return users.map(user => (
            <Dropdown.Item onClick={() => addAttendeeHandeler(user)} key={user.id} text={`${user.first_name} ${user.last_name}`} icon="user circle" />
        ))

    }

    searchForUsersHandeler = (items, query) => {
        let result = []
        for (let item of items) {
            if (item.props.text.includes(query)) result.push(item)
        }
        return result
    }

    userPickerDropDown = (event, addAttendeeHandeler) => {
        return <Dropdown
            text='Add Client'
            icon='add user'
            floating
            labeled
            button
            className='icon'
            search={this.searchForUsersHandeler}
            options={this.allUsersNotAttendingList(event, addAttendeeHandeler)}
        >
            {/* <Dropdown.Menu>
                <Dropdown.Header content='Clients' />
                {this.allUsersNotAttendingList(event, addAttendeeHandeler)}
            </Dropdown.Menu> */}
        </Dropdown>
    }


    addAttendeeToNewAppointment = (user) => {
        let attendees = this.state.newAppointment.attendees
        if (attendees == null) this.setState({ newAppointment: { ...this.state.newAppointment, attendees: [user] } })
        else this.setState({ newAppointment: { ...this.state.newAppointment, attendees: [...this.state.newAppointment.attendees, user] } })
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

    removeAttendeeFromNewAppointment = user => {
        let attendees = this.state.newAppointment.attendees.filter(a => a.id !== user.id)
        this.setState({ newAppointment: { ...this.state.newAppointment, attendees } })
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

    createEventHandeler = (isAppointmentSlot) => {
        this.setState({ creatingEvent: false })
        fetch(`${this.props.baseUrl}/create`, {
            method: "POST",
            body: JSON.stringify({
                event: this.state.selectedEvent,
                appointmentSlot: isAppointmentSlot
            }),
            headers: {
                "X-CSRF-Token": this.props.csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(response => response.json())
            .then(res => this.props.dispatch({ type: "SET_PERSONAL_AND_BUSINESS_EVENTS", value: { events: res.events, personalEvents: res.personalEvents, scrollToEvent: res.scrollToEvent } }))


    }

    eventClickHandeler = (event) => {

        this.setState({ selectedEvent: event, dialogOpen: true })
    }

    selectSlotHandeler = (e) => {
        if (this.props.user.admin) this.setState({ creatingEvent: true, selectedEvent: { ...e, title: "", location: "", start_time: e.start, end_time: e.end, personal: false } })

    }

    changeDayHandeler = (dt) => {
        let event = this.state.selectedEvent

        let dateTime = new Date(dt)
        let newMonth = dateTime.getMonth()
        let newDay = dateTime.getDate()

        let start_time = new Date(event.start_time)
        start_time.setMonth(newMonth)
        start_time.setDate(newDay)

        let end_time = new Date(event.end_time)
        end_time.setMonth(newMonth)
        end_time.setDate(newDay)

        this.setState({ selectedEvent: { ...this.state.selectedEvent, start_time, end_time } })
    }

    changeTitleHandeler = (e) => {
        this.setState({ selectedEvent: { ...this.state.selectedEvent, title: e.target.value } })
    }

    eventTimeSetter = () => {
        let event = this.state.selectedEvent

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


        return <span>

            <Popup
                on="click"
                content={<DayPicker
                    onDayClick={this.changeDayHandeler}
                    selectedDays={new Date(event.start_time)}
                />}
                trigger={<h4 style={{ cursor: "pointer" }}>{moment(event.start_time).format('Do MMMM  YYYY')}<Icon name="caret down" /></h4>} />

            <TimePicker
                showSecond={false}

                value={startTime}
                // className=" ui menu transition"
                onChange={(e) => this.setState({ selectedEvent: { ...this.state.selectedEvent, start_time: e._d } })}
                format='h:mm a'
                use12Hours
                inputReadOnly
            />
            <TimePicker
                showSecond={false}
                value={endTime}
                // className="ui menu transition"
                onChange={(e) => this.setState({ selectedEvent: { ...this.state.selectedEvent, end_time: e._d } })}
                format='h:mm a'
                use12Hours
                inputReadOnly
            />

        </span>
    }



    personalOrBusinessToggle = () => {
        let e = this.state.selectedEvent
        if (!e || this.props.user.google_calendar_email.length < 1) return null


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
        // console.log("this is e", e)
        console.log("selected event", this.state.selectedEvent)

        if (e && e.personal) return <Segment placeholder>
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


                <Button color="green" onClick={() => this.createEventHandeler(false)} type="submit">Create</Button>
            </Form>
        </Segment>
    }

    creatingBusinessEventOptions = (e) => {
        if (e && e.personal === false) return <Segment placeholder>

            <Grid columns={2} stackable textAlign='center'>
                <Divider vertical>Or</Divider>

                <Grid.Row verticalAlign='top'>

                    <Grid.Column >
                        <Header icon>
                            <Icon name='bookmark' />
                            Book New Appointment
                        </Header>

                        {this.eventTimeSetter(e)}
                        {/* <Divider hidden /> */}

                        <Divider hidden />

                        {/* <p>This will create a confirmed appointment slot that will only be visible to admin and its attendees.</p> */}
                        {/* <Button primary onClick={() => this.createEventHandeler(false)}>Create</Button> */}
                        <Popup content='This will create a confirmed appointment slot that will only be visible to admin and its attendees.' trigger={<Button primary onClick={() => this.createEventHandeler(false)}>Create</Button>} />
                        <Divider hidden />
                        {this.userPickerDropDown(e, this.addAttendeeToSelectedEvent)}
                        <Divider hidden />
                        <div>
                            {this.showEventAttendees(e, this.removeAttendeeFromSelectedEvent)}
                        </div>




                    </Grid.Column>

                    <Grid.Column  >
                        <Header icon>
                            <Icon name='time' />
                            New Appointment Slot
                         </Header>

                        {this.eventTimeSetter(e)}

                        <Divider hidden />
                        {/* <p>This will create a "bookable" appointment slot visable to all clients.</p> */}
                        {/* <Button color="grey" onClick={() => this.createEventHandeler(true)} >Create</Button> */}
                        <Popup content='This will create a "bookable" appointment slot visable to all clients.' trigger={<Button color="grey" onClick={() => this.createEventHandeler(true)} >Create</Button>} />

                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    }


    creatingEventModal = () => {

        let e = this.state.selectedEvent
        return <Modal
            open={this.state.creatingEvent}
            onClose={() => this.setState({ creatingEvent: false })}
        >
            <Modal.Header>Create Event

            </Modal.Header>
            <Modal.Content >
                {this.personalOrBusinessToggle(e)}

                {this.creatingBusinessEventOptions(e)}

                {this.creatingPersonalEventOptions(e)}

            </Modal.Content>

        </Modal >
    }

    render() {
        // console.log(this.state.selectedEvent)
        return <>

            <FullWidthCalendarContainer fluid >
                <div style={{ width: "100%", maxWidth: "95vw", justifySelf: "center" }}>
                    <h1>Schedule</h1>
                    <Label circular color={"blue"} content="Business" />
                    <Label circular color={"green"} content="Personal" />
                    <Label circular color={"grey"} content="Bookable" />
                </div>


                <Divider style={{ gridArea: "divider" }} />

                <Calendar
                    admin
                    fullWidth
                    events={this.props.allEvents}
                    onSelectSlot={this.selectSlotHandeler}
                />
                {this.creatingEventModal()}
            </FullWidthCalendarContainer>
        </>
    }

}

const allEvents = (events, personalEvents) => {

    let result = []
    if (events) result = result.concat(events)
    if (personalEvents) result = result.concat(personalEvents)
    return result
}

const mapStateToProps = (state) => ({
    events: state.events,
    personalEvents: state.personalEvents,
    allEvents: allEvents(state.events, state.personalEvents),
    user: state.user,
    users: state.users,
    csrfToken: state.csrfToken,
    baseUrl: state.baseUrl,
    businessCalendarAddress: state.businessCalendarAddress
})

export default connect(mapStateToProps)(Schedule)
