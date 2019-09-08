import React, { Component, useRef, useEffect } from 'react'

import { Menu, Header, Container, Card, Button, Segment, Icon, Item, Image, Divider, Label } from "semantic-ui-react"

import { Link } from "react-router-dom"
import { connect } from 'react-redux';
import PostPreview from './PostPreview';
import styled from "styled-components"
import { withRouter } from "react-router-dom"

import { Jumbotron, JumboMessage, ThreeColumnContainer, GridCard, ImageDivider } from './StyledComponents'
import Counselling from './Counselling';
import Supervision from './Supervision';
import Training from './Training';
import Memberships from "./Memberships"
function Home(props) {

    useEffect(() => {
        window.scroll({
            top: 0,
            left: 0,
        })
    }, []);



    const BasicCard = styled.div`
    transition: .1s ease-in;
    text-align: center;

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
            return <>
                <Divider />
                <Container text>
                    <h1>Latest Blog Post</h1>
                    <Item.Group>
                        <PostPreview readMoreButton blogView post={mostRecentPublicPost} />
                    </Item.Group>
                </Container>
            </>
        }

    }


    return <>
        <Jumbotron fullHeight src="https://storage.googleapis.com/inner_wisdom_bucket/asphalt-australia-conifer-2763005.jpg" >
            <JumboMessage  >
                <Header style={{ fontSize: "4rem" }} size="huge" as={"h1"} inverted>Inner Wisdom Psychology</Header>
                <Header.Subheader style={{ color: "white" }} as="h3">Wellbeing, Relationships, Guidance</Header.Subheader>
                {/* <h1>Inner Wisdom Psychology</h1> */}

            </JumboMessage>
            <Label style={{ alignSelf: "flex-end", justifySelf: "flex-start", color: "white", backgroundColor: "rgba(0,0,0,0)", visibility: "hidden" }} size="big" content="scroll" icon="arrow up" />
        </Jumbotron>

        <Divider hidden />

        {/* <ThreeColumnContainer>

            <BasicCard onClick={() => props.history.push("/counselling")}>
                <Image centered size="small" src="https://storage.googleapis.com/inner_wisdom_bucket/DSC_0022.jpg" />
                <Header content="Counselling" />
            </BasicCard>

            <BasicCard onClick={() => props.history.push("/supervision")}>
                <Image centered size="tiny" src="https://storage.googleapis.com/inner_wisdom_bucket/bonsai.jpg" />
                <Header content="Supervision" />

            </BasicCard>
            <BasicCard onClick={() => props.history.push("/training")}>
                <Image centered size="small" src="https://storage.googleapis.com/inner_wisdom_bucket/DSC_0021.jpg" />
                <Header content="Training" />

            </BasicCard>

        </ThreeColumnContainer> */}

        <Divider hidden />


        {/* </Container> */}
        <Container text>
            {/* <Segment> */}
            <Item.Group>
                <Item>
                    <Item.Image size='medium' src='https://storage.googleapis.com/inner_wisdom_bucket/DSC_0014.jpg' />

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

        <Memberships />







        {showRecentBlogPost()}





    </>

}

const mapStateToProps = (state) => ({
    posts: state.posts
})

export default withRouter(connect(mapStateToProps)(Home))
