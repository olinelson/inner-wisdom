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
            {/* <Divider hidden/>
                <p>

                    <Header size="large" as="span">H</Header>aiores in ducimus quia alias ea quos sequi dolorum. Quam doloribus veritatis in amet velit aut. Esse blanditiis molestiae quod ea quia. Qui magnam nulla rem nihil provident.
    
                    Maxime autem iusto sed qui neque id odit recusandae. Quam ut odio veritatis. Et harum consequatur illum quis voluptas porro officia id.
    
                    Qui vel quam et ad illo ab omnis. Doloremque excepturi vero adipisci ea placeat molestiae eligendi. Consequuntur mollitia voluptas molestias. Quia sit soluta commodi. Ullam voluptatibus deserunt nobis dolor est perspiciatis minima impedit.
    
                    Dolores ut similique dolor voluptas est optio nihil est. Repellat cupiditate sunt harum aspernatur sint totam dolor dolorum. Repellat vel corporis id voluptas numquam.
    
                    Est occaecati est voluptatum ut provident. Nobis voluptatum dolor rerum illo dolorum omnis. Minus doloribus id placeat.
                </p>
                <Divider /> */}
            <Divider hidden />
            <PostsList posts={props.posts} blogView />
        </Container>
    </>
}
