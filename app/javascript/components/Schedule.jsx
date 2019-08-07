import React, { Component } from 'react'
import { Container, Divider, Modal, Popup, Button, Label, Icon, Segment, Grid, Header, Dropdown, Checkbox } from 'semantic-ui-react'
import Calendar from './Calendar';
import { connect } from 'react-redux';
import styled from "styled-components"
import moment from "moment"
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

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

    userPickerDropDown = (event, addAttendeeHandeler) => {
        return <Dropdown
            text='Add Client'
            icon='add user'
            floating
            labeled
            button
            className='icon'
        >
            <Dropdown.Menu>
                <Dropdown.Header content='Clients' />
                {this.allUsersNotAttendingList(event, addAttendeeHandeler)}
            </Dropdown.Menu>
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
            return users.map(u => <Label key={u.id}>
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
        if (this.props.user.admin) this.setState({ creatingEvent: true, selectedEvent: { ...e, personal: false } })

    }

    changeDayHandeler = (day) => {
        let updatedDate = new Date(this.state.selectedEvent.start_time)
        updatedDate.setMonth(day.getMonth())
        updatedDate.setDate(day.getDate())
        this.setState({
            selectedEvent: { ...this.state.selectedEvent, start_time: updatedDate, end_time: updatedDate }
        })
    }

    changeTitleHandeler = (e) => {
        this.setState({ selectedEvent: { ...this.state.selectedEvent, title: e.target.value } })
    }

    appointmentTimeSetter = (selectedSlot) => {
        if (!selectedSlot) return null

        let endTime = moment(selectedSlot.end)
        let startTime = moment(selectedSlot.start)

        let endTimeOptions = [endTime]
        let startTimeOptions = [startTime]


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

        return <>
            {/* <h4>{moment(selectedSlot.start).format('Do MMMM  YYYY')}</h4> */}
            <Popup
                on="click"
                content={<DayPicker
                    onDayClick={this.changeDayHandeler}
                    selectedDays={new Date(this.state.selectedEvent.start_time)}
                />}
                trigger={<h4 style={{ cursor: "pointer" }}>{moment(selectedSlot.start_time).format('Do MMMM  YYYY')}<Icon name="caret down" /></h4>} />
            {/* {moment(selectedSlot.start).format('h:mm a')}  */}
            <Dropdown
                inline
                options={formattedendStartTimeOptions}
                defaultValue={formattedendStartTimeOptions[22].value}
                upward={false}
                scrolling
                onChange={(e, d) => this.setState({ selectedEvent: { ...this.state.selectedEvent, start_time: new Date(d.value) } })}
            />
            to{" "}
            <Dropdown
                inline
                options={formattedendEndTimeOptions}
                defaultValue={formattedendEndTimeOptions[22].value}
                upward={false}
                scrolling
                onChange={(e, d) => this.setState({ selectedEvent: { ...this.state.selectedEvent, end_time: new Date(d.value) } })}
            />
        </>
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

                <Segment placeholder>

                    <Grid columns={2} stackable textAlign='center'>
                        <Divider vertical>Or</Divider>

                        <Grid.Row verticalAlign='middle'>

                            <Grid.Column>
                                <Header icon>
                                    <Icon name='bookmark' />
                                    Book New Appointment
          </Header>
                                {this.appointmentTimeSetter(e)}
                                <Divider hidden />

                                <div>
                                    {this.showEventAttendees(e, this.removeAttendeeFromNewAppointment)}
                                </div>
                                <Divider hidden />
                                {this.userPickerDropDown(e, this.addAttendeeToSelectedEvent)}
                                <Divider hidden />
                                <Button primary onClick={() => this.createEventHandeler(false)}>Create</Button>
                            </Grid.Column>

                            <Grid.Column>
                                <Header icon>
                                    <Icon name='time' />
                                    New Appointment Slot
          </Header>
                                {this.appointmentTimeSetter(e)}
                                <Divider hidden />
                                <Button onClick={() => this.createEventHandeler(true)} primary>Create</Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </Modal.Content>

        </Modal >
    }

    render() {
        console.log("selected event", this.state.selectedEvent)
        return (

            <FullWidthCalendarContainer>

                <h1>Schedule</h1>
                <Divider style={{ gridArea: "divider" }} />
                <Calendar
                    admin
                    fullWidth
                    events={this.props.allEvents}
                    onSelectSlot={this.selectSlotHandeler}
                />
                {/* {this.editableEventModal()} */}
                {this.creatingEventModal()}
            </FullWidthCalendarContainer>
        )
    }

}

const mapStateToProps = (state) => ({
    events: state.events,
    personalEvents: state.personalEvents,
    allEvents: state.events.concat(state.personalEvents),
    user: state.user,
    users: state.users,
    csrfToken: state.csrfToken,
    baseUrl: state.baseUrl,
    businessCalendarAddress: state.businessCalendarAddress
})

export default connect(mapStateToProps)(Schedule)
