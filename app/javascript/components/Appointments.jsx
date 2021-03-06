import React, { useState, useEffect } from 'react'
import {
  Container,
  Divider,
  Button,
  Modal,
  Form,
  Header,
  Message as StaticMessage,
  Loader,
  Dimmer
} from 'semantic-ui-react'
import styled from 'styled-components'
import { CalendarContainer, ModalContent } from './StyledComponents'
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import Event from './Event'
import Message from './Message'

export const isUserAnAttendeeOfEvent = (event, user) => {
  if (event.attendees === null) return false
  for (const att of event.attendees) {
    if (att.email === user.email) return true
  }
}

export const isInTheFuture = event => {
  const now = new Date()
  const eventTime = new Date(event.start_time)
  return now < eventTime
}

export const FullWidthCalendarContainer = styled(Container)`
  display: grid !Important;
  grid-template-columns: 1fr;
  grid-template-areas: "heading" "divider" "panel";
  justify-content: center;
`

const uuidv1 = require('uuid/v1')

function Appointments (props) {
  const localizer = momentLocalizer(moment)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [eventModalOpen, setEventModalOpen] = useState(false)
  const [booking, setBooking] = useState(false)

  const [loading, setLoading] = useState(true)
  const [canceling, setCanceling] = useState(false)
  const [confirmation, setConfirmation] = useState(null)
  const [events, setEvents] = useState([])
  const [notifications, setNotifications] = useState([])

  const [calRange, setCalRange] = useState({
    start: moment().startOf('month')._d,
    end: moment()
      .add(1, 'months')
      .endOf('month')._d
  })

  const csrfToken = document.querySelectorAll('meta[name="csrf-token"]')[0]
    .content

  useEffect(() => {
    getEventsInRange()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (notifications === []) return () => clearTimeout(timer)
      if (notifications.length > 1) {
        const newVal = [...notifications]
        newVal.pop()
        setNotifications(newVal)
      } else if (notifications.length === 1) {
        setNotifications([])
      } else {
        return () => clearTimeout(timer)
      }
    }, 5000)
    return () => clearTimeout(timer)
  }, [notifications])

  const rangeChangeHandler = e => {
    // is this month, week, or day view?
    let start
    let end

    // month view
    if (e.start && e.end) {
      start = e.start
      end = e.end
    }
    // day view
    else if (e.length === 1) {
      start = moment(e[0]).startOf('month')._d
      end = moment(e[0]).endOf('month')._d
    }
    // week view
    else if (e.length > 1) {
      start = moment(e[0]).startOf('month')._d
      end = moment(e[e.length - 1]).endOf('month')._d
    }

    if (end > calRange.end) {
      getEventsInRange({ start: calRange.end, end: end })
      return setCalRange({ start: calRange.start, end })
    }

    if (start < calRange.start) {
      getEventsInRange({ start: start, end: calRange.start })
      return setCalRange({ start, end: calRange.end })
    }
  }

  const getEventsInRange = async ({
    start = calRange.start,
    end = calRange.end,
    reset = false
  } = {}) => {
    setLoading(true)
    let url

    if (props.current_user) {
      url = `${process.env.BASE_URL}/api/v1/events/current_user/${start}/${end}`
    } else {
      url = `${process.env.BASE_URL}/api/v1/events/public/${start}/${end}`
    }

    try {
      let res = await fetch(url, {
        headers: {
          'X-CSRF-Token': csrfToken,
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      })

      res = await res.json()
      setEvents([...events.concat(res.events)])
      setLoading(false)
    } catch (error) {
      setNotifications([
        {
          id: new Date(),
          type: 'alert',
          message:
            'Could not get events. Please check your internet connection and try again. If this problem persists please contact your system administrator.'
        },
        ...notifications
      ])
      console.error('Error:', error)
      setLoading(false)
    }
  }

  // fetch handlers
  const bookAppointment = async () => {
    setBooking(true)
    const res = await fetch(`${process.env.BASE_URL}/api/v1/events/book`, {
      method: 'POST',
      body: JSON.stringify({
        event: selectedEvent
      }),
      headers: {
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
    try {
      const json = await res.json()
      const currentEvents = [...events].filter(e => e.id !== json.editedEvent.id)
      setEvents(currentEvents.concat(json.editedEvent))
      setBooking(false)
      setEventModalOpen(false)
      setConfirmation({ type: 'booking', event: json.editedEvent })
      setNotifications([
        {
          id: new Date(),
          type: 'notice',
          message: 'Appointment successfully booked!'
        },
        ...notifications
      ])
    } catch (error) {
      setNotifications([
        {
          id: new Date(),
          type: 'alert',
          message:
            'Could not book appointment. Please refresh the page and try again. If this problem persists please contact your system administrator.'
        },
        ...notifications
      ])
      console.error('Error:', error)
      setBooking(false)
      setEventModalOpen(false)
      setSelectedEvent(null)
    }
    setSelectedEvent(null)
  }

  const cancelEvent = async () => {
    setCanceling(true)
    const currentTime = new Date()
    const eventTime = new Date(selectedEvent.start_time)
    const hours = (eventTime.getTime() - currentTime.getTime()) / 3600000
    const inGracePeriod = hours > 24

    const res = await fetch(`${process.env.BASE_URL}/api/v1/events/cancel`, {
      method: 'POST',
      body: JSON.stringify({
        inGracePeriod,
        event: selectedEvent
      }),
      headers: {
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
    try {
      const json = await res.json()
      const currentEvents = [...events].filter(e => e.id !== json.editedEvent.id)
      setEvents(currentEvents.concat(json.editedEvent))
      setEventModalOpen(false)
      setCanceling(false)
      setConfirmation({ type: 'cancelation', event: { ...json.editedEvent } })
      setNotifications([
        {
          id: new Date(),
          type: 'warning',
          message: 'Appointment successully canceled'
        },
        ...notifications
      ])
    } catch (error) {
      setNotifications([
        {
          id: new Date(),
          type: 'alert',
          message:
            'Could not cancel this event. Please try again. If this problem persists please contact your system administrator.'
        },
        ...notifications
      ])
      console.error('Error:', error)
      setEventModalOpen(false)
      setCanceling(false)
    }
    setSelectedEvent(null)
  }

  const showPrettyStartAndEndTime = selectedEvent => {
    return (
      <>
        <Header textAlign='center' as='h2'>
          {moment(selectedEvent.start_time).format('Do MMMM  YYYY')}
          <Header.Subheader>
            {moment(selectedEvent.start_time).format('h:mm a')} to{' '}
            {moment(selectedEvent.end_time).format('h:mm a')}
          </Header.Subheader>
        </Header>
      </>
    )
  }

  const cancelEventConfirm = event => {
    const currentTime = new Date()
    const eventTime = new Date(event.start_time)
    const hours = (eventTime.getTime() - currentTime.getTime()) / 3600000
    const inGracePeriod = hours > 24

    return (
      <Modal
        key={event.id}
        basic
        size='small'
        trigger={<Button loading={canceling} content='Cancel Appointment' />}
        header='Cancel Event'
        content={
          <ModalContent>
            {inGracePeriod ? (
              <p>
                Are you sure you want to cancel this appointment? As this is
                more than 24 hours notice you won't be charged.
              </p>
            ) : (
              <p>
                Are you sure you want to cancel this appointment? As this is
                less than 24 hours notice you will be charged in full.
              </p>
            )}
          </ModalContent>
        }
        actions={[
          {
            key: 'neverMind',
            content: 'Never Mind',
            positive: true,
            basic: true
          },
          {
            key: 'cancelEvent',
            basic: true,
            negative: true,
            content: 'Yes, Cancel Appointment',
            onClick: () => cancelEvent()
          }
        ]}
      />
    )
  }

  const maybeShowCancelButtons = event => {
    if (
      event.extended_properties &&
      event.extended_properties.private &&
      event.extended_properties.private.cancelation === 'true'
    ) {
      return null
    }
    if (isInTheFuture(event)) return cancelEventConfirm(event)

    return null
  }

  const maybeShowSkypeOrTelehealthButton = event => {
    if (
      event.extended_properties &&
      event.extended_properties.private &&
      event.extended_properties.private.telehealth === 'true'
    ) {
      return {
        key: 'openTelehealth',
        content: 'Start Telehealth Appointment',
        primary: true,
        onClick: () => window.open('https://innerwisdompsychology.coviu.com/room/@susanstephenson', '_blank')
      }
    }

    if (
      event.extended_properties &&
      event.extended_properties.private &&
      event.extended_properties.private.skype === 'true'
    ) {
      return {
        key: 'openSkype',
        content: 'Start Skype Appointment',
        primary: true,
        onClick: () => window.open('skype:susanjmct?call', '_blank')
      }
    }

    return null
  }

  const showSelectedEventModal = () => {
    if (!selectedEvent) return null

    // anonymous event view
    if (!props.current_user) {
      return (
        <>
          <Modal
            open={eventModalOpen}
            header={selectedEvent.title}
            content={
              <ModalContent>
                <StaticMessage
                  warning
                  header={showPrettyStartAndEndTime(selectedEvent)}
                  content={
                    <p>
                      To book an appointment you must first{' '}
                      <a href={`${process.env.BASE_URL}/users/sign_in`}>
                        sign in
                      </a>
                      . If you do not have an account yet you can{' '}
                      <a href={`${process.env.BASE_URL}/users/sign_up`}>
                        sign up
                      </a>{' '}
                      for free.
                    </p>
                  }
                />
              </ModalContent>
            }
            actions={[
              {
                key: 'Close',
                content: 'Close',
                onClick: () => setEventModalOpen(false)
              }
            ]}
          />
        </>
      )
    }

    // logged in and attended
    if (
      props.current_user &&
      isUserAnAttendeeOfEvent(selectedEvent, props.current_user)
    ) {
      return (
        <Modal
          open={eventModalOpen}
          header={generateEventTitleWithMedium(selectedEvent)}
          content={
            <ModalContent>
              {showPrettyStartAndEndTime(selectedEvent)}
              <p>{selectedEvent.description}</p>
              <small>
                If you wish to reschedule this appointment simply cancel this
                one and choose another.
              </small>
            </ModalContent>
          }
          actions={[
            maybeShowSkypeOrTelehealthButton(selectedEvent),
            maybeShowCancelButtons(selectedEvent),
            {
              key: 'Close',
              content: 'Close',
              onClick: () => setEventModalOpen(false)
            }
          ]}
        />
      )
    }

    // logged in and not attending - bookable
    if (props.current_user) {
      return (
        <Modal
          open={eventModalOpen}
          header={selectedEvent.title}
          content={
            <ModalContent>
              {showPrettyStartAndEndTime(selectedEvent)}
              {selectedEvent.calendar.id ===
              process.env.CONSULTS_CALENDAR_ID ? (
                <>
                  <p>
                    Would you like to book a <b>free</b> phone call consultation
                    at this time?
                  </p>
                  <p>
                    After this consultation you will be able to reserve
                    in-person and skype appointments.
                  </p>
                </>
                ) : (
                  <>
                    <p>Would you like to book an appointment at this time?</p>
                    <p>
                    If this is intended to be a skype appointment, check the
                    toggle below.
                    </p>

                    <Form>
                      <Form.Group inline>
                        <Form.Radio
                          label='Skype'
                          name='radioGroup'
                          value='that'
                          checked={
                            selectedEvent.extended_properties.private.skype ===
                          'true'
                          }
                          onChange={() => handleMediumChange('skype', selectedEvent, setSelectedEvent)}
                        />{' '}
                        <Form.Radio
                          label='Phone'
                          name='radioGroup'
                          value='that'
                          checked={
                            selectedEvent.extended_properties.private.phone ===
                          'true'
                          }
                          onChange={() => handleMediumChange('phone', selectedEvent, setSelectedEvent)}
                        />{' '}
                        <Form.Radio
                          label='Telehealth'
                          name='radioGroup'
                          value='that'
                          checked={
                            selectedEvent.extended_properties.private.telehealth ===
                          'true'
                          }
                          onChange={() => handleMediumChange('telehealth', selectedEvent, setSelectedEvent)}
                        />
                        {/* <Form.Radio
                        label='In Person'
                        name='radioGroup'
                        value='that'
                        checked={
                          selectedEvent.extended_properties.private.skype ===
                          "false"
                        }
                        onChange={() => toggleSkypeHandler()}
                      /> */}
                      </Form.Group>
                    </Form>
                  </>
                )}
              <Divider hidden />
              <p>
                Note that appointments canceled with less than 24 hours notice
                must be paid in full.
              </p>
            </ModalContent>
          }
          actions={[
            {
              key: 'book',
              disabled: isSelectedEventInThePastOrIsNoAppointmentTypeSelected(),
              loading: booking,
              content: 'Book Appointment',
              onClick: () => bookAppointment()
            },
            {
              key: 'Close',
              content: 'Close',
              onClick: () => setEventModalOpen(false)
            }
          ]}
        />
      )
    }
  }

  const isSelectedEventInThePastOrIsNoAppointmentTypeSelected = () => {
    if (new Date(selectedEvent.start_time) > new Date()) return false

    return true
  }

  const generateEventTitleWithMedium = (event) => {
    if (selectedEvent.extended_properties.private.skype === 'true') {
      return `${event.title} | Skype Call`
    }
    if (selectedEvent.extended_properties.private.phone === 'true') {
      return `${event.title} | Phone Call`
    }
    if (selectedEvent.extended_properties.private.telehealth === 'true') {
      return `${event.title} | Telehealth`
    }
    return event.title
  }

  const handleMediumChange = (mediumName, resource, setResource) => {
    let medium = resource.extended_properties.private[mediumName]
    if (medium === 'true') medium = 'false'
    else medium = 'true'
    const newExtendedProperties = {
      ...resource.extended_properties.private,

      skype: mediumName === 'skype' ? medium : 'false',
      phone: mediumName === 'phone' ? medium : 'false',
      telehealth: mediumName === 'telehealth' ? medium : 'false'
    }
    setResource({
      ...resource,
      extended_properties: { private: newExtendedProperties }
    })
  }

  const showConfirmationModal = () => {
    if (confirmation) {
      if (confirmation.type === 'booking') {
        return (
          <Modal
            defaultOpen
            onClose={() => setConfirmation(null)}
            header='Appointment Confirmed'
            content={
              <ModalContent>
                <p>
                  This is confirmation that your booking has been confirmed.
                  Here are the details. You will receive an email confirmation.
                </p>
                {showPrettyStartAndEndTime(confirmation.event)}
                <p>{confirmation.event.description}</p>
                <small>
                  If you wish to reschedule this appointment simply cancel this
                  one and choose another.
                </small>
              </ModalContent>
            }
            actions={[
              maybeShowSkypeOrTelehealthButton(confirmation.event),
              maybeShowCancelButtons(confirmation.event),
              {
                key: 'Close',
                content: 'Close',
                onClick: () => setConfirmation(null)
              }
            ]}
          />
        )
      }

      if (confirmation.type === 'cancelation') {
        return (
          <Modal
            defaultOpen
            onClose={() => setConfirmation(null)}
            header='Appointment Canceled'
            content={
              <ModalContent>
                <p>
                  This is confirmation that your appointment has been canceled.
                  Here are the details. You will receive an email confirmation.
                </p>
                {showPrettyStartAndEndTime(confirmation.event)}
                <p>{confirmation.event.location}</p>
              </ModalContent>
            }
            actions={['Close']}
          />
        )
      }
    } else return null
  }

  const selectEventHandler = event => {
    setSelectedEvent(event)
    setEventModalOpen(true)
  }

  return (
    <>
      <div style={{ position: 'fixed', right: '1rem', zIndex: '100' }}>
        {notifications.map(n => (
          <Message key={uuidv1()} message={n} />
        ))}
      </div>

      <FullWidthCalendarContainer fluid>
        <div style={{ width: '100%', maxWidth: '95vw', justifySelf: 'center' }}>
          {!props.current_user ? (
            <StaticMessage
              warning
              content={
                <p>
                  To book an appointment you must first{' '}
                  <a href={`${process.env.BASE_URL}/users/sign_in`}>sign in</a>.
                  If you do not have an account yet you can{' '}
                  <a href={`${process.env.BASE_URL}/users/sign_up`}>sign up</a>{' '}
                  for free.
                </p>
              }
            />
          ) : null}
          <h1>Appointments</h1>
          <p>
            To make a booking click on an appointment in the calendar below.
          </p>
          {props.current_user && props.current_user.approved === false ? (
            <p>
              Please choose a suitable time for your free 15 minute phone
              consultation. Once booked, Sue will call you at the arranged time.
              After your phone consult is completed and we have decided to go
              ahead you will be able to book full length Skype and in-person
              appointments.
            </p>
          ) : null}
        </div>
        <Divider hidden style={{ gridArea: 'divider' }} />

        <Dimmer.Dimmable as={CalendarContainer} fullWidth>
          <Dimmer blurring active={loading} inverted>
            <Loader inline active={loading} />
          </Dimmer>
          <BigCalendar
            components={{ event: Event }}
            startAccessor={event => new Date(event.start_time)}
            endAccessor={event => new Date(event.end_time)}
            selectable
            localizer={localizer}
            events={events}
            onSelectEvent={e => selectEventHandler(e)}
            popup
            step={15}
            timeslots={1}
            onSelecting={() => false}
            views={['month', 'day', 'week']}
            onRangeChange={e => rangeChangeHandler(e)}
            scrollToTime={moment()
              .startOf('hour')
              .subtract(1, 'hours')
              .toDate()}
          />
        </Dimmer.Dimmable>
      </FullWidthCalendarContainer>
      {showSelectedEventModal()}
      {showConfirmationModal()}
    </>
  )
}

export default Appointments
