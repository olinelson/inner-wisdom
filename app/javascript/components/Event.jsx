import React from 'react'
import styled from "styled-components"
import { Label } from 'semantic-ui-react';
import { connect } from "react-redux"

function Event(props) {
    const isCanceled = props.event.title.toLowerCase().includes("cancel")

    const CustomLabel = styled(Label)`
        height: 100%;
        width: 100%;
    `

    const colorPicker = () => {
        let personal = false
        if (props.event.calendar && props.event.calendar.id === props.user.google_calendar_email) personal = true
        if (personal) return "green"

        const isAnEmptySlot = () => {
            if (!personal && props.event.attendees == null) return true
            return false
        }

        if (!personal && isAnEmptySlot()) return "grey"
        if (isCanceled) return "red"
        return "blue"
    }

    return <CustomLabel color={colorPicker()}>
        {props.event.title}
    </CustomLabel>
}

const mapStateToProps = (state, props) => ({
    user: state.user,
    users: state.users,
})


export default connect(mapStateToProps)(Event)



