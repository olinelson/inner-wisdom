import React from 'react';
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import { connect } from "react-redux"
import { Button, Container, Label, Grid, Search, Icon, Segment, Radio, Modal, Header, Image, Dropdown, Divider } from "semantic-ui-react"
import Checkout from './Checkout'
import Event from "./Event"
import PurchasableEvent from "./PurchasableEvent"
import ReadOnlyEvent from "./ReadOnlyEvent"
import { withRouter } from 'react-router-dom'
import styled from "styled-components"


const localizer = momentLocalizer(moment)

let AdminComponents = {
  event: Event // used by each view (Month, Day, Week)
}
let PurchasableComponents = {
  event: PurchasableEvent
}
let ReadOnlyComponents = {
  event: ReadOnlyEvent

}

function Calendar(props) {

  let allViews = Object.keys(Views).map(k => Views[k])

  const CalendarContainer = styled.div`
          grid-area: panel;
          height: 70vh;

        width: 500rem;
        min-height: 50rem;
        justify-self: center;
        max-width: ${() => props.fullWidth === true ? "95vw" : "60vw"};

    //    @media (max-width: 50rem) {
    //       max-width: 95vw;
    //   ;
    // }

  }
      `

  const changeDefaultViewHandeler = (view) => {


    props.dispatch({ type: "SET_DEFAULT_CALENDAR_VIEW", value: view })
  }

  const componentSwitch = () => {
    if (props.admin) return AdminComponents

    if (props.purchasable) return PurchasableComponents

    if (props.readOnlyComponents) return ReadOnlyComponents

    return ReadOnlyComponents
  }



  return <>
    <CalendarContainer >
      {/* {this.state.showCheckout ? <Checkout onToken={this.bookAppointment} /> : null} */}
      <BigCalendar
        components={componentSwitch()}
        startAccessor={event => new Date(event.start_time)}
        endAccessor={event => new Date(event.end_time)}
        selectable
        localizer={localizer}
        events={props.events}
        onView={changeDefaultViewHandeler}
        defaultView={props.defaultCalendarView}
        scrollToTime={props.calendarScrollToTime}
        defaultDate={props.calendarDisplayDate}
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

const mapStateToProps = (state) => ({
  // events: state.events,
  // personalEvents: state.personalEvents,
  // user: state.user,
  // users: state.users,
  // myAccountPanel: state.myAccountPanel,
  // baseUrl: state.baseUrl
  defaultCalendarView: state.defaultCalendarView,
  calendarScrollToTime: state.calendarScrollToTime,
  calendarDisplayDate: state.calendarDisplayDate,
})


export default withRouter((connect(mapStateToProps)(Calendar)))

