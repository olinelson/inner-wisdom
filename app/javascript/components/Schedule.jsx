import React, { Component } from 'react'
import { Container, Divider, Modal, Button, Label, Icon, Segment, Grid, Header, Dropdown, Input } from 'semantic-ui-react'
import Calendar from './Calendar';
import { connect } from 'react-redux';
import styled from "styled-components"
import moment from "moment"

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

    // availableAppointments = () => {
    //     let result = props.events.filter(e => e.attendees == null || e.attendees.length < 1)
    //     return result
    // }

    showPrettyStartAndEndTime = (selectedEvent) => {

        return <>
            <h4>{moment(selectedEvent.start).format('Do MMMM  YYYY')}</h4>
            <p>{moment(selectedEvent.start).format('h:mm a')} to {moment(selectedEvent.end).format('h:mm a')}</p>
        </>
    }

    deleteSelectedEventHandeler = () => {
        this.setState({ dialogOpen: false })
        fetch(`${this.props.baseUrl}/delete`, {
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
            .then(() => {
                let events = [...this.props.events].filter(e => e.id !== this.state.selectedEvent.id)
                this.props.dispatch({ type: "SET_EVENTS", value: events })

            })
    }


    // ATTENDEE METHODS ====================
    allUsersNotAttending = (event) => {
        console.log("is this null?", event)
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
        console.log("filtered", result)
        return result

    }

    allUsersNotAttendingList = (event, addAttendeeHandeler) => {
        // if (event == null || event.attendees == null) return null
        console.log("check", event)
        let users = this.allUsersNotAttending(event)
        console.log(users)
        return users.map(user => (
            <Dropdown.Item onClick={() => addAttendeeHandeler(user)} key={user.id} text={`${user.first_name} ${user.last_name}`} icon="user circle" />
        ))

    }

    userPickerDropDown = (event, addAttendeeHandeler) => {
        console.log("event in userPickerdropdown", event)
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





    createEventHandeler = () => {

        this.setState({ creatingEvent: false })
        fetch(`${this.props.baseUrl}/create`, {
            method: "POST",
            body: JSON.stringify({
                event: this.state.newAppointment
            }),
            headers: {
                "X-CSRF-Token": this.props.csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(response => response.json())
            .then((e) => {

                let formattedEvent = {
                    id: e.event.id,
                    title: e.event.title,
                    start: new Date(e.event.start_time),
                    end: new Date(e.event.end_time),
                    allDay: false,
                    attendees: e.attendees
                }
                return formattedEvent
            })
            .then(formattedEvent => this.props.dispatch({ type: "SET_EVENTS", value: [...this.props.events, formattedEvent] }))


    }

    eventClickHandeler = (event) => {

        this.setState({ selectedEvent: event, dialogOpen: true })
    }

    selectSlotHandeler = (e) => {
        if (this.props.user.admin) this.setState({ creatingEvent: true, newAppointment: e })

    }

    editableEventModal = () => {
        let event = this.state.selectedEvent

        return <Modal
            open={this.state.dialogOpen}
            onClose={() => this.setState({ dialogOpen: false })}
        >
            <Input transparent>{event ? event.title : null}</Input>
            <Modal.Content >
                <Modal.Description>
                    {/* <p>{this.state.selectedEvent.description}</p> */}
                    {this.appointmentTimeSetter(event)}
                    {/* {this.state.selectedEvent ? this.showPrettyStartAndEndTime(this.state.selectedEvent) : null} */}
                    <Divider hidden />

                    <div>
                        {this.showEventAttendees(event, this.removeAttendeeFromSelectedEvent)}
                    </div>
                    <Divider hidden />
                    {this.userPickerDropDown(event, this.addAttendeeToSelectedEvent)}
                </Modal.Description>

                <Button content="delete" onClick={this.deleteSelectedEventHandeler} />
            </Modal.Content>
        </Modal>
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
            <h4>{moment(selectedSlot.start).format('Do MMMM  YYYY')}</h4>
            {/* {moment(selectedSlot.start).format('h:mm a')}  */}
            <Dropdown
                inline
                options={formattedendStartTimeOptions}
                defaultValue={formattedendStartTimeOptions[22].value}
                upward={false}
                scrolling
                onChange={(e, d) => this.setState({ newAppointment: { ...this.state.newAppointment, slots: [selectedSlot.start, new Date(d.value)] } })}
            />
            to{" "}
            <Dropdown
                inline
                options={formattedendEndTimeOptions}
                defaultValue={formattedendEndTimeOptions[22].value}
                upward={false}
                scrolling
                onChange={(e, d) => this.setState({ newAppointment: { ...this.state.newAppointment, slots: [selectedSlot.start, new Date(d.value)] } })}
            />
        </>
    }



    creatingEventModal = () => {

        let e = this.state.newAppointment

        return <Modal
            open={this.state.creatingEvent}
            onClose={() => this.setState({ creatingEvent: false })}
        >
            <Modal.Header>Create Event</Modal.Header>
            <Modal.Content >
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
                                {this.userPickerDropDown(e, this.addAttendeeToNewAppointment)}
                                <Divider hidden />
                                <Button primary onClick={this.createEventHandeler}>Create</Button>
                            </Grid.Column>

                            <Grid.Column>
                                <Header icon>
                                    <Icon name='time' />
                                    New Appointment Slot
          </Header>
                                {this.appointmentTimeSetter(e)}
                                <Divider hidden />
                                <Button onClick={this.createEventHandeler} primary>Create</Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </Modal.Content>

        </Modal >
    }

    render() {
        // console.log(this.state.selectedEvent)
        return (
            <FullWidthCalendarContainer>
                <h1>Schedule</h1>
                <Divider style={{ gridArea: "divider" }} />
                <Calendar
                    fullWidth
                    events={this.props.allEvents}
                    onSelectEvent={this.eventClickHandeler}
                    onSelectSlot={this.selectSlotHandeler}
                />
                {this.editableEventModal()}
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
    baseUrl: state.baseUrl
})

export default connect(mapStateToProps)(Schedule)
