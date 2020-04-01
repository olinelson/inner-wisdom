import React from 'react'
import styled from 'styled-components'
import { Label, Loader, Icon } from 'semantic-ui-react'

function Event (props) {
  const isCanceled = false

  const CustomLabel = styled(Label)`
            z-index: 1;
            position: static;
            height: 100%;
            width: 100%;
            opacity: ${() => props.event.placeholder ? '0.5' : '1'};
        `

  const colorPicker = () => {
    if (props.event.calendar && props.event.calendar.id !== process.env.CONSULTS_CALENDAR_ID && props.event.calendar.id !== process.env.APPOINTMENTS_CALENDAR_ID) return 'green'
    if (props.event && props.event.extended_properties && props.event.extended_properties.private.cancelation === 'true') return 'red'
    if (props.event.attendees && props.event.attendees.length > 0) return 'blue'
    return 'grey'
  }

  const iconPicker = () => {
    if (props.event.attendees && props.event.attendees.length) {
      if (props.event.extended_properties) {
        if (props.event.extended_properties.private.skype === 'true') return <Icon name='skype' />

        if (props.event.extended_properties.private.phone === 'true') return <Icon name='phone' />

        if (props.event.extended_properties.private.telehealth === 'true') return <Icon name='hospital' />
      }
    }
    return <Icon name='user' />
  }

  if (props.loadingEvent && (props.loadingEvent.id === props.event.id)) {
    return <CustomLabel color={colorPicker()}>
      <Loader inverted size='tiny' active inline />
      {props.loadingEvent.title}
    </CustomLabel>
  }

  return <CustomLabel color={colorPicker()}>
    <Loader inverted size='tiny' active={props.event.placeholder} inline />
    {iconPicker()}
    {props.event.title}
  </CustomLabel>
}

export default Event
