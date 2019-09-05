import React, { useState } from 'react'
import styled from "styled-components"
import { Label, Placeholder, Dimmer, Segment, Loader, Icon } from 'semantic-ui-react';
import { connect } from "react-redux"

function Event(props) {

    let isCanceled = false

    const CustomLabel = styled(Label)`
            z-index: 1;
            position: static;
            height: 100%;
            width: 100%;
            opacity: ${() => props.event.placeholder ? "0.5" : "1"};
        `

    if (props.event && props.event.extended_properties && props.event.extended_properties.private.cancelation === "true") isCanceled = true

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

    const iconPicker = () => {
        if (props.event.calendar) {
            if (props.event.calendar.id === process.env.CONSULTS_CALENDAR_ID) return <Icon name="phone" />
        }
        if (props.event.extended_properties) {
            if (props.event.extended_properties.private.skype === "true") return <Icon name="skype" />
        }
        return <Icon name="user" />
    }

    if (props.loadingEvent && (props.loadingEvent.id === props.event.id)) return <CustomLabel color={colorPicker()}>
        <Loader inverted size="tiny" active={true} inline></Loader>
        {props.loadingEvent.title}
    </CustomLabel>

    return <CustomLabel color={colorPicker()}>
        <Loader inverted size="tiny" active={props.event.placeholder} inline></Loader>
        {iconPicker()}
        {props.event.title}
    </CustomLabel>
}

const mapStateToProps = (state, props) => ({
    user: state.user,
    users: state.users,
    loadingEvent: state.loadingEvent
})


export default connect(mapStateToProps)(Event)



