import React, { useState } from 'react'
import { Menu, Icon, Dropdown, Divider } from 'semantic-ui-react'
import styled from "styled-components"
import LinkOrATag from "./LinkOrATag"

function Nav(props) {
    const csrfToken = document.querySelectorAll('meta[name="csrf-token"]')[0].content

    const pathname = window.location.pathname

    const imageHeader = () => {

        if (pathname.includes('/posts') && props.current_user && props.current_user.admin) return false

        if (
            pathname === '/schedule' ||
            pathname.includes('/clients') ||
            pathname === '/myaccount' ||
            pathname.includes('/users') ||
            pathname.includes('/appointments') ||
            pathname.includes('/supervision') ||
            pathname.includes('/training') ||
            pathname.includes('/contact') ||
            pathname.includes('/faqs') ||
            pathname === ""

        ) return false

        return true
    }

    const signOutHandler = () => {
        fetch(`${process.env.BASE_URL}/users/sign_out`, {
            method: "DELETE",
            headers: {
                "X-CSRF-Token": csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(() => window.location.href = `${process.env.BASE_URL}`)
    }

    const FixedMenu = styled(Menu)`
        position: ${() => imageHeader() ? "absolute" : "sticky"};
        // position: sticky ;
        z-index: 1000;
        width: 100vw;
        top:0rem !important;
        border: none !important;
        background: ${() => imageHeader() ? "linear-gradient(180deg, rgba(0,0,0,.7) 0%, rgba(0,0,0,0) 100%) !important;" : "white !important"};

        @media (max-width: 60rem) {
            visibility: hidden !important;
            width: 100vw !important;
            overflow: hidden !important;
        }
         
    `

    const MobileMenu = styled.div`
        position: fixed;
        z-index: 1000;
        top: 1.5rem;
        right: 1rem;
        background: rgba(0, 0, 0, 0);
        font-size: 2.5rem !important;
        // color: #666666;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        color: white;
        text-shadow: -1px -1px 0 grey, 1px -1px 0 grey, -1px 1px 0 grey, 1px 1px 0 grey;

        
        @media(min-width: 60rem) {
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
                <LinkOrATag static={props.static} to="/supervision">Supervision & Training</LinkOrATag>
            </Menu.Item>

            <Menu.Item active={pathname === '/faqs'} >
                <LinkOrATag static={props.static} to="/faqs">FAQs</LinkOrATag>
            </Menu.Item>

            <Menu.Item active={pathname === '/blog'} >
                <LinkOrATag static={props.static} to="/blog">Blog</LinkOrATag>
            </Menu.Item>
            <Menu.Item active={pathname === '/contact'} >
                <LinkOrATag static={props.static} to="/contact">Contact</LinkOrATag>
            </Menu.Item>

            {
                props.current_user && props.current_user.admin ? null :
                    <Menu.Item active={pathname === '/appointments'}>

                        <LinkOrATag static={props.static} to="/appointments">Appointments</LinkOrATag>
                    </Menu.Item>
            }

        </>
    }


    const UserMenuOptions = () => {
        return <> {
            props.current_user == null ?
                <Menu.Item>
                    <Icon name="sign in"></Icon>
                    <a href={`${process.env.BASE_URL}/users/sign_in`}>Sign In</a>
                </Menu.Item>

                :
                <>
                    {props.current_user.admin === true ?
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
                        <a style={{ cursor: "pointer" }} onClick={signOutHandler}>Sign Out</a>
                    </Menu.Item>
                </>
        }
        </>
    }

    return <>
        <FixedMenu style={{ zIndex: "100" }} pointing inverted={imageHeader() ? true : false} secondary >
            {menuOptions()}
            <Menu.Menu position="right">
                {UserMenuOptions()}
            </Menu.Menu>

        </FixedMenu >

        <MobileMenu style={{ zIndex: "100" }}>

            <Dropdown direction="left" icon="bars" floating >

                <Dropdown.Menu>
                    {menuOptions()}
                    {UserMenuOptions()}
                </Dropdown.Menu>
            </Dropdown>

            <Divider hidden />
        </MobileMenu>
    </>
}

export default Nav