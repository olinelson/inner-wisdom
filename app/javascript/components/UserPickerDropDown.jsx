import React from 'react'
import { Dropdown } from "semantic-ui-react"

function UserPickerDropDown(props) {
    const event = props.event

    const allUsersNotAttending = (event) => {
        let users = props.users

        if (event == null) return users

        if (!event.attendees || event.attendees.length < 1) return users

        const isAnAttendee = (user) => {
            for (let u of event.attendees) {
                if (u.id === user.id) return false
                if (u.email === user.email) return false
            }
            return true
        }

        let result = users.filter(isAnAttendee)
        return result

    }

    const allUsersNotAttendingList = (event, addAttendeeHandler) => {
        let users = allUsersNotAttending(event)
        return users.map(user => (
            <Dropdown.Item onClick={() => addAttendeeHandler(user)} key={user.id} text={`${user.first_name} ${user.last_name}`} icon="user circle" />
        ))

    }

    const searchForUsersHandler = (items, query) => {
        let result = []
        for (let item of items) {
            if (item.props.text.toLowerCase().includes(query) || item.props.text.includes(query)) result.push(item)
        }
        return result
    }


    return <Dropdown
        text='Add Client'
        icon='add user'
        floating
        labeled
        button
        className='icon'
        search={searchForUsersHandler}
        options={allUsersNotAttendingList(event, props.addAttendeeHandler)}
    >
    </Dropdown>


}


export default UserPickerDropDown
