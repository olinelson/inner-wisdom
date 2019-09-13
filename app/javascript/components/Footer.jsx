import React from 'react'
import { Icon, Divider, Container, Header, Segment, Menu } from "semantic-ui-react"
import styled from 'styled-components'

function Footer(props) {

    let path = window.location

    if (path === "/schedule" || path === "/appointments") return null

    const FooterContainer = styled.div`
        display: grid;
        justify-items: center;
        align-items: center;
        grid-gap: .5rem;
    `
    const FooterMenu = styled(Menu)`
        margin: 0 !important;
        margin-bottom: 0 !important;
    `



    return <div>
        <Divider hidden />
        <Divider hidden />
        <Container fluid style={{ background: "rgb(230, 230, 230)" }}>

            <Container text>

                <FooterContainer >
                    <Divider hidden />
                    <FooterMenu secondary>
                        < Menu.Item
                            name='home'
                            active={path === process.env.BASE_URL + "/"}
                            content='Home'
                            href="/"

                        />
                        <Menu.Item
                            name='Counselling'
                            active={path === process.env.BASE_URL + "/counselling"}
                            content='Counselling'
                            href="/counselling"
                        />
                        <Menu.Item
                            name='supervision'
                            active={path === process.env.BASE_URL + "/supervision"}
                            content='Supervision & Training'
                            href="/supervision"
                        />
                        <Menu.Item
                            name='faqs'
                            active={path === process.env.BASE_URL + "/faqs"}
                            content='FAQs'
                            href="/faqs"
                        />

                    </FooterMenu>

                    <FooterMenu secondary >
                        <Menu.Item
                            name='blog'
                            active={path === process.env.BASE_URL + "/blog"}
                            content='Blog'
                            href="/blog"
                        />
                        <Menu.Item
                            name='contact'
                            active={path === process.env.BASE_URL + "/contact"}
                            content='Contact'
                            href="/contact"
                        />
                        {props.current_user && props.current_user.admin ?
                            <Menu.Item
                                name='schedule'
                                active={path === process.env.BASE_URL + "/schedule"}
                                content='Schedule'
                                href="/schedule"
                            />
                            :
                            <Menu.Item
                                name='appointments'
                                active={path === process.env.BASE_URL + "/appointments"}
                                content='Appointments'
                                href="/appointments"
                            />
                        }

                    </FooterMenu>

                    <Header as='h6' icon='copyright' content={(new Date()).getFullYear() + " Inner Wisdom"} />

                    <Divider hidden />
                </FooterContainer>

            </Container>
        </Container>
    </div>


}

export default Footer
