import React, { Component } from 'react'

import { Menu, Header, Container, Card, Button, Segment, Icon, Item, Image, Divider } from "semantic-ui-react"

import { Link } from "react-router-dom"
import PostViewer from './PostViewer';
import { connect } from 'react-redux';
import PostPreview from './PostPreview';
import styled from "styled-components"

export const Jumbotron = styled.div`
    background-position: center !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;
    height: 70vh !important;
    margin: -2rem 0 0 0 !important;

    border: none !important;
    border-radius: 0 !important;
    margin-top: -1rem !important;
    display: grid;
    align-items: center;
    justify-content: center;
}
`
export const JumboMessage = styled(Segment)`
    background-color: rgba(0,0,0,0) !important;
    border: none !important;
`

const ThreeColumnContainer = styled(Container)`
    padding: 1rem;
    display: grid !important;
    grid-template-columns: repeat( auto-fit, minmax(15rem, 1fr)) ;
    justify-items: center;
    grid-gap: 1rem;


`


const GridCard = styled(Card)`
    margin: 0 !important;
`

function Home(props) {



    const publishedPosts = props.posts.filter(p => p.published === true)


    const firstPublicPost = publishedPosts[publishedPosts.length - 1]

    const showRecentBlogPost = () => {
        if (publishedPosts.length > 0) {
            return <Container>
                <h1>Latest Blog Post</h1>
                <Item.Group>
                    <PostPreview {...props} readMoreButton blogView post={props.posts[0]} />
                </Item.Group>
            </Container>
        }

    }


    return <>
        <Jumbotron style={{ backgroundImage: 'url("https://static.pexels.com/photos/52599/pexels-photo-52599.jpeg")' }}>
            <JumboMessage placeholder >
                <Header style={{ fontSize: "4rem" }} size="huge" as={"h1"} inverted>Inner Wisdom Psychology</Header>
            </JumboMessage>
        </Jumbotron>

        <Divider hidden />

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

        <Divider hidden />
        <Divider />
        <Divider hidden />
        {/* </Container> */}
        <Container text>
            {/* <Segment> */}
            <Item.Group>
                <Item>
                    <Item.Image size='medium' src='https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500' />

                    <Item.Content>
                        <Item.Header as='a'>Sue Stephenson</Item.Header>
                        <Item.Description>
                            <p>

                                Maiores in ducimus quia alias ea quos sequi dolorum. Quam doloribus veritatis in amet velit aut. Esse blanditiis molestiae quod ea quia. Qui magnam nulla rem nihil provident.

                                Maxime autem iusto sed qui neque id odit recusandae. Quam ut odio veritatis. Et harum consequatur illum quis voluptas porro officia id.

                                Qui vel quam et ad illo ab omnis. Doloremque excepturi vero adipisci ea placeat molestiae eligendi. Consequuntur mollitia voluptas molestias. Quia sit soluta commodi. Ullam voluptatibus deserunt nobis dolor est perspiciatis minima impedit.

                                Dolores ut similique dolor voluptas est optio nihil est. Repellat cupiditate sunt harum aspernatur sint totam dolor dolorum. Repellat vel corporis id voluptas numquam.

                                Est occaecati est voluptatum ut provident. Nobis voluptatum dolor rerum illo dolorum omnis. Minus doloribus id placeat.
</p>
                        </Item.Description>
                    </Item.Content>
                </Item>
            </Item.Group>
            {/* </Segment> */}
        </Container>

        <Divider hidden />
        <Divider />
        <Divider hidden />
        {showRecentBlogPost()}


    </>

}

const mapStateToProps = (state) => ({
    posts: state.posts
})

export default connect(mapStateToProps)(Home)
