import React, { useState } from 'react'
import { Image, Label, Icon, Item, } from "semantic-ui-react"
import moment from "moment"
import { EditorState, convertFromRaw } from 'draft-js';


function PostPreview(props) {
    const p = props.post
    const handleCardClick = (id) => {
        // props.history.push(`/posts/${id}`)
        window.location = `/posts/${id}`
    }

    const [editorState, setEditorState] = useState(
        props.post.body && props.post.body.length > 0 ?
            EditorState.createWithContent(convertFromRaw(JSON.parse(props.post.body)))
            :
            EditorState.createEmpty()
    );

    const firstParagraph = editorState.getCurrentContent().getFirstBlock().getText()
    return (


        <Item
            style={{ cursor: "pointer" }}
            key={p.id}
            onClick={() => handleCardClick(p.id)}>

            <Item.Content>
                <Image alt="post preview thumbnail" floated='left' size="small" src={p.feature_image} />
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
                    <p>{firstParagraph}</p>
                    {props.readMoreButton ? <a onClick={() => handleCardClick(p.id)}>Read more.</a> : null}
                </Item.Description>
            </Item.Content>
        </Item>

    )
}


export default PostPreview
