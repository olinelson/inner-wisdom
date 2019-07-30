import React from 'react'
import styled from "styled-components"
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import { Card, Image, Label, Icon } from "semantic-ui-react"
import moment from "moment"

export default function PostPreview(props) {
    let html = ReactHtmlParser(props.post.body)[0]

    console.log(html)

    // let sliced = html.slice(" ")

    // console.log(sliced)



    let p = props.post

    // console.log(firstImage)

    return (


        <Card
            fluid
            key={p.id}
        // onClick={() => handleCardClick(p.id)}
        >
            <Image size="medium" src={p.feature_image} />
            <Card.Content>
                <Card.Header>{p.title}</Card.Header>
                <Card.Meta>
                    <span className='date'>created {moment(p.created_at).format('Do MMMM  YYYY')}</span>
                </Card.Meta>
                <Card.Description>
                    {p.published ?
                        <Label>
                            <Icon name='share alternate' /> Published
                        </Label>
                        :
                        <Label>
                            <Icon name='user secret' /> Private
                        </Label>
                    }
                </Card.Description>
                {html}
            </Card.Content>

        </Card>

    )
}
