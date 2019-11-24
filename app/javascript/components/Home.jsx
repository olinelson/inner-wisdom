import React, { useEffect } from 'react'

import { Header, Container, Segment, Item, Divider, Label } from "semantic-ui-react"

import PostPreview from './PostPreview';
import styled from "styled-components"

import { Jumbotron, JumboMessage } from './StyledComponents'
import Memberships from "./Memberships"
function Home(props) {



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


    const mostRecentPublicPost = props.lastPost


    const showRecentBlogPost = () => {

        if (props.lastPost) {
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

    const JumboHeader = styled(Header)`
        font-size: 4rem;
        color: white;
        text-shadow: 1px 1px 2px black;
    `


    return <>
        <Jumbotron fullHeight src="https://storage.googleapis.com/inner_wisdom_bucket/forest-path-trees-6037(1).jpg" >
            <JumboMessage  >
                <JumboHeader size="huge" as={"h1"} inverted>Inner Wisdom Psychology</JumboHeader>
                <Header.Subheader style={{ color: "white", textShadow: "1px 1px 2px black" }} as="h3">Wellbeing, Relationships, Guidance</Header.Subheader>


            </JumboMessage>
            <Label style={{ alignSelf: "flex-end", justifySelf: "flex-start", color: "white", backgroundColor: "rgba(0,0,0,0)", visibility: "hidden" }} size="big" content="scroll" icon="arrow up" />
        </Jumbotron>

        <Divider hidden />

        <Divider hidden />


        {/* </Container> */}
        <Container text>
            {/* <Segment> */}
            <Item.Group>
                <Item>
                    <Item.Image alt="Susan Stephenson, Director" size='medium' src={`${process.env.BASE_URL}/headshot.jpg`} />
                    {/* <Item.Image alt="Susan Stephenson, Director" size='medium' src='https://storage.googleapis.com/inner_wisdom_bucket/headshot_noExifRotated.jpg' /> */}

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


export default Home
