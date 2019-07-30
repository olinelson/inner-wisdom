import React from 'react'


import { Menu, Icon } from 'semantic-ui-react'

import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import styled from "styled-components"



function Nav(props) {

    const pathname = props.location.pathname

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

    const LogoLink = styled(Link)`
        font-size: 2rem;
    `

    const FixedMenu = styled(Menu)`
        position: ${() => pathname === '/' ? "absolute" : "static"};
        width: 100vw;
        top:0rem !important;
        border: none !important;
        // background: rgb(0,0,0,0);
        background: ${() => pathname === '/' ? "linear-gradient(180deg, rgba(0,0,0,.7) 0%, rgba(0,0,0,0) 100%) !important;" : "rgba(0,0,0,0)"};
        // background: linear-gradient(180deg, rgba(0,0,0,.7) 0%, rgba(0,0,0,0) 100%) !important;
    `


    return <FixedMenu pointing
        inverted={pathname === '/' ? true : false}
        secondary >
        <Menu.Item
            active={pathname === '/'}
        >
            <Link to="/">Inner Wisdom</Link>
        </Menu.Item>
        <Menu.Item
            active={pathname === '/blog'}
        >
            {/* <Icon name="book" /> */}
            <Link to="/blog">Blog</Link>
        </Menu.Item>
        <Menu.Item
            active={pathname === '/appointments'}
        >
            {/* <Icon name="calendar alternate"></Icon> */}
            <Link to="/appointments">Appointments</Link>
        </Menu.Item>

        <Menu.Menu position="right">
            {props.user === null ?
                <Menu.Item>
                    <Icon name="sign in"></Icon>
                    <a href={`${props.baseUrl}/users/sign_in`}>Sign In</a>
                </Menu.Item>
                :
                <>
                    <Menu.Item>
                        {/* <Icon name="user circle"></Icon> */}
                        <Link to="/myaccount">My Account</Link>
                    </Menu.Item>


                    <Menu.Item>
                        <Icon name="sign out"></Icon>
                        <a style={{ cursor: "pointer" }} onClick={signOutHandeler}>Sign Out</a>
                    </Menu.Item>
                </>
            }
        </Menu.Menu>
    </FixedMenu >

}


const mapStateToProps = (state) => ({
    user: state.user,
    refreshMethod: state.refreshMethod,
    baseUrl: state.baseUrl,
    csrfToken: state.csrfToken
})

export default connect(mapStateToProps)(Nav)