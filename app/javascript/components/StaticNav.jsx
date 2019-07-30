import React from 'react'


import { Menu } from 'semantic-ui-react'



function Nav(props) {


    const signOutHandeler = () => {
        const csrfToken = document.querySelectorAll('meta[name="csrf-token"]')[0].content

        fetch(`${props.baseUrl}/sign_out`, {
            method: "DELETE",
            headers: {
                "X-CSRF-Token": csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        }).then(() => window.location.push("/"))
    }


    return <Menu>
        <Menu.Item>
            <a href={props.baseUrl}>Home</a>
        </Menu.Item>
        <Menu.Item>
            <a href={`${props.baseUrl}/#/blog`}>Blog</a>
        </Menu.Item>
        <Menu.Item>
            <a href={`${props.baseUrl}/#/appointments`}>Book Appointment</a>
        </Menu.Item>

    </Menu>

}




export default Nav