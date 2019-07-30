import React from 'react';
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import { connect } from "react-redux"
import { Button, Container, Modal, Header, Image, Dropdown, Divider } from "semantic-ui-react"
import Checkout from './Checkout'


const localizer = momentLocalizer(moment)

// const ColoredDateCellWrapper = ({ children }) =>
//   React.cloneElement(React.Children.only(children), {
//     style: {
//       backgroundColor: 'lightblue',
//     },
//   })



class Calendar extends React.Component {

  constructor(props) {

    super(props)

    this.state = {
      selectedEvent: null,
      showCheckout: false,
      dialogOpen: false,
      creatingAppointmentSlot: false,
      newAppointment: null,
    }
  }


  createAppointmentSlotHandeler = () => {
    this.setState({ creatingAppointmentSlot: false })



    fetch(`${this.props.baseUrl}/create`, {
      method: "POST",
      body: JSON.stringify({
        event: this.state.newAppointment
      }),
      headers: {
        "X-CSRF-Token": this.state.csrfToken,
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

  appointmentTimeSetter = (selectedSlot) => {
    let endTime = moment(selectedSlot.end)
    let timeOptions = [endTime]

    for (let i = 0; i < 10; i++) {
      let newEndTime = moment(timeOptions[i]).add(30, 'm')
      timeOptions.push(newEndTime)
    }

    let formattedTimeOptions = timeOptions.map(op => {


      return {
        key: op._d,
        text: moment(op._d).format("h:mm a"),
        value: op._d.toString(),
      }
    })


    // return null

    return <>
      <h4>{moment(selectedSlot.start).format('Do MMMM  YYYY')}</h4>
      {moment(selectedSlot.start).format('h:mm a')} to{" "}
      <Dropdown
        inline
        options={formattedTimeOptions}
        defaultValue={formattedTimeOptions[0].value}
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

  createAppointmentSlotModal = () => {
    let e = this.state.newAppointment

    return <Modal
      open={this.state.creatingAppointmentSlot}
      onClose={() => this.setState({ creatingAppointmentSlot: false })}
    >
      <Modal.Header>Create Appointment Slot</Modal.Header>
      <Modal.Content >
        <Modal.Description>
          {e == null ?
            null
            :
            this.appointmentTimeSetter({ start: e.slots[0], end: e.slots[1] })

          }
        </Modal.Description>
        <Divider hidden />
        <Button onClick={this.createAppointmentSlotHandeler}>Create</Button>
      </Modal.Content>

    </Modal>
  }

  showAppropriateModal = () => {

    if (this.props.user) {
      if (this.props.bookable) return this.showBookableModal()
      return this.showInfoModal()
    }

    return this.showMustCreateAccountModal()





  }

  selectSlotHandeler = (e) => {
    if (this.props.user.admin) this.setState({ creatingAppointmentSlot: true, newAppointment: e })

    else console.log("not allowed")
  }



  render() {


    let allViews = Object.keys(Views).map(k => Views[k])

    return <>
      <div style={{ gridArea: "panel", height: "100rem", maxHeight: "80vh" }}>
        {this.state.showCheckout ? <Checkout onToken={this.bookAppointment} /> : null}
        <BigCalendar
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

      </div>

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

