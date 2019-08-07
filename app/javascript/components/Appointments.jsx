import React from 'react'
import { Container, Divider } from 'semantic-ui-react'
import Calendar from './Calendar';
import { connect } from 'react-redux';
import styled from "styled-components"

export const FullWidthCalendarContainer = styled(Container)`
        margin-top: 4rem;
        display: grid !Important;
        grid-template-columns: 1fr;
        grid-template-areas: "heading" "divider" "panel";
        justify-content: center ;
    `

function Appointments(props) {
    const availableAppointments = () => {
        let result = props.events.filter(e => e.attendees == null || e.attendees.length < 1)
        return result
    }

    return (
        <FullWidthCalendarContainer>
            <h1>Available Appointments</h1>
            <Divider style={{ gridArea: "divider" }} />
            <Calendar fullWidth purchasable events={availableAppointments()} />
        </FullWidthCalendarContainer>
    )
}

const mapStateToProps = (state) => ({
    events: state.events
})

export default connect(mapStateToProps)(Appointments)
