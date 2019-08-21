import React from 'react'
import { Container, Header, Divider } from 'semantic-ui-react';
import Counselling from './Counselling';
import Supervision from './Supervision';
import Training from './Training';
import { Jumbotron } from './StyledComponents';
import FAQS from './FAQS';
import Memberships from './Memberships';

export default function About() {
    return <>
        <Jumbotron src="https://storage.googleapis.com/inner_wisdom_bucket/beautiful-bonsai-botany-1671256.jpg" />
        <Divider hidden />
        <Container>

            {/* <Header as="h1" content="About" /> */}
            {/* <Counselling />
            <Divider />
            <Supervision />
            <Divider />
            <Training />
            <Divider /> */}
            {/* <Memberships /> */}
            <Divider />
            <FAQS />


        </Container>
    </>
}
