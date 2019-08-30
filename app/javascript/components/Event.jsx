import React from 'react'
import styled from "styled-components"
import { Label, Placeholder, Dimmer, Segment, Loader } from 'semantic-ui-react';
import { connect } from "react-redux"

function Event(props) {
    // const isCanceled = props.event.title.toLowerCase().includes("cancel")
    let isCanceled = false

    const CustomLabel = styled(Label)`
            height: 100%;
            width: 100%;
            opacity: ${() => props.event.placeholder ? "0.5" : "1"};
        `

    if (props.event && props.event.extended_properties && props.event.extended_properties.private.cancelation === "true") isCanceled = true
    console.log("is canceled", isCanceled)

    const colorPicker = () => {
        if (isCanceled) return "red"
        let personal = false
        if (!props.user) return "grey"
        if (props.event.calendar && props.event.calendar.id === props.user.google_calendar_email) personal = true
        if (personal) return "green"

        const isAnEmptySlot = () => {
            if (!personal && props.event.attendees == null) return true
            return false
        }

        if (!personal && isAnEmptySlot()) return "grey"

        return "blue"
    }

    return <CustomLabel color={colorPicker()}>
        <Loader inverted size="tiny" active={props.event.placeholder ? true : false} inline></Loader>
        {props.event.title}
    </CustomLabel>
}

const mapStateToProps = (state, props) => ({
    user: state.user,
    users: state.users,
})


export default connect(mapStateToProps)(Event)



