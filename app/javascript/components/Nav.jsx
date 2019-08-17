import React, { useState, Component } from 'react'


import { Menu, Icon, Dropdown, Sidebar, Segment, Header, Image } from 'semantic-ui-react'

import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import styled from "styled-components"

import LinkOrATag from "./LinkOrATag"




function Nav(props) {


    let csrfToken

    if (props.static) csrfToken = ""
    else csrfToken = document.querySelectorAll('meta[name="csrf-token"]')[0].content

    const [sideBarOpen, setSideBar] = useState(false);
    console.log("props in nav", props)

    let pathname = ""

    if (props.static) pathname = ""
    else pathname = props.location.pathname


    const signOutHandeler = () => {

        fetch(`${process.env.BASE_URL}/users/sign_out`, {
            method: "DELETE",
            headers: {
                "X-CSRF-Token": csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(() => props.dispatch({ type: "SET_USER", value: null }))
            .then(() => props.history.push("/"))

    }

    const FixedMenu = styled(Menu)`
        position: ${() => pathname === '/' || pathname === '/blog' ? "absolute" : "sticky"};
        // position: absolute ;
        z-index: 1;
        width: 100vw;
        top:0rem !important;
        border: none !important;
        background: ${() => pathname === '/' || pathname === '/blog' ? "linear-gradient(180deg, rgba(0,0,0,.7) 0%, rgba(0,0,0,0) 100%) !important;" : "white !important"};

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
                <LinkOrATag to="/" static={props.static}>Inner Wisdom</LinkOrATag>
            </Menu.Item>

            <Menu.Item active={pathname === '/counselling'} >
                <LinkOrATag static={props.static} to="/counselling">Counselling</LinkOrATag>
            </Menu.Item>

            <Menu.Item active={pathname === '/supervision'} >
                <LinkOrATag static={props.static} to="/supervision">Supervision</LinkOrATag>
            </Menu.Item>

            <Menu.Item active={pathname === '/training'} >
                <LinkOrATag static={props.static} to="/training">Training</LinkOrATag>
            </Menu.Item>

            <Menu.Item active={pathname === '/blog'} >
                <LinkOrATag static={props.static} to="/blog">Blog</LinkOrATag>
            </Menu.Item>



            {props.user && props.user.admin ? null :
                <Menu.Item active={pathname === '/appointments'}>
                    <LinkOrATag static={props.static} to="/appointments">Appointments</LinkOrATag>
                </Menu.Item>
            }

        </>
    }


    const UserMenuOptions = () => {
        return <> {
            props.user == null ?
                <Menu.Item>
                    <Icon name="sign in"></Icon>
                    <a href={`${process.env.BASE_URL}/users/sign_in`}>Sign In</a>
                </Menu.Item>

                :
                <>
                    {props.user.admin === true ?
                        <>
                            <Menu.Item
                                active={pathname === '/schedule'}
                            >

                                <LinkOrATag static={props.static} to="/schedule">Schedule</LinkOrATag>
                            </Menu.Item>
                            <Menu.Item
                                active={pathname === '/clients'}
                            >

                                <LinkOrATag static={props.static} to="/clients">Clients</LinkOrATag>
                            </Menu.Item>
                        </>
                        : null}
                    <Menu.Item
                        active={pathname === '/myaccount'}
                    >

                        <LinkOrATag static={props.static} to="/myaccount">My Account</LinkOrATag>
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
    </>

}






export default Nav


