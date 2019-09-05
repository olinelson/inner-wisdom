import React, { useState, useEffect } from 'react'
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import { connect } from 'react-redux';
import { Container, Input, Divider, Menu, Checkbox, Label, Dropdown, Modal, Popup, Header, Button, Icon, Image, Segment, Placeholder, Dimmer } from "semantic-ui-react"
import Dropzone from 'react-dropzone'
import styled from "styled-components"
import { withRouter } from "react-router-dom"
import { Jumbotron, EditorButtons } from './StyledComponents';

const uuidv1 = require('uuid/v1')

export const FeatureImageSegment = styled(Segment)`
    background-position: center !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;
    height: 50vh !important;
    margin: -1rem 0 0 0 !important;
    border: none !important;
    border-radius: 0 !important;
}
`

function PostEditor(props) {
    const [savedPost, setSavedPost] = useState(props.posts.find(p => p.id == props.match.params.id))
    const [post, setPost] = useState(savedPost)

    const [editorState, setEditorState] = useState(
        post.body && post.body.length > 0 ?
            EditorState.createWithContent(convertFromRaw(JSON.parse(post.body)))
            :
            EditorState.createEmpty()
    );

    useEffect(() => {
        window.scroll({
            top: 0,
            left: 0,
        })
    }, []);


    const editingDisabled = props.user && props.user.id == post.user_id ? false : true

    let saved = true
    savedPost.body !== JSON.stringify(convertToRaw(editorState.getCurrentContent())) ? saved = false : null
    savedPost.published !== post.published ? saved = false : null
    savedPost.title !== post.title ? saved = false : null




    const [deleteModalShown, setDeleteModalShown] = useState(false)

    const [featureImage, setFeatureImage] = useState(post.feature_image)

    const [featureImageLoading, setFeatureImageLoading] = useState(false)
    const [featureImageHovering, setFeatureImageHovering] = useState(false)
    const [saving, setSaving] = useState(false)

    const handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            setEditorState(newState)

            return 'handled';
        }
        return 'not-handled';
    }

    const saveChanges = () => {
        setSaving(true)

        let body = JSON.stringify(convertToRaw(editorState.getCurrentContent()))

        let editedPost = { ...post, body }
        fetch(`${process.env.BASE_URL}/posts/${post.id}`, {
            method: "PATCH",
            body: JSON.stringify({
                editedPost
            }),
            headers: {
                "X-CSRF-Token": props.csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })

            .then(response => response.json())
            .then((e) => {
                setSaving(false)
                setSavedPost(editedPost)
                props.dispatch({ type: "SET_POSTS", value: e.posts })
            })

    }

    // style button controls
    const onStyleClick = (command) => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, command))
    }

    const onBlockTypeClick = command => {
        setEditorState(RichUtils.toggleBlockType(editorState, command))
    }


    const deletePost = () => {
        fetch(`${process.env.BASE_URL}/posts/${savedPost.id}`, {
            method: "DELETE",
            headers: {
                "X-CSRF-Token": props.csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(response => response.json())
            .then((e) => {
                props.history.push("/myaccount")
                props.dispatch({ type: "SET_POSTS", value: e.posts })
                props.dispatch({ type: "ADD_NOTIFICATION", value: { id: uuidv1(), type: "notice", message: "Post Deleted" } })
            })

    }


    const uploadFiles = (acceptedFiles) => {
        setFeatureImageLoading(true)
        let formData = new FormData();
        formData.append('file', acceptedFiles[0])

        fetch(`${process.env.BASE_URL}/attach/posts/${savedPost.id}`, {
            method: "POST",
            body: formData,



            headers: {
                "X-CSRF-Token": props.csrfToken,
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(response => response.json())
            .then((e) => {
                props.dispatch({ type: "SET_POSTS", value: e.posts })
                setFeatureImage(e.feature_image)
                setFeatureImageLoading(false)
            })

    }

    const editingView = () => {
        return <>


            <Dropzone onDrop={(acceptedFiles) => uploadFiles(acceptedFiles)}>
                {({ getRootProps, getInputProps }) => (
                    <Container fluid >
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            {featureImage && featureImage.length > 0 ?

                                <FeatureImageSegment onMouseEnter={() => setFeatureImageHovering(true)} onMouseLeave={() => setFeatureImageHovering(false)} loading={featureImageLoading} tertiary style={{ backgroundImage: `url('${featureImage}') ` }}>
                                    {featureImageHovering === true ?
                                        <Dimmer active >
                                            <h4>Drag an image here to set featured image</h4>
                                            <small>or click here</small>
                                        </Dimmer>
                                        : null
                                    }
                                </FeatureImageSegment>

                                :
                                <Placeholder >
                                    {/* <Placeholder.Image /> */}
                                </Placeholder>
                            }

                        </div>
                    </Container>
                )}
            </Dropzone>



            <EditorButtons textAlign="center">
                <Button as='div' labelPosition='right'>
                    <Button
                        basic
                        content="Save"
                        icon="save"
                        disabled={saved}
                        onClick={() => saveChanges()}
                        loading={saving}
                    />
                    <Label as='a'
                        basic
                        color={!saved ? "red" : "green"}
                        pointing='left'
                        content={!saved ? "Unsaved Changes" : "Changes Saved"}
                    />

                </Button>
                <div>
                    <Button.Group
                        buttons={[
                            { key: 'H2', icon: 'header', onClick: () => onBlockTypeClick('header-two') },
                            { key: 'quote', icon: 'quote left', onClick: () => onBlockTypeClick('blockquote') },
                        ]}
                    />{" "}
                    <Button.Group
                        buttons={[
                            { key: 'ul', icon: 'list ul', onClick: () => onBlockTypeClick('unordered-list-item') },
                            { key: 'ol', icon: 'list ol', onClick: () => onBlockTypeClick('ordered-list-item') },
                            { key: 'un', icon: 'close', onClick: () => onBlockTypeClick('unstyled') },
                            // { key: 'atomic', icon: 'world', onClick: () => onBlockTypeClick('atomic') },
                        ]}
                    />{" "}
                    <Button.Group
                        buttons={[
                            { key: 'bold', icon: 'bold', onClick: () => onStyleClick('BOLD') },
                            { key: 'underline', icon: 'underline', onClick: () => onStyleClick('UNDERLINE') },
                            { key: 'italic', icon: 'italic', onClick: () => onStyleClick('ITALIC') },
                        ]}
                    />
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                    <Checkbox checked={post.published} slider onClick={() => setPost({ ...post, published: !post.published })} />
                    <Label>{post.published === true ?
                        <><Icon name='share alternate' /> Published</>
                        :
                        <><Icon name='user secret' /> Private</>
                    }</Label>

                    <Modal
                        closeIcon
                        basic
                        size="small"
                        trigger={<Button basic icon="trash" content='Delete' />}
                        header='Delete Post'
                        content='Are you sure you want to delete this post?'
                        actions={['Cancel', { key: 'delete', content: 'Yes, Delete', basic: true, negative: true, onClick: () => deletePost() }]}
                    />
                </div>
            </EditorButtons>
            <Container text>
                <Input fluid placeholder="Post Title" transparent onChange={(e) => setPost({ ...post, title: e.target.value })} style={{ fontSize: "3rem", margin: "1rem 0" }} value={post.title} />
            </Container>

        </>
    }

    const nonEditingView = () => {
        return <>
            <Jumbotron src={featureImage} />
            <Divider hidden />
            <Container text>
                <h1>{post.title}</h1>
            </Container>

        </>
    }

    return <>
        {editingDisabled ?

            nonEditingView()

            :
            editingView()
        }

        <Container text style={!editingDisabled ? { border: "1px solid grey" } : null}>




            <Editor

                editorState={editorState}
                onChange={setEditorState}
                handleKeyCommand={(c, es) => handleKeyCommand(c, es)}
                spellCheck
                readOnly={editingDisabled}
                placeholder="start writing your post here..."
            />
        </Container>
    </>



}

const mapStateToProps = (state) => ({
    posts: state.posts,
    user: state.user,
    csrfToken: state.csrfToken
})


export default withRouter(connect(mapStateToProps)(PostEditor))