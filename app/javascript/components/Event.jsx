import React from 'react'
import styled from "styled-components"
import { Label, Loader, Icon } from 'semantic-ui-react';

function Event(props) {
    let isCanceled = false

    const CustomLabel = styled(Label)`
            z-index: 1;
            position: static;
            height: 100%;
            width: 100%;
            opacity: ${() => props.event.placeholder ? "0.5" : "1"};
        `


    const colorPicker = () => {

        if (props.event && props.event.extended_properties && props.event.extended_properties.private.cancelation === "true") return 'red'
        if (props.event.attendees && props.event.attendees.length > 0) return 'blue'
        return 'grey'
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

// const mapStateToProps = (state, props) => ({
//     user: state.user,
//     users: state.users,
//     loadingEvent: state.loadingEvent
// })


export default Event



