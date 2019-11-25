import React, { useState } from 'react'
import { Image, Label, Icon, Item, } from "semantic-ui-react"
import moment from "moment"
import { EditorState, convertFromRaw } from 'draft-js';


function PostPreview(props) {
    const post = props.post
    const handleCardClick = (id) => {
        window.location = `/posts/${id}`
    }

    const [editorState, setEditorState] = useState(
        post.body && post.body.length > 0 ?
            EditorState.createWithContent(convertFromRaw(JSON.parse(post.body)))
            :
            EditorState.createEmpty()
    );

    const firstParagraph = editorState.getCurrentContent().getFirstBlock().getText()
    return (


        <Item
            style={{ cursor: "pointer" }}
            key={post.id}
            onClick={() => handleCardClick(post.id)}>

            <Item.Content>
                <Image alt="post preview thumbnail" floated='left' size="small" src={post.feature_image} />
                <Item.Header>{post.title}</Item.Header>
                <Item.Meta>
                    <span className='date'>Created {moment(post.created_at).format('Do MMMM  YYYY')}</span>
                    {!props.isAdmin ? null :
                        <>
                            {
                                post.published ?
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
                    <p>{firstParagraph}</p>
                    {props.readMoreButton ? <a onClick={() => handleCardClick(post.id)}>Read more.</a> : null}
                </Item.Description>
            </Item.Content>
        </Item>

    )
}


export default PostPreview
