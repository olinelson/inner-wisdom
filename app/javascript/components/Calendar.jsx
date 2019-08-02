import React from 'react';
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import { connect } from "react-redux"
import { Button, Container, Label, Grid, Search, Icon, Segment, Radio, Modal, Header, Image, Dropdown, Divider } from "semantic-ui-react"
import Checkout from './Checkout'
import styled from "styled-components"
import CustomEvent from "./CustomEvent"


const localizer = momentLocalizer(moment)

let components = {
  event: CustomEvent, // used by each view (Month, Day, Week)
}


class Calendar extends React.Component {

  constructor(props) {

    super(props)

    this.state = {
      selectedEvent: null,
      showCheckout: false,
      dialogOpen: false,
      creatingEvent: false,
      newAppointment: null,
    }
  }

  deleteSelectedEventHandeler = () => {
    fetch(`${this.props.baseUrl}/delete`, {
      method: "DELETE",
      body: JSON.stringify({
        event: this.state.selectedEvent
      }),
      headers: {
        "X-CSRF-Token": this.props.csrfToken,
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest"
      }
    })
      .then(() => {
        let events = [...this.props.events].filter(e => e.id !== this.state.selectedEvent.id)
        this.props.dispatch({ type: "SET_EVENTS", value: events })
        this.setState({ dialogOpen: false })
      })
  }


  createEventHandeler = () => {
    // console.log("hello", e)
    this.setState({ creatingEvent: false })
    fetch(`${this.props.baseUrl}/create`, {
      method: "POST",
      body: JSON.stringify({
        event: this.state.newAppointment
      }),
      headers: {
        "X-CSRF-Token": this.props.csrfToken,
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest"
      }
    })
      .then(response => response.json())
      .then((e) => {

        let formattedEvent = {
          id: e.event.id,
          title: e.event.title,
          start: new Date(e.event.start_time),
          end: new Date(e.event.end_time),
          allDay: false,
          attendees: e.event.attendees
        }
        return formattedEvent
      })
      .then(formattedEvent => this.props.dispatch({ type: "SET_EVENTS", value: [...this.props.events, formattedEvent] }))
  }

  bookAppointment = () => {


    let user = this.props.user
    let event = this.state.selectedEvent

    fetch(`${this.props.baseUrl}/edit`, {
      method: "POST",
      body: JSON.stringify({
        event,
        user
      }),
      headers: {
        "X-CSRF-Token": this.props.csrfToken,
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest"
      }
    })
      .then(response => response.json())
      .then(e => {
        let formattedEvents = e.events.map(event => {
          return {
            id: event.id,
            title: event.title,
            start: new Date(event.start_time),
            end: new Date(event.end_time),
            allDay: false,
            attendees: event.attendees
          }

        })
        return formattedEvents
      })
      .then(formattedEvents => this.props.dispatch({ type: "SET_EVENTS", value: formattedEvents }))
      .then(() => this.props.history.push('/myAccount'))
      .then(e => this.props.dispatch({ type: "SET_MY_ACCOUNT_PANEL", value: "calendar" }))
  }

  handleEventClick = (event) => {
    // alert(event)
    // this.setState({ selectedEvent: event, showCheckout: true })
    this.setState({ selectedEvent: event, dialogOpen: true })



  }

  showMustCreateAccountModal = () => {
    return <Modal
      open={this.state.dialogOpen}
      onClose={() => this.setState({ dialogOpen: false })}
    >
      <Modal.Header>Book Appointment</Modal.Header>
      <Modal.Content image>
        {/* <Image wrapped size='medium' src='/images/avatar/large/rachel.png' /> */}
        <Modal.Description>
          <Header>{this.state.selectedEvent ? this.state.selectedEvent.title : null}</Header>

          <p>To Book an Appointment you must <a href={`${this.props.baseUrl}/users/sign_up`}>Create an Account</a></p>

        </Modal.Description>
      </Modal.Content>
    </Modal>
  }

  showBookableModal = () => {
    return <Modal
      open={this.state.dialogOpen}
      onClose={() => this.setState({ dialogOpen: false })}
    >
      <Modal.Header>Book Appointment</Modal.Header>
      <Modal.Content image>
        {/* <Image wrapped size='medium' src='/images/avatar/large/rachel.png' /> */}
        <Modal.Description>
          <Header>{this.state.selectedEvent ? this.state.selectedEvent.title : null}</Header>

          <Checkout email={this.props.user.email} ammount={8000} onToken={this.bookAppointment} />
        </Modal.Description>
      </Modal.Content>
    </Modal>
  }

  showInfoModal = () => {
    return <Modal
      open={this.state.dialogOpen}
      onClose={() => this.setState({ dialogOpen: false })}
    >
      <Modal.Header>Appointment Confirmed</Modal.Header>
      <Modal.Content >
        <Modal.Description>
          <Header>{this.state.selectedEvent ? this.state.selectedEvent.title : null}</Header>
          {/* <p>{this.state.selectedEvent.description}</p> */}
          {this.state.selectedEvent ? this.showPrettyStartAndEndTime(this.state.selectedEvent) : null}

        </Modal.Description>
      </Modal.Content>
    </Modal>
  }

  showEditableModal = () => {
    return <Modal
      open={this.state.dialogOpen}
      onClose={() => this.setState({ dialogOpen: false })}
    >
      <input value={this.state.selectedEvent ? this.state.selectedEvent.title : null} />
      <Modal.Content >
        <Modal.Description>
          {/* <p>{this.state.selectedEvent.description}</p> */}
          {this.state.selectedEvent ? this.showPrettyStartAndEndTime(this.state.selectedEvent) : null}

        </Modal.Description>
        <Button content="delete" onClick={this.deleteSelectedEventHandeler} />
      </Modal.Content>
    </Modal>
  }

  appointmentTimeSetter = (selectedSlot) => {

    let endTime = moment(selectedSlot.end)
    let startTime = moment(selectedSlot.start)

    let endTimeOptions = [endTime]
    let startTimeOptions = [startTime]


    for (let i = 0; i < 22; i++) {
      let addEndTime = moment(endTimeOptions[endTimeOptions.length - 1]).add(30, 'm')
      let subEndTime = moment(endTimeOptions[0]).subtract(30, 'm')

      let addStartTime = moment(startTimeOptions[startTimeOptions.length - 1]).add(30, 'm')
      let subStartTime = moment(startTimeOptions[0]).subtract(30, 'm')


      startTimeOptions = [subStartTime, ...startTimeOptions, addStartTime]
      endTimeOptions = [subEndTime, ...endTimeOptions, addEndTime]
    }

    let formattedendEndTimeOptions = endTimeOptions.map(op => {
      return {
        key: op._d,
        text: moment(op._d).format("h:mm a"),
        value: op._d.toString(),
      }
    })

    let formattedendStartTimeOptions = startTimeOptions.map(op => {
      return {
        key: op._d,
        text: moment(op._d).format("h:mm a"),
        value: op._d.toString(),
      }
    })


    // return null

    return <>
      <h4>{moment(selectedSlot.start).format('Do MMMM  YYYY')}</h4>
      {/* {moment(selectedSlot.start).format('h:mm a')}  */}
      <Dropdown
        inline
        options={formattedendStartTimeOptions}
        defaultValue={formattedendStartTimeOptions[22].value}
        upward={false}
        scrolling
        onChange={(e, d) => this.setState({ newAppointment: { ...this.state.newAppointment, slots: [selectedSlot.start, new Date(d.value)] } })}
      />
      to{" "}
      <Dropdown
        inline
        options={formattedendEndTimeOptions}
        defaultValue={formattedendEndTimeOptions[22].value}
        upward={false}
        scrolling
        onChange={(e, d) => this.setState({ newAppointment: { ...this.state.newAppointment, slots: [selectedSlot.start, new Date(d.value)] } })}
      />
    </>
  }

  showPrettyStartAndEndTime = (selectedEvent) => {

    return <>
      <h4>{moment(selectedEvent.start).format('Do MMMM  YYYY')}</h4>
      <p>{moment(selectedEvent.start).format('h:mm a')} to {moment(selectedEvent.end).format('h:mm a')}</p>
    </>
  }



  createAppointmentSlotModal = () => {

    let e = this.state.newAppointment

    return <Modal
      open={this.state.creatingEvent}
      onClose={() => this.setState({ creatingEvent: false })}
    >
      <Modal.Header>Create Event</Modal.Header>
      <Modal.Content >

        {/* <Modal.Description>
          {e == null ?
            null
            :
            this.appointmentTimeSetter({ start: e.start, end: e.end })

          }
        </Modal.Description>
        <Divider hidden />
        <Button onClick={this.createEventHandeler}>Create</Button> */}
        <Segment placeholder>
          <Grid columns={2} stackable textAlign='center'>
            <Divider vertical>Or</Divider>

            <Grid.Row verticalAlign='middle'>

              <Grid.Column>
                <Header icon>
                  <Icon name='bookmark' />
                  Book New Appointment
          </Header>
                {e == null ?
                  null
                  :
                  this.appointmentTimeSetter({ start: e.start, end: e.end })

                }
                <div>
                  {this.state.newAppointment && this.state.newAppointment.attendees ? this.state.newAppointment.attendees.map(u => <Label icon="user"><Icon name='user' />{u.first_name + " " + u.last_name} <Icon name='delete' onClick={() => this.removeAttendeeFromNewAppointment(u)} /></Label>) : null}
                </div>
                {this.userPickerDropDown()}
                <Divider hidden />
                <Button primary onClick={this.createEventHandeler}>Create</Button>
              </Grid.Column>

              <Grid.Column>
                <Header icon>
                  <Icon name='time' />
                  New Appointment Slot
          </Header>
                {e == null ?
                  null
                  :
                  this.appointmentTimeSetter({ start: e.start, end: e.end })

                }
                <Divider hidden />
                <Button primary>Create</Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </Modal.Content>

    </Modal >
  }

  showAppropriateModal = () => {


    if (this.props.user) {
      if (this.props.user.admin === true) return this.showEditableModal()

      if (this.props.bookable) return this.showBookableModal()
      return this.showInfoModal()
    }

    return this.showMustCreateAccountModal()





  }

  selectSlotHandeler = (e) => {
    if (this.props.user.admin && this.props.creatable) this.setState({ creatingEvent: true, newAppointment: e })

    else console.log("not allowed")
  }

  userPickerDropDown = () => {
    return <Dropdown
      text='Add user'
      icon='add user'
      floating
      labeled
      button
      className='icon'
    >
      <Dropdown.Menu>
        <Dropdown.Header content='Clients' />
        {this.props.users.map(user => (
          <Dropdown.Item onClick={() => this.addAttendeeToNewAppointment(user)} key={user.id} text={`${user.first_name} ${user.last_name}`} icon="user circle" />
        ))}
      </Dropdown.Menu>
    </Dropdown>
  }

  addAttendeeToNewAppointment = (user) => {
    console.log(user)
    let attendees = this.state.newAppointment.attendees

    if (attendees == null) this.setState({ newAppointment: { ...this.state.newAppointment, attendees: [user] } })

    else this.setState({ newAppointment: { ...this.state.newAppointment, attendees: [...this.state.newAppointment.attendees, user] } })
  }

  removeAttendeeFromNewAppointment = user => {
    console.log(user)
  }

  render() {
    console.log(this.state.newAppointment)

    let allViews = Object.keys(Views).map(k => Views[k])

    const CalendarContainer = styled.div`
        grid-area: panel;
        height: 100vh;
    max-width: ${props => this.props.fullWidth ? "95vw" : "60vw"};
      width: 100rem;
      min-height: 50rem;
      justify-self: center;
  
     @media (max-width: 50rem) {
        max - width: 95vw;
    ;
  }

}
    `

    return <>
      <CalendarContainer >
        {this.state.showCheckout ? <Checkout onToken={this.bookAppointment} /> : null}
        <BigCalendar
          components={components}
          selectable
          localizer={localizer}
          events={this.props.events}
          defaultView={Views.WEEK}
          scrollToTime={new Date(2050, 1, 1)}
          defaultDate={new Date()}
          onSelectEvent={this.handleEventClick}
          popup
          step={30}
          timeslots={1}
          startAccessor="start"
          endAccessor="end"
          onSelectSlot={this.selectSlotHandeler}
          min={new Date(2050, 1, 1, 9)}
          max={new Date(2050, 1, 1, 22)}

        />

      </CalendarContainer>

      {this.showAppropriateModal()}

      {this.createAppointmentSlotModal()}





    </ >
  }
}
const mapStateToProps = (state) => ({
  user: state.user,
  baseUrl: state.baseUrl,
  csrfToken: state.csrfToken
})

export default connect(mapStateToProps)(Calendar)

