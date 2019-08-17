import React, { Component, useRef } from 'react'

import { Menu, Header, Container, Card, Button, Segment, Icon, Item, Image, Divider, Label } from "semantic-ui-react"

import { Link } from "react-router-dom"
import PostViewer from './PostViewer';
import { connect } from 'react-redux';
import PostPreview from './PostPreview';
import styled from "styled-components"
import { withRouter } from "react-router-dom"

import { Jumbotron, JumboMessage, ThreeColumnContainer, GridCard, ImageDivider } from './StyledComponents'
import Counselling from './Counselling';

function Home(props) {



    const BasicCard = styled.div`
    transition: .1s ease-in;

    :hover {
        -webkit-transform: scale(1.05);
        -ms-transform: scale(1.05);
        transform: scale(1.05);
        transition: .1s ease-in;
    } 
    cursor: pointer;

    `

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
        <Jumbotron fullHeight src="https://static.pexels.com/photos/52599/pexels-photo-52599.jpeg" >
            <JumboMessage style={{ justifySelf: "center" }} placeholder >
                <Header style={{ fontSize: "4rem" }} size="huge" as={"h1"} inverted>Inner Wisdom Psychology</Header>

            </JumboMessage>
            <Label style={{ alignSelf: "flex-end", justifySelf: "flex-start", color: "white", backgroundColor: "rgba(0,0,0,0)" }} size="big" content="scroll" icon="arrow up" />
        </Jumbotron>

        <Divider hidden />

        <ThreeColumnContainer>

            <BasicCard onClick={() => props.history.push("/counselling")}>
                <Image size="small" src="https://storage.googleapis.com/inner_wisdom_bucket/APS_Member%20Logo.jpg" />
                <Header content="Counselling" />
            </BasicCard>

            <BasicCard onClick={() => props.history.push("/supervision")}>
                <Image size="tiny" src="https://storage.googleapis.com/inner_wisdom_bucket/AAOS_Member_Logo.jpg" />
                <Header content="Supervision" />

            </BasicCard>
            <BasicCard onClick={() => props.history.push("/training")}>
                <Image size="small" src="https://storage.googleapis.com/inner_wisdom_bucket/bonsai-garden-plant-1382195(1).jpg" />
                <Header content="Training" />

            </BasicCard>

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

                    <Item.Content verticalAlign='top'>
                        <Header>Susan Stephenson | Director
                            <Header.Subheader> B.A (Psych), Dip. Ed. (Psych), MEd (Counselling), FAPS, MCCOUNP, AAOS</Header.Subheader>
                        </Header>

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

export default withRouter(connect(mapStateToProps)(Home))
