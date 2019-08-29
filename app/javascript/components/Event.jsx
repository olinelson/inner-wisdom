import React, { useState } from 'react'
import { withRouter } from "react-router-dom"
import styled from "styled-components"
import { Card, Label, Popup, Rating, Segment, Input, Placeholder, Loader, Divider, Dropdown, Modal, Grid, Header, Icon, Button } from 'semantic-ui-react';
import { connect } from "react-redux"
import moment from 'moment'
import DayPicker from 'react-day-picker';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import UserPickerDropDown from "./UserPickerDropDown"

function Event(props) {


    const [event, setEvent] = useState(props.event);
    // const [modalOpen, setModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    // const [isCanceled, setIsCanceled] = useState(event.title ? event.title.toLowerCase().includes("canceled") : "")
    const [isCanceled, setIsCanceled] = useState(false)
    const CustomLabel = styled(Label)`
        opacity: ${() => loading ? "0.5" : "1"} !important;
        height: 100%;
        width: 100%;


    `
    const colorPicker = () => {
        if (personal) return "green"
        if (!personal && isAnEmptySlot()) return "grey"
        if (isCanceled) return "red"
        return "blue"
    }



    let personal = false
    if (event.calendar && event.calendar.id === props.user.google_calendar_email) personal = true




    const isAnEmptySlot = () => {
        if (!personal && event.attendees == null) return true
        return false
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
        let attendees = event.attendees.filter(a => a.email !== user.email)
        setEvent({ ...event, attendees })
    }

    const changeDayHandeler = (dt) => {

        let dateTime = new Date(dt)
        let newMonth = dateTime.getMonth()
        let newDay = dateTime.getDate()

        let start_time = new Date(event.start_time)
        start_time.setMonth(newMonth)
        start_time.setDate(newDay)

        let end_time = new Date(event.end_time)
        end_time.setMonth(newMonth)
        end_time.setDate(newDay)



        setEvent({ ...event, start_time, end_time })
    }

    const findUserIdByEmail = (email) => {
        let user = props.users.find(u => u.email === email)
        if (user) return `/clients/${user.id}`
        return "not_found"
    }

    const userDisplayNameSwitch = (u) => {
        if (u.displayName) return u.displayName
        if (u.first_name) return u.first_name + " " + u.last_name
        return u.email
    }

    const showEventAttendees = () => {
        if (event && event.attendees) {
            let users = event.attendees
            return users.map(u => {
                let linkToClientPage = `${findUserIdByEmail(u.email)}`
                return <Label key={"label" + u.email}>
                    <Icon style={{ cursor: "pointer" }} onClick={() => props.history.push(linkToClientPage)} name='user' />
                    <span style={{ cursor: "pointer" }} onClick={() => props.history.push(linkToClientPage)}>{userDisplayNameSwitch(u)}</span>
                    <Icon name='delete' onClick={() => removeAttendeeFromEvent(u)} />
                </Label>
            }
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

        const now = moment().hour(0).minute(0)

        return <>
            <Popup
                on="click"
                content={<DayPicker
                    onDayClick={changeDayHandeler}
                    selectedDays={new Date(event.start_time)}
                />}
                trigger={<h4 style={{ cursor: "pointer" }}>{moment(event.start_time).format('Do MMMM  YYYY')}<Icon name="caret down" /></h4>} />

            <TimePicker
                showSecond={false}

                value={startTime}
                // className=" ui menu transition"
                onChange={(e) => setEvent({ ...event, start_time: e._d })}
                format='h:mm a'
                use12Hours
                inputReadOnly
            />
            {/* to{" "} */}
            <TimePicker
                showSecond={false}
                value={endTime}
                // className="ui menu transition"
                onChange={(e) => setEvent({ ...event, end_time: e._d })}
                format='h:mm a'
                use12Hours
                inputReadOnly
            />
        </>


    }


    const deleteEventHandeler = () => {
        // setLoading(true)
        console.log("Deleting", event.title)

        fetch(`${process.env.BASE_URL}/delete`, {
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
            .then(res => res.json())
            .then((res) => {
                console.log(res)
                props.dispatch({ type: "SET_PERSONAL_AND_BUSINESS_EVENTS", value: res })
            })

    }

    const updateSelectedEventHandeler = () => {
        setLoading(true)
        fetch(`${process.env.BASE_URL}/update`, {
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
            .then((res) => props.dispatch({ type: "SET_PERSONAL_AND_BUSINESS_EVENTS", value: res }))
            .then(() => setLoading(false))

    }

    const eventLocation = () => {
        return <Input
            fluid
            transparent
            value={event.location || ""}
            onChange={(e) => setEvent({ ...event, location: e.target.value })}
            placeholder={"Address - If this is a free appointment slot leave this blank, unless you wish to publicly disclose the location."}
        />
    }

    // const editableEventModal = () => {

    //     return <Modal
    //         closeIcon
    //         open={modalOpen}
    //         onClose={() => setModalOpen(false)}
    //     >

    //         <Modal.Content >
    //             <Input fluid size="massive" onChange={(e) => changeTitleHandeler(e)} transparent value={event ? event.title : null} />
    //             <Modal.Description>
    //                 {appointmentTimeSetter()}
    //                 <Divider hidden />
    //                 {eventLocation()}
    //                 <div>
    //                     {showEventAttendees()}
    //                 </div>
    //                 <Divider hidden />


    //             </Modal.Description>
    //             {personal ? null : <UserPickerDropDown event={event} addAttendeeHandeler={(user) => addAttendeeToSelectedEvent(user)} />}
    //             <Button content="delete" onClick={() => deleteEventHandeler()} />
    //             <Button content="save" onClick={() => updateSelectedEventHandeler()} />
    //         </Modal.Content>
    //     </Modal>
    // }


    return <CustomLabel color={colorPicker()}>
        <Loader size="mini" inverted active={loading} inline style={{ marginRight: ".5rem", marginLeft: "-.25rem" }} />
        {event.title}
    </CustomLabel>

    return <Modal
        key={event.id}
        trigger={<CustomLabel color={colorPicker()}>
            <Loader size="mini" inverted active={loading} inline style={{ marginRight: ".5rem", marginLeft: "-.25rem" }} />
            {event.title}
        </CustomLabel>}
        header={<Input transparent value={event.title} onChange={(e) => setEvent({ ...event, title: e.target.value })} />}
        content={<>{appointmentTimeSetter()}
            <Divider hidden />
            {eventLocation()}
            <div>
                {showEventAttendees()}
            </div>
            <Divider hidden />
            {personal ? null : <UserPickerDropDown event={event} addAttendeeHandeler={(user) => addAttendeeToSelectedEvent(user)} />}
        </>}
        actions={[
            { key: "delete", content: "Delete", onClick: () => deleteEventHandeler() },
            { key: "save", content: "save", onClick: () => updateSelectedEventHandeler() }

        ]}

    />

    {/* <Modal
            closeIcon
            open={modalOpen}
            onClose={() => setModalOpen(false)}
        >

            <Modal.Content >
                <Input fluid size="massive" onChange={(e) => changeTitleHandeler(e)} transparent value={event ? event.title : null} />
                <Modal.Description>
                    {appointmentTimeSetter()}
                    <Divider hidden />
                    {eventLocation()}
                    <div>
                        {showEventAttendees()}
                    </div>
                    <Divider hidden />


                </Modal.Description>
                {personal ? null : <UserPickerDropDown event={event} addAttendeeHandeler={(user) => addAttendeeToSelectedEvent(user)} />}
                <Button content="delete" onClick={() => deleteEventHandeler()} />
                <Button content="save" onClick={() => updateSelectedEventHandeler()} />
            </Modal.Content>
        </Modal> */}

    {/* <CustomLabel
            color={colorPicker()}
            onClick={() => setModalOpen(true)}
        >
            <Loader size="mini" inverted active={loading} inline style={{ marginRight: ".5rem", marginLeft: "-.25rem" }} />
            {event.title}


        </CustomLabel> */}

    {/* {editableEventModal()} */ }



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



export default withRouter(connect(mapStateToProps)(Event))
