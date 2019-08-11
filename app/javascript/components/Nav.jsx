import React, { useState } from 'react'


import { Menu, Icon, Dropdown, Sidebar, Segment, Header, Image } from 'semantic-ui-react'

import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import styled from "styled-components"




function Nav(props) {

    const [sideBarOpen, setSideBar] = useState(false);

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

    const FixedMenu = styled(Menu)`
        position: ${() => pathname === '/' || pathname === '/blog' ? "absolute" : "sticky"};
        // position: absolute ;
        z-index: 1;
        width: 100vw;
        top:0rem !important;
        border: none !important;
        background: ${() => pathname === '/' ? "linear-gradient(180deg, rgba(0,0,0,.7) 0%, rgba(0,0,0,0) 100%) !important;" : "rgba(0,0,0,0)"};

        @media (max-width: 40rem) {
            border: 1px solid red !important;
            display: none !important;
        }
         
    `

    const MobileMenu = styled(Menu)`
        
        position: ${() => pathname === '/' || pathname === '/blog' ? "absolute" : "sticky"};
        z-index: 2;
        width: 100vw;
        top: 0rem!important;
        background: rgba(0, 0, 0, 0);

        @media(min-width: 40rem) {
            display: none!important;
        }
`

    const menuOptions = () => {
        return <>
            <Menu.Item active={pathname === '/'} >
                <Link to="/">Inner Wisdom</Link>
            </Menu.Item>

            <Menu.Item active={pathname === '/blog'} >
                <Link to="/blog">Blog</Link>
            </Menu.Item>

            {props.user.admin ? null :
                <Menu.Item active={pathname === '/appointments'}>
                    <Link to="/appointments">Appointments</Link>
                </Menu.Item>
            }

        </>
    }


    const UserMenuOptions = () => {
        return <> {
            props.user == null ?
                <Menu.Item>
                    <Icon name="sign in"></Icon>
                    <a href={`${props.baseUrl}/users/sign_in`}>Sign In</a>
                </Menu.Item>

                :
                <>
                    {props.user.admin === true ?
                        <>
                            <Menu.Item
                                active={pathname === '/schedule'}
                            >
                                {/* <Icon name="user circle"></Icon> */}
                                <Link to="/schedule">Schedule</Link>
                            </Menu.Item>
                            <Menu.Item
                                active={pathname === '/clients'}
                            >
                                {/* <Icon name="user circle"></Icon> */}
                                <Link to="/clients">Clients</Link>
                            </Menu.Item>
                        </>
                        : null}
                    <Menu.Item
                        active={pathname === '/myaccount'}
                    >
                        {/* <Icon name="user circle"></Icon> */}
                        <Link to="/myaccount">My Account</Link>
                    </Menu.Item>






                    <Menu.Item>
                        <Icon name="sign out"></Icon>
                        <a style={{ cursor: "pointer" }} onClick={signOutHandeler}>Sign Out</a>
                    </Menu.Item>
                </>
        }
        </>
    }

    return <>
        <FixedMenu pointing inverted={pathname === '/' || pathname === '/blog' ? true : false} secondary >
            {menuOptions()}
            <Menu.Menu position="right">
                {UserMenuOptions()}
            </Menu.Menu>

        </FixedMenu >

        <MobileMenu secondary>
            <Menu.Menu position="right">
                < Menu.Item  >
                    <Dropdown icon="bars" floating >

                        <Dropdown.Menu>
                            {menuOptions()}
                            {UserMenuOptions()}
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item >
            </Menu.Menu>


        </MobileMenu>
        {/* <Sidebar.Pushable style={{ position: "absolute", zIndex: "1", width: "50vw" }} as={Segment}>
            <Sidebar
                as={Menu}
                animation='overlay'
                icon='labeled'
                inverted
                onHide={() => setSideBar(false)}
                vertical
                visible={sideBarOpen}
                width='thin'
            >
                <Menu.Item as='a'>
                    <Icon name='home' />
                    Home
            </Menu.Item>
                <Menu.Item as='a'>
                    <Icon name='gamepad' />
                    Games
            </Menu.Item>
                <Menu.Item as='a'>
                    <Icon name='camera' />
                    Channels
            </Menu.Item>
            </Sidebar>


        </Sidebar.Pushable> */}
    </>

}




const mapStateToProps = (state) => ({
    user: state.user,
    refreshMethod: state.refreshMethod,
    baseUrl: state.baseUrl,
    csrfToken: state.csrfToken
})

export default withRouter(connect(mapStateToProps)(Nav))


