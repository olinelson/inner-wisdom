import React from 'react'
import { connect } from "react-redux"
import { Dropdown } from "semantic-ui-react"

function UserPickerDropDown(props) {
    const event = props.event

    const allUsersNotAttending = (event) => {
        let users = props.users
        // let users = props.users.filter(u => u.email !== props.user.email)
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

    const allUsersNotAttendingList = (event, addAttendeeHandeler) => {
        let users = allUsersNotAttending(event)
        return users.map(user => (
            <Dropdown.Item onClick={() => addAttendeeHandeler(user)} key={user.id} text={`${user.first_name} ${user.last_name}`} icon="user circle" />
        ))

    }

    const searchForUsersHandeler = (items, query) => {
        let result = []
        for (let item of items) {
            if (item.props.text.includes(query)) result.push(item)
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
        search={searchForUsersHandeler}
        options={allUsersNotAttendingList(event, props.addAttendeeHandeler)}
    >
        {/* <Dropdown.Menu>
                <Dropdown.Header content='Clients' />
                {this.allUsersNotAttendingList(event, addAttendeeHandeler)}
            </Dropdown.Menu> */}
    </Dropdown>


}


// const mapStateToProps = (state) => ({
//     // events: state.events,
//     // personalEvents: state.personalEvents,
//     // allEvents: allEvents(state.events, state.personalEvents),
//     user: state.user,
//     users: state.users,
//     // csrfToken: state.csrfToken,
//     // baseUrl: state.baseUrl,
//     // businessCalendarAddress: state.businessCalendarAddress
// })

export default UserPickerDropDown
