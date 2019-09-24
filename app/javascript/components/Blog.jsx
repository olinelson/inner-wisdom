import React, { useEffect } from 'react'
import PostsList from './PostsList';
import { Container, Divider, Header, Segment, Button } from 'semantic-ui-react';

import { FeatureImageSegment } from "./PostEditor"
import { Jumbotron } from './StyledComponents';


export default function Blog(props) {
    useEffect(() => {
        // window.scroll({
        //     top: 0,
        //     left: 0,
        // })
    }, []);

    return <>
        <Jumbotron style={{ backgroundImage: `url('https://storage.googleapis.com/inner_wisdom_bucket/ancient-art-asia-302100.jpg') `, backgroundPosition: "center" }} />


        <Container text>
            <Divider hidden />
            <PostsList posts={props.posts} blogView />
        </Container>
    </>
}
