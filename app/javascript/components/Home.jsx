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
    grid-gap: 2rem;
    align-items: flex-end;
    text-align: center;


`


const GridCard = styled(Card)`
    margin: 0 !important;
`

function Home(props) {



    const publishedPosts = props.posts.filter(p => p.published === true)


    const mostRecentPublicPost = publishedPosts.sort((b, a) => a.id - b.id)[0]

    const showRecentBlogPost = () => {
        if (publishedPosts.length > 0) {
            return <Container>
                <h1>Latest Blog Post</h1>
                <Item.Group>
                    <PostPreview readMoreButton blogView post={mostRecentPublicPost} />
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

            <div>
                <Image size="small" src="https://storage.googleapis.com/inner_wisdom_bucket/APS_Member%20Logo.jpg" />
                <Header content="Counselling" />

            </div>

            <div>
                <Image size="tiny" src="https://storage.googleapis.com/inner_wisdom_bucket/AAOS_Member_Logo.jpg" />
                <Header content="Supervision" />

            </div>
            <div>
                <Image size="small" src="https://storage.googleapis.com/inner_wisdom_bucket/bonsai-garden-plant-1382195(1).jpg" />
                <Header content="Training" />

            </div>
            {/* <GridCard >

                <Card.Content textAlign="center">
                    <Image size="tiny" src="https://storage.googleapis.com/inner_wisdom_bucket/AAOS_Member_Logo.jpg" />
                    <Header size="large" content="Supervision" />
                </Card.Content>
            </GridCard>

            <GridCard >
                <Card.Content textAlign="center">
                    <Image src="https://storage.googleapis.com/inner_wisdom_bucket/bonsai-garden-plant-1382195(1).jpg" />
                    <Header size="large" content="Training" />
                </Card.Content>
            </GridCard> */}

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
                        <Item.Header>About
                        </Item.Header>
                        <Item.Meta>Director Susan Stephenson
                            B.A (Psych), Dip. Ed. (Psych), MEd (Counselling), FAPS, MCCOUNP, AAOS
                        </Item.Meta>

                        <Item.Description>
                            <p>
                                I am a Registered Counselling Psychologist with 30+ years’ experience helping adults and couples resolve difficulties in order to live fulfilling, purposeful and content lives.
                                I specialize in mental health well-being, including managing personal and workplace stress, anxiety and depression; recovery from psychological and emotional trauma (past and present), bereavement, grief and loss; life transitions and adjustments; couples and relationship counselling.
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
