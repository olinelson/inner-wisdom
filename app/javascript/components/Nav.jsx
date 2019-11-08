import React, { useState } from 'react'
import { Menu, Icon, Dropdown, Divider } from 'semantic-ui-react'
import styled from "styled-components"


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
            pathname.includes('/fees') ||
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
            <Menu.Item href={process.env.BASE_URL} active={pathname === '/'} >
                Inner Wisdom
            </Menu.Item>



            <Menu.Item href={process.env.BASE_URL + '/counselling'} active={pathname === '/counselling'} >
                Counselling
            </Menu.Item>

            <Menu.Item href={process.env.BASE_URL + '/supervision'} active={pathname === '/supervision'} >
                Supervision
            </Menu.Item>

            <Menu.Item href={process.env.BASE_URL + '/fees'} active={pathname === '/fees'} >
                Fees
            </Menu.Item>

            <Menu.Item href={process.env.BASE_URL + '/faqs'} active={pathname === '/faqs'} >
                FAQs
            </Menu.Item>

            <Menu.Item href={process.env.BASE_URL + '/blog'} active={pathname === '/blog'} >
                Blog
            </Menu.Item>

            <Menu.Item href={process.env.BASE_URL + '/contact'} active={pathname === '/contact'} >
                Contact
            </Menu.Item>

            {
                props.current_user && props.current_user.admin ? null :
                    <Menu.Item href={process.env.BASE_URL + '/appointments'} active={pathname === '/appointments'}>
                        Appointments
                    </Menu.Item>
            }

        </>
    }


    const UserMenuOptions = () => {
        return <> {
            props.current_user == null ?
                <Menu.Item href={`${process.env.BASE_URL}/users/sign_in`}>
                    <Icon name="sign in"></Icon>
                    Sign In
                </Menu.Item>

                :
                <>
                    {props.current_user.admin === true ?
                        <>
                            <Menu.Item
                                href={`${process.env.BASE_URL}/schedule`}
                                active={pathname === '/schedule'}
                            >


                                Schedule
                            </Menu.Item>
                            <Menu.Item
                                href={`${process.env.BASE_URL}/clients`}
                                active={pathname === '/clients'}
                            >
                                Clients

                            </Menu.Item>
                        </>
                        : null}
                    <Menu.Item
                        href={`${process.env.BASE_URL}/myaccount`}
                        active={pathname === '/myaccount'}
                    >

                        My Account
                    </Menu.Item>

                    <Menu.Item onClick={signOutHandler}>
                        <Icon name="sign out"></Icon>
                        {/* <a style={{ cursor: "pointer" }} onClick={signOutHandler}>Sign Out</a> */}
                        Sign Out
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