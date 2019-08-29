import React, { useState } from 'react'
import styled from "styled-components"
import { Card, Label, Popup, Progress, Rating, Segment, Input, Loader, Divider, Dropdown, Modal, Grid, Header, Icon, Button } from 'semantic-ui-react';
import { connect } from "react-redux"
import moment from 'moment'
import DayPicker from 'react-day-picker';
import { withRouter, Link } from "react-router-dom"
import { isUserAnAttendeeOfEvent } from "./Appointments"
import Checkout from "./Checkout"
import ReadOnlyEvent from './ReadOnlyEvent';

function PurchasableEvent(props) {
    const event = props.event
    const [infoModal, setInfoModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [purchased, setPurchased] = useState(false)
    const [progress, setProgress] = useState(1)
    const [isCanceled, setIsCanceled] = useState(event.title.toLowerCase().includes("canceled"))

    let currentTime = new Date
    let eventTime = new Date(event.start_time)
    let hours = (eventTime.getTime() - currentTime.getTime()) / 3600000;
    const [inGracePeriod, setInGracePeriod] = useState(hours > 24)

    // if (props.user)

    const showPrettyStartAndEndTime = () => {

        return <>
            <h4>{moment(event.start_time).format('Do MMMM  YYYY')}</h4>
            <p>{moment(event.start_time).format('h:mm a')} to {moment(event.end_time).format('h:mm a')}</p>
        </>
    }


    let int

    const incrementProgress = () => {


        let prog = 0

        int = setInterval(() => {

            prog++
            if (prog >= 100 || progress >= 100) {
                clearInterval(int);
            }
            setProgress(prog)
        }, 100);
    }

    // incrementProgress()




    const bookAppointment = () => {
        setInfoModal(false)
        setPurchased(true)
        incrementProgress()
        fetch(`${process.env.BASE_URL}/purchase`, {
            method: "POST",
            body: JSON.stringify({
                event: event,
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
                setProgress(100)
                clearInterval(int)

                return delay(1000).then(() => {
                    props.dispatch({ type: "SET_PERSONAL_AND_BUSINESS_EVENTS", value: res })
                    props.dispatch({ type: "SET_NOTIFICATIONS", value: [{ id: event.id, type: "notice", message: "Appointment Booked" }] })

                })
            })
        // .then((res) => props.dispatch({ type: "SET_EVENTS", value: res.events }))
        // .then(() => setInfoModal(false))
        // .then(() => setPurchased(true))
        // .then(() => props.history.push("/myAccount"))


    }

    const delay = (t, v) => {
        return new Promise(function (resolve) {
            setTimeout(resolve.bind(null, v), t)
        });
    }

    const ifUserShowCheckout = () => {
        if (props.user) return <Button content="Book Appointment" onClick={() => bookAppointment()} />
        return <>
            <Button content="Book Appointment" disabled />
            <Divider />
            <span><a href={`${process.env.BASE_URL}/users/sign_in`}>Sign in</a> to make an appointment</span>
        </>
    }

    const cancelEvent = () => {
        setLoading(true)
        setPurchased(false)
        let baseUrl = process.env.BASE_URL

        let newTitle = "*Canceled " + event.title
        let editedEvent = { ...event, title: newTitle }

        if (!inGracePeriod) setIsCanceled(true)

        fetch(`${baseUrl}/cancel`, {
            method: "POST",
            body: JSON.stringify({
                inGracePeriod,
                event: editedEvent
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

    const cancelationFee = () => {
        // let currentTime = new Date
        // let eventTime = new Date(event.start_time)
        // let hours = (eventTime.getTime() - currentTime.getTime()) / 3600000;

        if (!inGracePeriod) return <>
            <p>As this is less than 24 hours notice you will be charged in full</p>
        </>

        return <p>As this is more than 24 hours notice this cancellation is free.</p>
    }

    const cancelEventModal = () => {
        return <Modal trigger={<Button basic icon="trash" content='Cancel Appoitment' />} basic size='small'>
            <Header icon='trash' content='Delete Post' />
            <Modal.Content>
                <p>Are you sure you want to cancel this appointment?</p>

                {cancelationFee()}
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => cancelEvent()} color='red' inverted>
                    <Icon name='remove' /> Cancel Appointment
                            </Button>
                <Button color='green' inverted>
                    <Icon name='checkmark' /> Never Mind
                            </Button>
            </Modal.Actions>
        </Modal>
    }

    const modal = () => {

        return <Modal
            open={infoModal}
            onClose={() => setInfoModal(false)}

        >
            <Header content={event.title} />
            <Modal.Content >
                <Modal.Description>
                    {showPrettyStartAndEndTime()}
                    <Divider hidden />

                </Modal.Description>
                {ifUserShowCheckout()}
            </Modal.Content>
        </Modal>
    }

    const purchasedModal = () => {

        if (purchased) return <Modal
            open={purchased}
        >
            <Header content={"Booking Complete"} />
            <Modal.Content >
                <Modal.Description>
                    {showPrettyStartAndEndTime()}
                    <Divider hidden />

                    <div>
                        <p>$80</p>
                    </div>
                    <Divider hidden />



                    <Link to="/myAccount">Show Me My Appointments</Link>

                </Modal.Description>

            </Modal.Content>
            <Progress
                autoSuccess
                color="green"
                label={progress >= 100 ? "Done" : "Booking Appointment & Sending Confirmation Email"}
                percent={progress}
                active>

            </Progress>
        </Modal>

        return null

    }



    const colorPicker = () => {
        if (noAttendees) return "blue"
        if (!personal && isAnEmptySlot()) return "grey"
        return "blue"
    }

    const cancelConfirm = () => {
        return <Modal key="cancel confirm" trigger={<Button basic icon="trash" content='Cancel Appoitment' />} basic size='small'
            header={'Delete Post'}
            content={<><p>Are you sure you would like to cancel this appointment?</p>{cancelationFee()}</>}
            actions={['Never Mind', { key: 'yes', content: 'Yes, Cancel', negative: true, onClick: () => cancelEvent() }]}
        />
    }

    const isInTheFuture = () => {
        let now = new Date
        let eventTime = new Date(event.start_time)
        return now < eventTime
    }


    // if bookable
    // if in the future
    // if not attending
    // if not canceled
    // purchasable event
    if (isInTheFuture() && !isUserAnAttendeeOfEvent(event, props.user) && !isCanceled) {
        return <>

            <Label
                style={{ height: "100%", width: "100%" }}
                color="grey"
                onClick={() => setInfoModal(true)}
            >
                <Loader size="mini" inverted active={loading} inline style={{ marginRight: ".5rem", marginLeft: "-.25rem" }} />
                {event.title}



            </Label>

            {modal()}
            {purchasedModal()}


        </>
    }

    // an event that I am attending that I can cancel
    // i'm an attendee
    // it's not cancelled
    // is in the future

    // cancelable event
    if (isUserAnAttendeeOfEvent(event, props.user) && !isCanceled && isInTheFuture()) {
        return <Modal
            trigger={<Label
                style={{ height: "100%", width: "100%" }}
                color="blue"
            >
                <Loader size="mini" inverted active={loading} inline style={{ marginRight: ".5rem", marginLeft: "-.25rem" }} />
                {event.title}
            </Label>}
            header={event.title}
            content={showPrettyStartAndEndTime()}
            actions={[cancelConfirm()]}
        />
    }

    // historical event
    if (isUserAnAttendeeOfEvent(event, props.user) && !isCanceled && !isInTheFuture()) {
        return <Modal
            trigger={<Label
                style={{ height: "100%", width: "100%", opacity: "0.5" }}
                color="blue"
            >
                <Loader size="mini" inverted active={loading} inline style={{ marginRight: ".5rem", marginLeft: "-.25rem" }} />
                {event.title}
            </Label>}
            header={event.title}
            content={showPrettyStartAndEndTime()}
        />
    }




    if (isCanceled) return <Modal
        trigger={<Label
            style={{ height: "100%", width: "100%", opacity: isInTheFuture() ? "100%" : "0.5" }}
            color="red"
        >
            <Loader size="mini" inverted active={loading} inline style={{ marginRight: ".5rem", marginLeft: "-.25rem" }} />
            {event.title}
        </Label>}
        header={event.title}
        content={showPrettyStartAndEndTime()}
    />




    // view only event
    // return 

    // return null


}



const mapStateToProps = (state, props) => ({

    user: state.user,
    users: state.users,
    events: state.events,

    csrfToken: state.csrfToken,
    baseUrl: state.baseUrl
})



export default withRouter(connect(mapStateToProps)(PurchasableEvent))
