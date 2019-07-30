import React from 'react'
import PostsList from './PostsList';
import { Container } from 'semantic-ui-react';

export default function Blog(props) {
    return (
        <Container>
            <PostsList {...props} blogView />
        </Container>
    )
}
