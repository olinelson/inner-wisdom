import React from 'react'
import PostsList from './PostsList';
import { Container, Divider } from 'semantic-ui-react';

export default function Blog(props) {
    return <>

        <Container>
            <h1>Blog</h1>
            <Divider />
            <PostsList {...props} blogView />
        </Container>
    </>
}
