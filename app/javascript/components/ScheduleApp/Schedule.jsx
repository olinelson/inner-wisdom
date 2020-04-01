import React, { useState, useEffect } from 'react'

// components / styles
import {
  Divider,
  Modal,
  Popup,
  Dimmer,
  Button,
  Input,
  Label,
  Icon,
  Segment,
  Dropdown,
  Checkbox,
  Form,
  Loader
} from 'semantic-ui-react'
import {
  BusinessEventSegment,
  CalendarContainer,
  ModalContent
} from '../StyledComponents'
import { FullWidthCalendarContainer } from '../Appointments'
import Event from '../Event'
import UserPickerDropDown from '../UserPickerDropDown'

import ScheduleNotificationManager from './ScheduleNotificationsManager'

// packages
import moment from 'moment'
import DayPicker from 'react-day-picker'
import 'react-day-picker/lib/style.css'
import TimePicker from 'rc-time-picker'
import 'rc-time-picker/assets/index.css'
import {
  Calendar as BigCalendar,
  momentLocalizer,
  Views
} from 'react-big-calendar'

const localizer = momentLocalizer(moment)

const repeatOptions = [
  { key: 'norepeat', value: null, text: 'no repeat' },
  { key: 'daily', value: 'daily', text: 'daily' },
  { key: 'weekly', value: 'weekly', text: 'weekly' },
  { key: 'monthly', value: 'monthly', text: 'monthly' },
  { key: 'yearly', value: 'yearly', text: 'yearly' }
]

function Schedule (props) {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState([])
  const [notifications, setNotifications] = useState([])

  const [calRange, setCalRange] = useState({
    start: moment()
      .startOf('month')
      .subtract(1, 'months')._d,
    end: moment()
      .add(1, 'months')
      .endOf('month')._d
  })

  const csrfToken = document.querySelectorAll('meta[name="csrf-token"]')[0]
    .content

  useEffect(() => {
    getEventsInRange()
  }, [])

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

    try {
      let res = await fetch(
        `${process.env.BASE_URL}/api/v1/events/schedule/${start}/${end}`
      )
      res = await res.json()

      if (reset) {
        setEvents(res.events)
      } else {
        setEvents([...events.concat(res.events)])
      }

      setLoading(false)
    } catch (error) {
      setNotifications([
        {
          id: new Date(),
          type: 'alert',
          message:
            'Could not get events. Check your internet connection and try again. If this problem persists please contact your system administratores.',
          expiresAt: moment().add(5, 'seconds')
        },
        ...notifications
      ])
      console.error('Error:', error)
      setLoading(false)
    }
  }

  // fetch handlers
  const createEventHandler = async (
    isAppointmentSlot = false,
    isConsultSlot = false
  ) => {
    setEvents([...events, { ...selectedSlot, placeholder: true }])

    setSelectedSlot(null)
    const event = { ...selectedSlot }
    const res = await fetch(`${process.env.BASE_URL}/api/v1/events/create`, {
      method: 'POST',
      body: JSON.stringify({
        event: event,
        appointmentSlot: isAppointmentSlot,
        consultSlot: isConsultSlot
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
      const currentEvents = [...events].filter(e => e.id !== event.id)
      setEvents([...currentEvents, json.newEvent])
      setNotifications([
        {
          id: new Date(),
          type: 'notice',
          message: 'Event successfully created.',
          expiresAt: moment().add(5, 'seconds')
        },
        ...notifications
      ])
      if (event.recurrence) getEventsInRange({ reset: true })
    } catch (error) {
      setNotifications([
        {
          id: new Date(),
          type: 'alert',
          message:
            'There was an error creating this event. Please try again. If this problem persists please contact your system administrator.',
          expiresAt: moment().add(5, 'seconds')
        },
        ...notifications
      ])
      console.error('Error:', error)
      setLoading(false)
      setEvents([...events])
    }
  }

  const updateSelectedEventHandler = async () => {
    const filteredEvents = [...events].filter(e => e.id !== selectedEvent.id)
    setEvents([...filteredEvents, { ...selectedEvent, placeholder: true }])

    setSelectedEvent(null)
    const res = await fetch(`${process.env.BASE_URL}/api/v1/events/update`, {
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
      const filteredEvents = [...events].filter(
        e => e.id !== json.editedEvent.id
      )
      setEvents([...filteredEvents, json.editedEvent])
      setNotifications([
        {
          id: new Date(),
          type: 'notice',
          message: 'Event successfully updated',
          expiresAt: moment().add(5, 'seconds')
        },
        ...notifications
      ])
    } catch (error) {
      setNotifications([
        {
          id: new Date(),
          type: 'alert',
          message:
            'There was an error updating this event. Please try again. If this problem persists please contact your system administrator.',
          expiresAt: moment().add(5, 'seconds')
        },
        ...notifications
      ])
      console.error('Error:', error)
      setEvents([...events])
    }
  }

  const deleteSelectedEventHandler = async () => {
    const filteredEvents = [...events].filter(e => e.id !== selectedEvent.id)
    setEvents([...filteredEvents, { ...selectedEvent, placeholder: true }])

    try {
      const res = await fetch(`${process.env.BASE_URL}/api/v1/events/delete`, {
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
      const filteredEvents = [...events].filter(e => e.id !== selectedEvent.id)
      setEvents(filteredEvents)
      setNotifications([
        {
          id: new Date(),
          type: 'warning',
          message: 'Event successfully deleted',
          expiresAt: moment().add(5, 'seconds')
        },
        ...notifications
      ])
    } catch (error) {
      setNotifications([
        {
          id: new Date(),
          type: 'alert',
          message:
            'There was an error deleting this event. Please try again. If this problem persists please contact your system administrator.',
          expiresAt: moment().add(5, 'seconds')
        },
        ...notifications
      ])
      const filteredEvents = [...events].filter(e => e.id !== selectedEvent.id)
      setEvents([...filteredEvents, { ...selectedEvent, placeholder: false }])
      console.error('Error:', error)
    }
  }

  const deleteRepeatsHandler = async () => {
    const filteredEvents = [...events].filter(e => e.id !== selectedEvent.id)
    setEvents([...filteredEvents, { ...selectedEvent, placeholder: true }])

    try {
      const res = await fetch(
        `${process.env.BASE_URL}/api/v1/events/delete_event_repeats`,
        {
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
        }
      )
      getEventsInRange({ reset: true })
      setNotifications([
        {
          id: new Date(),
          type: 'warning',
          message: 'Event successfully deleted',
          expiresAt: moment().add(5, 'seconds')
        },
        ...notifications
      ])
    } catch (error) {
      setNotifications([
        {
          id: new Date(),
          type: 'alert',
          message:
            'There was an error deleting this event. Please try again. If this problem persists please contact your system administrator.',
          expiresAt: moment().add(5, 'seconds')
        },
        ...notifications
      ])
      const filteredEvents = [...events].filter(e => e.id !== selectedEvent.id)
      setEvents([...filteredEvents, { ...selectedEvent, placeholder: false }])
      console.error('Error:', error)
    }
  }

  // attendee helper methods
  const addAttendeeToEvent = (user, event, setStateAction) => {
    const attendees = event.attendees
    if (attendees == null) setStateAction({ ...event, attendees: [user] })
    else setStateAction({ ...event, attendees: [...event.attendees, user] })
  }

  const removeAttendeeFromEvent = (user, event, setStateAction) => {
    const attendees = event.attendees.filter(a => a.email !== user.email)
    setStateAction({ ...event, attendees })
  }

  const showUserName = input => {
    const foundUser = props.users.find(u => u.email === input.email)
    if (foundUser) {
      return (
        <>
          <Icon name='user' />
          <span
            style={{ cursor: 'pointer' }}
            onClick={() => (window.location = `/clients/${foundUser.id}`)}
          >
            {foundUser.first_name + ' ' + foundUser.last_name}
          </span>
        </>
      )
    }

    return (
      <>
        <Icon name='question circle' />
        <span>{input.email}</span>
      </>
    )
  }

  const showEventAttendees = (event, onDelete, setStateAction) => {
    if (event && event.attendees) {
      const users = event.attendees
      return users.map(u => (
        <Label key={u.email} style={{ margin: '.1rem' }}>
          {showUserName(u)}
          <Icon
            name='delete'
            onClick={() => onDelete(u, event, setStateAction)}
          />
        </Label>
      ))
    }
    return null
  }

  // time setting components
  const changeDayHandler = (dt, event, setStateAction) => {
    const dateTime = new Date(dt)
    const newMonth = dateTime.getMonth()
    const newDay = dateTime.getDate()

    const start_time = new Date(event.start_time)
    start_time.setMonth(newMonth)
    start_time.setDate(newDay)

    const end_time = new Date(event.end_time)
    end_time.setMonth(newMonth)
    end_time.setDate(newDay)
    setStateAction({ ...event, start_time, end_time })
  }

  const eventTimeSetter = (event, setStateAction) => {
    const startTime = moment(event.start_time)
    const endTime = moment(event.end_time)

    let startTimeOptions = [startTime]
    let endTimeOptions = [endTime]

    for (let i = 0; i < 22; i++) {
      const addEndTime = moment(endTimeOptions[endTimeOptions.length - 1]).add(
        30,
        'm'
      )
      const subEndTime = moment(endTimeOptions[0]).subtract(30, 'm')

      const addStartTime = moment(
        startTimeOptions[startTimeOptions.length - 1]
      ).add(30, 'm')
      const subStartTime = moment(startTimeOptions[0]).subtract(30, 'm')

      startTimeOptions = [subStartTime, ...startTimeOptions, addStartTime]
      endTimeOptions = [subEndTime, ...endTimeOptions, addEndTime]
    }

    return (
      <>
        <Popup
          on='click'
          content={
            <DayPicker
              onDayClick={dt => changeDayHandler(dt, event, setStateAction)}
              selectedDays={new Date(event.start_time)}
            />
          }
          trigger={
            <h4 style={{ textAlign: 'center', cursor: 'pointer' }}>
              {moment(event.start_time).format('Do MMMM  YYYY')}
              <Icon name='caret down' />
            </h4>
          }
        />
        <span>
          <TimePicker
            showSecond={false}
            value={startTime}
            onChange={e => setStateAction({ ...event, start_time: e._d })}
            format='h:mm a'
            use12Hours
            inputReadOnly
          />
          <TimePicker
            showSecond={false}
            value={endTime}
            onChange={e => setStateAction({ ...event, end_time: e._d })}
            format='h:mm a'
            use12Hours
            inputReadOnly
          />
        </span>
      </>
    )
  }

  // creating event helpers
  const selectSlotHandler = e => {
    if (props.current_user.admin) {
      setSelectedSlot({
        ...e,
        title: '',
        location: '',
        start_time: e.start,
        end_time: e.end,
        personal: false,
        extended_properties: { private: { skype: 'true', phone: 'false', telehealth: 'false', paid: 'false' } }
      })
    }
  }

  const personalOrBusinessToggle = () => {
    const e = selectedSlot
    if (
      !e ||
      !props.current_user.google_calendar_email ||
      props.current_user.google_calendar_email.length < 1
    ) { return null }

    let label = null
    if (e.personal) {
      label = <Label color='green'>Personal</Label>
    } else {
      label = <Label color='blue'>Business</Label>
    }

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}
      >
        {label}
        <Checkbox
          onChange={() =>
            setSelectedSlot({
              ...selectedSlot,
              personal: !selectedSlot.personal
            })}
          toggle
        />
      </div>
    )
  }

  // modal options
  const creatingPersonalEventOptions = e => {
    if (e && e.personal) {
      return (
        <Segment textAlign='center' placeholder>
          {eventTimeSetter(selectedSlot, setSelectedSlot)}
          <Divider hidden />
          <Form>
            <Form.Field>
              <label>Title</label>
              <Input
                placeholder='New Event Name'
                value={selectedSlot.title || ''}
                onChange={e =>
                  setSelectedSlot({ ...selectedSlot, title: e.target.value })}
              />
            </Form.Field>
            <Form.Field>
              <label>Location</label>
              <Input
                icon='building'
                iconPosition='left'
                value={selectedSlot.location || ''}
                onChange={e =>
                  setSelectedSlot({ ...selectedSlot, location: e.target.value })}
                placeholder='42 Wallaby Way Sydney'
              />
            </Form.Field>
            <Button
              loading={loading}
              color='green'
              onClick={() => createEventHandler(false)}
              type='submit'
            >
              Create
            </Button>
          </Form>
        </Segment>
      )
    }
  }
  const handleNewSlotSkypeChange = () => {
    let skype = selectedSlot.extended_properties.private.skype
    if (skype === 'true') skype = 'false'
    else skype = 'true'
    const newExtendedProperties = {
      ...selectedSlot.extended_properties.private,
      skype
    }
    setSelectedSlot({
      ...selectedSlot,
      extended_properties: { private: newExtendedProperties }
    })
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

  const creatingBusinessEventOptions = e => {
    if (e && e.personal === false) {
      return (
        <BusinessEventSegment>
          {eventTimeSetter(selectedSlot, setSelectedSlot)}
          <Dropdown
            onChange={(e, d) =>
              setSelectedSlot({
                ...selectedSlot,
                recurrence: { freq: d.value }
              })}
            defaultValue={null}
            placeholder='No Repeat'
            options={repeatOptions}
          />

          <div>
            <Button
              content='Create New Appointment'
              icon='bookmark'
              loading={loading}
              disabled={
                !!(!selectedSlot.attendees || selectedSlot.attendees.length < 1)
              }
              primary
              onClick={() => createEventHandler(false)}
            />
            <Popup
              content='This will create a "bookable" appointment slot visible to all clients.'
              trigger={
                <Button
                  disabled={
                    !!(selectedSlot.attendees && selectedSlot.attendees.length > 0)
                  }
                  icon='calendar'
                  loading={loading}
                  color='grey'
                  onClick={() => createEventHandler(true)}
                  content='Create Appointment Slot'
                />
              }
            />
            <Popup
              content='This will create a "bookable" consultation slot visible to all clients.'
              trigger={
                <Button
                  disabled={
                    !!(selectedSlot.attendees && selectedSlot.attendees.length > 0)
                  }
                  loading={loading}
                  color='yellow'
                  onClick={() => createEventHandler(false, true)}
                  icon='phone'
                  content='Create Consult Slot'
                />
              }
            />
          </div>
          <div>
            {showEventAttendees(e, removeAttendeeFromEvent, setSelectedSlot)}
          </div>
          <UserPickerDropDown
            current_user={props.current_user}
            users={props.users}
            event={e}
            addAttendeeHandler={u =>
              addAttendeeToEvent(u, selectedSlot, setSelectedSlot)}
          />
          <Form
            style={{
              display:
                !selectedSlot.attendees || selectedSlot.attendees.length < 1
                  ? 'none'
                  : 'block'
            }}
          >
            <Form.Group inline>
              {/* <Form.Field> */}
              {/* <Form.Radio
                  disabled={
                    !!(!selectedSlot.attendees || selectedSlot.attendees.length < 1)
                  }
                  label='Skype'
                  name='radioGroup'
                  value='skype'
                  checked={
                    selectedSlot.extended_properties.private.skype === 'true'
                  }
                  onChange={() => handleNewSlotSkypeChange()}
                />
              </Form.Field> */}

              <Form.Radio
                label='Skype'
                name='radioGroup'
                value='that'
                checked={
                  selectedSlot.extended_properties.private.skype ===
                'true'
                }
                onChange={() => handleMediumChange('skype', selectedSlot, setSelectedSlot)}
              />{' '}
              <Form.Radio
                label='Phone'
                name='radioGroup'
                value='that'
                checked={
                  selectedSlot.extended_properties.private.phone ===
                'true'
                }
                onChange={() => handleMediumChange('phone', selectedSlot, setSelectedSlot)}
              />{' '}
              <Form.Radio
                label='Telehealth'
                name='radioGroup'
                value='that'
                checked={
                  selectedSlot.extended_properties.private.telehealth ===
                'true'
                }
                onChange={() => handleMediumChange('telehealth', selectedSlot, setSelectedSlot)}
              />

              {/* <Form.Field>
                <Form.Radio
                  disabled={
                    !!(!selectedSlot.attendees || selectedSlot.attendees.length < 1)
                  }
                  label='In Person'
                  name='radioGroup'
                  value='inPerson'
                  checked={
                    selectedSlot.extended_properties.private.skype === 'false'
                  }
                  onChange={() => handleNewSlotSkypeChange()}
                />
              </Form.Field> */}
            </Form.Group>
          </Form>
        </BusinessEventSegment>
      )
    }
  }

  const generateEventTitleWithMedium = (event) => {
    if (selectedEvent.extended_properties && selectedEvent.extended_properties.private.skype === 'true') {
      return `${event.title} | Skype Call`
    }
    if (selectedEvent.extended_properties && selectedEvent.extended_properties.private.phone === 'true') {
      return `${event.title} | Phone Call`
    }
    if (selectedEvent.extended_properties && selectedEvent.extended_properties.private.telehealth === 'true') {
      return `${event.title} | Telehealth`
    }
    return event.title
  }

  // modals
  const editingEventModal = () => {
    const e = selectedEvent
    if (!e) return null
    return (
      <Modal
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        header={
          <Input
            fluid
            size='big'
            value={generateEventTitleWithMedium(e)}
            onChange={e =>
              setSelectedEvent({ ...selectedEvent, title: e.target.value })}
          />
        }
        content={
          <ModalContent>
            {eventTimeSetter(selectedEvent, setSelectedEvent)}
            <Divider hidden />
            <Input
              iconPosition='left'
              placeholder='42 Wallaby Way, Sydney, Australia'
              icon='building'
              value={e.location || ''}
              onChange={e =>
                setSelectedEvent({ ...selectedEvent, location: e.target.value })}
            />
            <Divider hidden />
            <div>
              {showEventAttendees(e, removeAttendeeFromEvent, setSelectedEvent)}
            </div>

            {e.calendar.id ===
            props.current_user.google_calendar_email ? null : (
              <>
                <Divider hidden />
                <UserPickerDropDown
                  current_user={props.current_user}
                  users={props.users}
                  event={e}
                  addAttendeeHandler={u =>
                    addAttendeeToEvent(u, selectedEvent, setSelectedEvent)}
                />
              </>
              )}
            <Divider hidden />

            <Form
              style={{
                display:
                  !selectedEvent.attendees || selectedEvent.attendees.length < 1
                    ? 'none'
                    : 'block'
              }}
            >
              <Form.Group inline>
                <Form.Radio
                  label='Skype'
                  name='radioGroup'
                  value='that'
                  checked={
                    selectedEvent.extended_properties &&
                    selectedEvent.extended_properties.private.skype === 'true'
                  }
                  onChange={() => handleMediumChange('skype', selectedEvent, setSelectedEvent)}
                />{' '}
                <Form.Radio
                  label='Phone'
                  name='radioGroup'
                  value='that'
                  checked={
                    selectedEvent.extended_properties &&
                    selectedEvent.extended_properties.private.phone === 'true'
                  }
                  onChange={() => handleMediumChange('phone', selectedEvent, setSelectedEvent)}
                />{' '}
                <Form.Radio
                  label='Telehealth'
                  name='radioGroup'
                  value='that'
                  checked={
                    selectedEvent.extended_properties &&
                    selectedEvent.extended_properties.private.telehealth === 'true'
                  }
                  onChange={() => handleMediumChange('telehealth', selectedEvent, setSelectedEvent)}
                />{' '}
                {/* <Form.Radio
                  label='In Person'
                  name='radioGroup'
                  value='that'
                  checked={
                    selectedEvent.extended_properties &&
                    selectedEvent.extended_properties.private.skype === 'false'
                  }
                  onChange={() => handleSelectedEventSkypeChange()}
                /> */}
              </Form.Group>
            </Form>
          </ModalContent>
        }
        actions={[
          {
            key: 'delete',
            content: 'Delete',
            onClick: () => deleteSelectedEventHandler()
          },
          {
            key: 'deleteFuture',
            content: 'Delete Future Repeats',
            onClick: () => deleteRepeatsHandler()
          },
          {
            key: 'Cancel',
            content: 'Cancel',
            onClick: () => setSelectedEvent(null)
          },
          {
            key: 'save',
            content: 'Save',
            onClick: () => updateSelectedEventHandler()
          }
        ]}
      />
    )
  }

  const creatingEventModal = () => {
    const e = selectedSlot
    return (
      <Modal
        open={!!selectedSlot}
        onClose={() => setSelectedSlot(null)}
        header='Create Event'
        content={
          <ModalContent>
            {personalOrBusinessToggle(e)}
            {creatingBusinessEventOptions(e)}
            {creatingPersonalEventOptions(e)}
          </ModalContent>
        }
      />
    )
  }

  return (
    <>
      <ScheduleNotificationManager notifications={notifications} />
      {/* <div style={{ position: "fixed", right: "1rem", zIndex: "100" }}>
            {notifications.map(n => <Message key={uuidv1()} message={n} />)}
        </div> */}
      <Divider hidden />
      <Divider hidden />
      <FullWidthCalendarContainer fluid>
        <div style={{ width: '100%', maxWidth: '95vw', justifySelf: 'center' }}>
          <h1>Schedule </h1>
        </div>

        <Divider hidden style={{ gridArea: 'divider' }} />

        <Dimmer.Dimmable as={CalendarContainer} fullWidth>
          <Dimmer blurring active={loading} inverted>
            <Loader inline active={loading} />
          </Dimmer>

          <BigCalendar
            style={{ border: '1px solid red !important' }}
            components={{
              event: Event
            }}
            startAccessor={event => new Date(event.start_time)}
            endAccessor={event => new Date(event.end_time)}
            selectable
            localizer={localizer}
            onSelectEvent={e => setSelectedEvent(e)}
            events={events}
            defaultDate={new Date()}
            popup
            views={['month', 'day', 'week']}
            scrollToTime={new Date()}
            defaultView={Views.WEEK}
            step={15}
            timeslots={1}
            onSelectSlot={e => selectSlotHandler(e)}
            onRangeChange={e => {
              rangeChangeHandler(e)
            }}
          />
        </Dimmer.Dimmable>
      </FullWidthCalendarContainer>

      {creatingEventModal()}
      {editingEventModal()}
    </>
  )
}

export default Schedule
