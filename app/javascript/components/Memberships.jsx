import React from 'react'
import { Item, Header, Container } from 'semantic-ui-react';

export default function Memberships() {
    return <Container text >
        <Header as="h2" content="Proffesional Memberships" />
        <Item.Group >
            <Item>
                <Item.Image size="tiny" src="https://storage.googleapis.com/inner_wisdom_bucket/APS_Member%20Logo.jpg" />
                <Item.Content>
                    <h4>Australian Health Professionals Regulation Agency</h4>
                    <Item.Meta>Member Number 1137541</Item.Meta>
                </Item.Content>
            </Item>

            <Item>
                <Item.Image size="tiny" src="https://storage.googleapis.com/inner_wisdom_bucket/medicare.png" />
                <Item.Content>
                    <h4 >Medicare Provider</h4>
                    <Item.Meta>Provider Number 2577293T</Item.Meta>
                </Item.Content>
            </Item>
            <Item>
                <Item.Image size="tiny" src="https://storage.googleapis.com/inner_wisdom_bucket/logo_PsycBA.png" />
                <Item.Content>
                    <h4>Psychology Board of Australia</h4>
                    {/* <Item.Meta>Provider Number 2577293T</Item.Meta> */}
                    <Item.Meta>
                        <p>Practice Endorsement Counselling Psychology</p>
                        <p>Approved Supervisor</p>
                    </Item.Meta>
                </Item.Content>
            </Item>
            <Item>
                <Item.Image size="tiny" src="https://storage.googleapis.com/inner_wisdom_bucket/appheader-logo-mb-2x.jpg" />
                <Item.Content>
                    <h4>Fellow Australian Psychological Society</h4>
                    {/* <Item.Meta>Provider Number 2577293T</Item.Meta> */}
                    <Item.Meta>
                        <p>Interest group memberships: Counselling Psychology, Psychology and Yoga</p>
                    </Item.Meta>
                </Item.Content>
            </Item>

        </Item.Group>
    </Container>

}
