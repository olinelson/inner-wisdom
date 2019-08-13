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


    console.log(progress)

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
            // console.log(progress)
        }, 100);
    }

    // incrementProgress()




    const onTokenHandeler = () => {
        setInfoModal(false)
        setPurchased(true)
        incrementProgress()
        fetch(`${props.baseUrl}/purchase`, {
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
            .then((res) => {
                setProgress(100)
                clearInterval(int)
                return res
            })
            .then((res) => props.dispatch({ type: "SET_EVENTS", value: res.events }))
        // .then(() => setInfoModal(false))
        // .then(() => setPurchased(true))
        // .then(() => props.history.push("/myAccount"))


    }

    const ifUserShowCheckout = () => {
        if (props.user) return <Checkout
            ammount={8000}
            email={props.user.email}
            onToken={onTokenHandeler}
        />
        return <>
            <Button content="Pay With Card" disabled />
            <Divider />
            <span><a href={`${props.baseUrl}/users/sign_in`}>Sign in</a> to make an appointment</span>
        </>
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

                    <div>
                        <p>$80</p>
                        {/* {showEventAttendees()} */}
                    </div>
                    <Divider hidden />
                    {/* {userPickerDropDown()} */}
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
            <Progress autoSuccess color="green" label={"Booking Appointment & Sending Confirmation Email"} percent={progress} active></Progress>
        </Modal>

        return null

    }



    const colorPicker = () => {
        if (noAttendees) return "blue"
        if (!personal && isAnEmptySlot()) return "grey"
        return "blue"
    }



    return (
        isUserAnAttendeeOfEvent(event, props.user) ? <ReadOnlyEvent event={event} /> :

            <>

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
    )
}



const mapStateToProps = (state, props) => ({

    user: state.user,
    users: state.users,
    events: state.events,

    csrfToken: state.csrfToken,
    baseUrl: state.baseUrl
})



export default withRouter(connect(mapStateToProps)(PurchasableEvent))
