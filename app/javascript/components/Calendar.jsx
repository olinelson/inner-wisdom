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


  // bookAppointment = () => {
  //   let user = this.props.user
  //   let event = this.state.selectedEvent

  //   fetch(`${this.props.baseUrl}/edit`, {
  //     method: "POST",
  //     body: JSON.stringify({
  //       event,
  //       user
  //     }),
  //     headers: {
  //       "X-CSRF-Token": this.props.csrfToken,
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //       "X-Requested-With": "XMLHttpRequest"
  //     }
  //   })
  //     .then(response => response.json())
  //     .then(e => {
  //       let formattedEvents = e.events.map(event => {
  //         return {
  //           id: event.id,
  //           title: event.title,
  //           start: new Date(event.start_time),
  //           end: new Date(event.end_time),
  //           allDay: false,
  //           attendees: event.attendees
  //         }

  //       })
  //       return formattedEvents
  //     })
  //     .then(formattedEvents => this.props.dispatch({ type: "SET_EVENTS", value: formattedEvents }))
  //     .then(() => this.props.history.push('/myAccount'))
  //     .then(e => this.props.dispatch({ type: "SET_MY_ACCOUNT_PANEL", value: "calendar" }))
  // }



  // showMustCreateAccountModal = () => {
  //   return <Modal
  //     open={this.state.dialogOpen}
  //     onClose={() => this.setState({ dialogOpen: false })}
  //   >
  //     <Modal.Header>Book Appointment</Modal.Header>
  //     <Modal.Content image>
  //       {/* <Image wrapped size='medium' src='/images/avatar/large/rachel.png' /> */}
  //       <Modal.Description>
  //         <Header>{this.state.selectedEvent ? this.state.selectedEvent.title : null}</Header>

  //         <p>To Book an Appointment you must <a href={`${this.props.baseUrl}/users/sign_up`}>Create an Account</a></p>

  //       </Modal.Description>
  //     </Modal.Content>
  //   </Modal>
  // }

  // showBookableModal = () => {
  //   return <Modal
  //     open={this.state.dialogOpen}
  //     onClose={() => this.setState({ dialogOpen: false })}
  //   >
  //     <Modal.Header>Book Appointment</Modal.Header>
  //     <Modal.Content image>
  //       {/* <Image wrapped size='medium' src='/images/avatar/large/rachel.png' /> */}
  //       <Modal.Description>
  //         <Header>{this.state.selectedEvent ? this.state.selectedEvent.title : null}</Header>

  //         <Checkout email={this.props.user.email} ammount={8000} onToken={this.bookAppointment} />
  //       </Modal.Description>
  //     </Modal.Content>
  //   </Modal>
  // }

  // showInfoModal = () => {
  //   return <Modal
  //     open={this.state.dialogOpen}
  //     onClose={() => this.setState({ dialogOpen: false })}
  //   >
  //     <Modal.Header>Appointment Confirmed</Modal.Header>
  //     <Modal.Content >
  //       <Modal.Description>
  //         <Header>{this.state.selectedEvent ? this.state.selectedEvent.title : null}</Header>
  //         {/* <p>{this.state.selectedEvent.description}</p> */}
  //         {this.state.selectedEvent ? this.showPrettyStartAndEndTime(this.state.selectedEvent) : null}

  //       </Modal.Description>
  //     </Modal.Content>
  //   </Modal>
  // }

  // showEditableModal = () => {
  //   return <Modal
  //     open={this.state.dialogOpen}
  //     onClose={() => this.setState({ dialogOpen: false })}
  //   >
  //     <Modal.Header>{this.state.selectedEvent ? this.state.selectedEvent.title : null}</Modal.Header>
  //     <Modal.Content >
  //       <Modal.Description>
  //         {/* <p>{this.state.selectedEvent.description}</p> */}
  //         {this.state.selectedEvent ? this.showPrettyStartAndEndTime(this.state.selectedEvent) : null}
  //         {this.showSelectedEventAttendees()}
  //       </Modal.Description>

  //       <Button content="delete" onClick={this.deleteSelectedEventHandeler} />
  //     </Modal.Content>
  //   </Modal>
  // }




  // createAppointmentSlotModal = () => {

  //   let e = this.state.newAppointment

  //   return <Modal
  //     open={this.state.creatingEvent}
  //     onClose={() => this.setState({ creatingEvent: false })}
  //   >
  //     <Modal.Header>Create Event</Modal.Header>
  //     <Modal.Content >
  //       <Segment placeholder>
  //         <Grid columns={2} stackable textAlign='center'>
  //           <Divider vertical>Or</Divider>

  //           <Grid.Row verticalAlign='middle'>

  //             <Grid.Column>
  //               <Header icon>
  //                 <Icon name='bookmark' />
  //                 Book New Appointment
  //         </Header>
  //               {this.appointmentTimeSetter(e)}
  //               <Divider hidden />

  //               <div>
  //                 {this.showNewAppointmentAttendees()}
  //               </div>
  //               <Divider hidden />
  //               {this.userPickerDropDown()}
  //               <Divider hidden />
  //               <Button primary onClick={this.createEventHandeler}>Create</Button>
  //             </Grid.Column>

  //             <Grid.Column>
  //               <Header icon>
  //                 <Icon name='time' />
  //                 New Appointment Slot
  //         </Header>
  //               {this.appointmentTimeSetter(e)}
  //               <Divider hidden />
  //               <Button onClick={this.createEventHandeler} primary>Create</Button>
  //             </Grid.Column>
  //           </Grid.Row>
  //         </Grid>
  //       </Segment>
  //     </Modal.Content>

  //   </Modal >
  // }

  // appointmentTimeSetter = (selectedSlot) => {
  //   if (!selectedSlot) return null

  //   let endTime = moment(selectedSlot.end)
  //   let startTime = moment(selectedSlot.start)

  //   let endTimeOptions = [endTime]
  //   let startTimeOptions = [startTime]


  //   for (let i = 0; i < 22; i++) {
  //     let addEndTime = moment(endTimeOptions[endTimeOptions.length - 1]).add(30, 'm')
  //     let subEndTime = moment(endTimeOptions[0]).subtract(30, 'm')

  //     let addStartTime = moment(startTimeOptions[startTimeOptions.length - 1]).add(30, 'm')
  //     let subStartTime = moment(startTimeOptions[0]).subtract(30, 'm')


  //     startTimeOptions = [subStartTime, ...startTimeOptions, addStartTime]
  //     endTimeOptions = [subEndTime, ...endTimeOptions, addEndTime]
  //   }

  //   let formattedendEndTimeOptions = endTimeOptions.map(op => {
  //     return {
  //       key: op._d,
  //       text: moment(op._d).format("h:mm a"),
  //       value: op._d.toString(),
  //     }
  //   })

  //   let formattedendStartTimeOptions = startTimeOptions.map(op => {
  //     return {
  //       key: op._d,
  //       text: moment(op._d).format("h:mm a"),
  //       value: op._d.toString(),
  //     }
  //   })

  //   return <>
  //     <h4>{moment(selectedSlot.start).format('Do MMMM  YYYY')}</h4>
  //     {/* {moment(selectedSlot.start).format('h:mm a')}  */}
  //     <Dropdown
  //       inline
  //       options={formattedendStartTimeOptions}
  //       defaultValue={formattedendStartTimeOptions[22].value}
  //       upward={false}
  //       scrolling
  //       onChange={(e, d) => this.setState({ newAppointment: { ...this.state.newAppointment, slots: [selectedSlot.start, new Date(d.value)] } })}
  //     />
  //     to{" "}
  //     <Dropdown
  //       inline
  //       options={formattedendEndTimeOptions}
  //       defaultValue={formattedendEndTimeOptions[22].value}
  //       upward={false}
  //       scrolling
  //       onChange={(e, d) => this.setState({ newAppointment: { ...this.state.newAppointment, slots: [selectedSlot.start, new Date(d.value)] } })}
  //     />
  //   </>
  // }

  // showSelectedEventAttendees = () => {
  //   if (this.state.selectedEvent && this.state.selectedEvent.attendees) {
  //     return this.showAttendeeLabels(this.state.selectedEvent.attendees)
  //   }
  //   return null
  // }

  // showNewAppointmentAttendees = () => {
  //   if (this.state.newAppointment && this.state.newAppointment.attendees) {
  //     return this.showAttendeeLabels(this.state.newAppointment.attendees)
  //   }
  //   return null
  // }

  // showAttendeeLabels = (users) => {
  //   return users.map(u => <Label key={u.id}>
  //     <Icon name='user' />
  //     {u.first_name + " " + u.last_name}
  //     <Icon name='delete' onClick={() => this.removeAttendeeFromNewAppointment(u)} />
  //   </Label>
  //   )
  // }

  // showPrettyStartAndEndTime = (selectedEvent) => {

  //   return <>
  //     <h4>{moment(selectedEvent.start).format('Do MMMM  YYYY')}</h4>
  //     <p>{moment(selectedEvent.start).format('h:mm a')} to {moment(selectedEvent.end).format('h:mm a')}</p>
  //   </>
  // }



  // showAppropriateModal = () => {


  //   if (this.props.user) {
  //     if (this.props.user.admin === true) return this.showEditableModal()

  //     if (this.props.bookable) return this.showBookableModal()
  //     return this.showInfoModal()
  //   }

  //   return this.showMustCreateAccountModal()





  // }

  console.log(props)
  let allViews = Object.keys(Views).map(k => Views[k])

  const CalendarContainer = styled.div`
        grid-area: panel;
        height: 100vh;
      max-width: ${props => props.fullWidth ? "95vw" : "60vw"};
      width: 100rem;
      min-height: 50rem;
      justify-self: center;
  
     @media (max-width: 50rem) {
        max-width: 95vw;
    ;
  }

}
    `

  return <>
    <CalendarContainer >
      {/* {this.state.showCheckout ? <Checkout onToken={this.bookAppointment} /> : null} */}
      <BigCalendar
        components={components}
        selectable
        localizer={localizer}
        events={props.events}
        defaultView={Views.WEEK}
        scrollToTime={new Date(2050, 1, 1)}
        defaultDate={new Date()}
        onSelectEvent={props.onSelectEvent}
        popup
        step={30}
        timeslots={1}
        startAccessor="start"
        endAccessor="end"
        onSelectSlot={props.onSelectSlot}
        min={new Date(2050, 1, 1, 9)}
        max={new Date(2050, 1, 1, 22)}

      />

    </CalendarContainer>

    {/* {this.showAppropriateModal()} */}

    {/* {this.createAppointmentSlotModal()} */}





  </ >
}



export default withRouter((Calendar))

