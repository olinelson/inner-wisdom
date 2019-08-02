import React from 'react'
import styled from "styled-components"
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import { Card, Image, Label, Icon, Item, Button, Divider } from "semantic-ui-react"
import moment from "moment"
import { withRouter } from 'react-router-dom'
import { connect } from "react-redux"

function PostPreview(props) {

    const handleCardClick = (id) => {
        props.history.push(`/posts/${id}`)
    }

    let p = props.post
    let firstParagraph = ReactHtmlParser(p.body)[0]
    return (


        <Item
            style={{ cursor: "pointer" }}
            key={p.id}
            onClick={() => handleCardClick(p.id)}>

            <Item.Content>
                <Image floated='left' size="small" src={p.feature_image} />
                <Item.Header>{p.title}</Item.Header>
                <Item.Meta>
                    <span className='date'>Created {moment(p.created_at).format('Do MMMM  YYYY')}</span>
                    {props.blogView ? null :
                        <>
                            {
                                p.published ?
                                    <Label>
                                        <Icon name='share alternate' /> Published
                        </Label>
                                    :
                                    <Label>
                                        <Icon name='user secret' /> Private
                        </Label>
                            }
                        </>

                    }

                </Item.Meta>
                <Item.Description>
                    {firstParagraph}
                    {props.readMoreButton ? <a onClick={() => handleCardClick(p.id)}>Read more.</a> : null}
                </Item.Description>



            </Item.Content>



        </Item>

    )
}


export default withRouter(connect()(PostPreview))
