import React, { useState } from 'react'
import styled from "styled-components"
import { Card, Label, Popup, Rating, Segment, Input, Loader, Divider, Dropdown, Modal, Grid, Header, Icon, Button } from 'semantic-ui-react';
import { connect } from "react-redux"
import moment from 'moment'
import DayPicker from 'react-day-picker';

function CustomEvent(props) {

    const [event, setEvent] = useState(props.event);
    const [modalOpen, setModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    // `


    let personal = false
    if (props.event.calendar.id === props.user.google_calendar_email) personal = true


    const allUsersNotAttending = () => {
        if (!event.attendees || event.attendees.length < 1) return props.users

        const isAnAttendee = (user) => {
            for (let u of event.attendees) {
                if (u.id === user.id) return false
            }
            return true
        }

        let result = props.users.filter(isAnAttendee)
        return result

    }

    const changeTitleHandeler = (e) => {
        setEvent({ ...event, title: e.target.value })
    }

    const addAttendeeToSelectedEvent = (user) => {
        let attendees = event.attendees
        if (attendees == null) setEvent({ ...event, attendees: [user] })
        else setEvent({ ...event, attendees: [...event.attendees, user] })
    }

    const removeAttendeeFromEvent = (user) => {
        let attendees = event.attendees.filter(a => a.id !== user.id)
        setEvent({ ...event, attendees })
    }

    const changeDayHandeler = (day) => {
        let updatedDate = new Date(event.start_time)
        updatedDate.setMonth(day.getMonth())
        updatedDate.setDate(day.getDate())
        setEvent({ ...event, start_time: updatedDate, end_time: updatedDate })
    }

    const showEventAttendees = () => {
        if (event && event.attendees) {
            let users = event.attendees
            return users.map(u => <Label key={"label" + u.id}>
                <Icon name='user' />
                {u.displayName || u.first_name + " " + u.last_name}
                <Icon name='delete' onClick={() => removeAttendeeFromEvent(u)} />
            </Label>
            )
        }
        return null
    }

    const appointmentTimeSetter = () => {

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



        return <>
            {/* <h4>{moment(selectedSlot.start).format('Do MMMM  YYYY')}</h4> */}
            <Popup
                on="click"
                content={<DayPicker
                    onDayClick={changeDayHandeler}
                    selectedDays={new Date(event.start_time)}
                />}
                trigger={<h4 style={{ cursor: "pointer" }}>{moment(event.start_time).format('Do MMMM  YYYY')}<Icon name="caret down" /></h4>} />
            {/* {moment(selectedSlot.start).format('h:mm a')}  */}
            <Dropdown
                inline
                options={formattedendStartTimeOptions}
                defaultValue={formattedendStartTimeOptions[22].value}
                upward={false}
                scrolling
                onChange={(e, d) => setEvent({ ...event, start_time: new Date(d.value) })}
            />
            to{" "}
            <Dropdown
                inline
                options={formattedendEndTimeOptions}
                defaultValue={formattedendEndTimeOptions[22].value}
                upward={false}
                scrolling
                onChange={(e, d) => setEvent({ ...event, end_time: new Date(d.value) })}
            />
        </>
    }

    const allUsersNotAttendingList = () => {

        return allUsersNotAttending().map(user => (
            <Dropdown.Item onClick={() => addAttendeeToSelectedEvent(user)} key={user.id} text={`${user.first_name} ${user.last_name}`} icon="user circle" />
        ))

    }

    const userPickerDropDown = () => {
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
                {allUsersNotAttendingList()}
            </Dropdown.Menu>
        </Dropdown>
    }


    const deleteEventHandeler = () => {
        setModalOpen(false)
        fetch(`${props.baseUrl}/delete`, {
            method: "DELETE",
            body: JSON.stringify({
                event: event
            }),
            headers: {
                "X-CSRF-Token": props.csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(() => {
                let events = [...props.events].filter(e => e.id !== event.id)
                props.dispatch({ type: "SET_EVENTS", value: events })

            })
    }

    const updateSelectedEventHandeler = () => {
        setModalOpen(false)
        setLoading(true)
        fetch(`${props.baseUrl}/update`, {
            method: "POST",
            body: JSON.stringify({
                event: event
            }),
            headers: {
                "X-CSRF-Token": props.csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(response => response.json())
            .then((res) => props.dispatch({ type: "SET_PERSONAL_AND_BUSINESS_EVENTS", value: { scrollToEvent: res.scrollToEvent, events: res.events, personalEvents: res.personalEvents } }))
            .then(() => setLoading(false))

    }

    const editableEventModal = () => {

        return <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
        >
            <Input onChange={(e) => changeTitleHandeler(e)} transparent value={event ? event.title : null} />
            <Modal.Content >
                <Modal.Description>
                    {appointmentTimeSetter(event)}
                    <Divider hidden />

                    <div>
                        {showEventAttendees()}
                    </div>
                    <Divider hidden />
                    {userPickerDropDown()}
                </Modal.Description>

                <Button content="delete" onClick={() => deleteEventHandeler()} />
                <Button content="save" onClick={() => updateSelectedEventHandeler()} />
            </Modal.Content>
        </Modal>
    }

    const CustomLabel = styled(Label)`
        opacity: ${() => loading ? "0.5" : "1"} !important;

    `


    return <>

        <CustomLabel
            style={{ height: "100%", width: "100%" }}
            color={personal ? "green" : "blue"}
            onClick={() => setModalOpen(true)}
        >
            <Loader size="mini" inverted active={loading} inline style={{ marginRight: ".5rem", marginLeft: "-.25rem" }} />
            {event.title}


        </CustomLabel>

        {editableEventModal()}

    </>

}



const mapStateToProps = (state, props) => ({
    // events: state.events,
    // personalEvents: state.personalEvents,
    // allEvents: state.events.concat(state.personalEvents),
    user: state.user,
    users: state.users,
    events: state.events,
    // users: state.users,
    csrfToken: state.csrfToken,
    baseUrl: state.baseUrl
})



export default connect(mapStateToProps)(CustomEvent)
