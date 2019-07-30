import React from 'react'


import { Menu } from 'semantic-ui-react'

import { Link } from 'react-router-dom'
import { connect } from 'react-redux';



function Nav(props) {

    const signOutHandeler = () => {

        fetch(`${props.baseUrl}/users/sign_out`, {
            method: "DELETE",
            headers: {
                "X-CSRF-Token": props.csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        }).then(() => props.history.push("/"))
            .then(() => props.dispatch({ type: "SET_USER", value: null }))
    }

    return <Menu>
        <Menu.Item>
            <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item>
            <Link to="/blog">Blog</Link>
        </Menu.Item>
        <Menu.Item>
            <Link to="/appointments">Book Appointment</Link>
        </Menu.Item>

        <Menu.Menu position="right">
            {props.user === null ?
                <Menu.Item>
                    <a href={`${props.baseUrl}/users/sign_in`}>Sign In</a>
                </Menu.Item>
                :
                <>
                    <Menu.Item>
                        <Link to="/myaccount">My Account</Link>
                    </Menu.Item>
                    <Menu.Item>
                        <a style={{ cursor: "pointer" }} onClick={signOutHandeler}>Sign Out</a>
                    </Menu.Item>
                </>
            }
        </Menu.Menu>
    </Menu>

}


const mapStateToProps = (state) => ({
    user: state.user,
    refreshMethod: state.refreshMethod,
    baseUrl: state.baseUrl,
    csrfToken: state.csrfToken
})

export default connect(mapStateToProps)(Nav)