import React from 'react'
import { Container } from 'semantic-ui-react'
import Calendar from './Calendar';
import { connect } from 'react-redux';


function Appointments(props) {
    const availableAppointments = () => {
        let result = props.events.filter(e => e.attendees == null || e.attendees.length < 2)
        return result
    }


    return (
        <Container >
            <h1>Available Appointments</h1>
            <Calendar {...props} bookable events={availableAppointments()} />
        </Container>
    )
}

const mapStateToProps = (state) => ({
    events: state.events
})

export default connect(mapStateToProps)(Appointments)
