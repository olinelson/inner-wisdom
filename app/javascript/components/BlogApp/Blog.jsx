import React from 'react'
import PostsList from './PostsList';
import { Container, Divider } from 'semantic-ui-react';

import { Jumbotron } from '../StyledComponents';
import { createSecureContext } from 'tls';


export default function Blog(props) {

    let isAdmin = props.isAdmin



    return <>
        <Jumbotron style={{ backgroundImage: `url('https://storage.googleapis.com/inner_wisdom_bucket/ancient-art-asia-302100.jpg') `, backgroundPosition: "center" }} />


        <Container text>
            <Divider hidden />
            <PostsList isAdmin={isAdmin} posts={props.posts} blogView />
        </Container>
    </>
}
