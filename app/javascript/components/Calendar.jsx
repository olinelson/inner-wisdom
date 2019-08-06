import React from 'react';
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import { connect } from "react-redux"
import { Button, Container, Label, Grid, Search, Icon, Segment, Radio, Modal, Header, Image, Dropdown, Divider } from "semantic-ui-react"
import Checkout from './Checkout'
import styled from "styled-components"
import CustomEvent from "./CustomEvent"
import { withRouter } from 'react-router-dom'


const localizer = momentLocalizer(moment)

let components = {
  event: CustomEvent, // used by each view (Month, Day, Week)
}


function Calendar(props) {

  let allViews = Object.keys(Views).map(k => Views[k])

  const CalendarContainer = styled.div`
        grid-area: panel;
        height: 100vh;
      // max-width: ${props => props.fullWidth ? "95vw" : "70vw"};
      width: 100rem;
      min-height: 50rem;
      justify-self: center;
    max-width: 95vw;
  //    @media (max-width: 50rem) {
  //       max-width: 95vw;
  //   ;
  // }

}
    `

  console.log("calendar props", props)

  return <>
    <CalendarContainer >
      {/* {this.state.showCheckout ? <Checkout onToken={this.bookAppointment} /> : null} */}
      <BigCalendar
        components={components}
        startAccessor={event => new Date(event.start_time)}
        endAccessor={event => new Date(event.end_time)}
        selectable
        localizer={localizer}
        events={props.events}
        // defaultView={Views.WEEK}
        scrollToTime={new Date(2050, 1, 1)}
        defaultDate={new Date()}
        // onSelectEvent={props.onSelectEvent}
        popup
        step={30}
        timeslots={1}
        onSelectSlot={props.onSelectSlot}
      // min={new Date(2050, 1, 1, 9)}
      // max={new Date(2050, 1, 1, 22)}
      />

    </CalendarContainer>
  </ >
}



export default withRouter((Calendar))

