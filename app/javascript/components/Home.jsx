import React, { Component } from 'react'

import { Menu, Header, Container, Card, Button, Segment, Icon } from "semantic-ui-react"

import { Link } from "react-router-dom"
import PostViewer from './PostViewer';
import { connect } from 'react-redux';
import PostPreview from './PostPreview';
import styled from "styled-components"

const Jumbotron = styled.div`
    background-position: center !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;
    height: 70vh !important;
    margin: 0 !important;
    border: none !important;
    border-radius: 0 !important;
    margin-top: -1rem !important;
    display: grid;
    align-items: center;
    justify-content: center;
}
`
const JumboMessage = styled(Segment)`
    background-color: rgba(0,0,0,0.3) !important;
`

const ThreeColumnContainer = styled.div`
    padding: 1rem;
    display: grid;
    grid-template-columns: repeat( auto-fit, minmax(20rem, 1fr)) ;
    justify-items: center;
    grid-gap: 1rem;

`


const GridCard = styled(Card)`
    margin: 0 !important;
`

function Home(props) {



    const publishedPosts = props.posts.filter(p => p.published === true)


    const firstPublicPost = publishedPosts[publishedPosts.length - 1]



    return <>
        <Jumbotron style={{ backgroundImage: 'url("https://static.pexels.com/photos/52599/pexels-photo-52599.jpeg")' }}>
            <JumboMessage placeholder >
                <Header as={"h1"} inverted>Inner Wisdom Psychology</Header>
                <Segment.Inline>
                    <Button inverted basic primary>Clear Query</Button>
                    <Button inverted basic>Add Document</Button>
                </Segment.Inline>
            </JumboMessage>
        </Jumbotron>
        {/* <Container fluid> */}
        <ThreeColumnContainer>

            <GridCard >
                <Card.Content textAlign="center">
                    <Icon size="huge" name="share alternate"></Icon>
                    <Header size="large" content="Data Driven Treatments" />
                    <p>We use data-driven treatments and proven science tailored to you.</p>
                </Card.Content>
            </GridCard>

            <GridCard >
                <Card.Content textAlign="center">
                    <Icon size="huge" name="user doctor"></Icon>
                    <Header size="large" content="Personolized Fit" />
                    <p>Get confidential,
                    personalized access to
                    our caring expert
                        therapists in NYC.</p>
                </Card.Content>
            </GridCard>

            <GridCard >
                <Card.Content textAlign="center">
                    <Icon size="huge" name="compass outline"></Icon>
                    <Header size="large" content="Continous Guidance" />
                    <p>Help and guidance throughout,
                    from before your first
                    appointment to streamlined
                    pa</p>
                </Card.Content>
            </GridCard>

        </ThreeColumnContainer>
        {/* </Container> */}

    </>

}

const mapStateToProps = (state) => ({
    posts: state.posts
})

export default connect(mapStateToProps)(Home)
