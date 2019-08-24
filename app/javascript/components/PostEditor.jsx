import React, { Component } from 'react'
import Editor from 'react-medium-editor';
import { connect } from 'react-redux';
import { Container, Input, Divider, Menu, Checkbox, Label, Dropdown, Modal, Popup, Header, Button, Icon, Image, Segment, Placeholder, Dimmer } from "semantic-ui-react"
import PostViewer from './PostViewer';
import Dropzone from 'react-dropzone'
import styled from "styled-components"
import { withRouter } from "react-router-dom"

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

class PostEditor extends Component {

    constructor(props) {
        super()
        let post = props.posts.find(p => p.id == props.match.params.id)

        let editingDisabled = true
        if (props.user && props.user.id == post.user_id) editingDisabled = false


        this.state = {
            savedPost: post,
            editedPost: post,
            editingDisabled: editingDisabled,
            unsavedChanges: false,
            deleteModalShown: false,
            featureImage: post.feature_image,
            featureImageLoading: false,
            featureImageHovering: false,
            saving: false,
        }

    }



    handleChange = (text, medium) => {
        let unsavedChanges = false
        if (this.state.savedPost.body !== text) unsavedChanges = true
        this.setState({ editedPost: { ...this.state.editedPost, body: text }, unsavedChanges });
    }

    handlePublishChange = () => {
        this.setState({ editedPost: { ...this.state.editedPost, published: !this.state.editedPost.published }, unsavedChanges: true })
    }

    handleTitleChange = (e) => {
        this.setState({ editedPost: { ...this.state.editedPost, title: e.target.value }, unsavedChanges: true })
    }

    saveChanges = () => {

        this.setState({ saving: true })
        let post = this.state.editedPost

        fetch(`${process.env.BASE_URL}/posts/${post.id}`, {
            method: "PATCH",
            body: JSON.stringify({
                post
            }),
            headers: {
                "X-CSRF-Token": this.props.csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })

            .then(response => response.json())
            .then((e) => {
                this.setState({ saving: false, unsavedChanges: false })
                this.props.dispatch({ type: "SET_POSTS", value: e.posts })
            })

    }

    deletePost = () => {

        fetch(`${process.env.BASE_URL}/posts/${this.state.savedPost.id}`, {
            method: "DELETE",
            headers: {
                "X-CSRF-Token": this.props.csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(response => response.json())
            .then((e) => {
                this.props.history.push("/myaccount")
                this.props.dispatch({ type: "SET_POSTS", value: e.posts })
            })

    }

    deletePostModal = () => {
        return <Modal trigger={<Button basic icon="trash" content='Delete' />} basic size='small'>
            <Header icon='trash' content='Delete Post' />
            <Modal.Content>
                <p>Are you sure you want to delete this post? This action is irreversable.</p>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={this.deletePost} color='red' inverted>
                    <Icon name='remove' /> Yes, Delete
                            </Button>
                <Button color='green' inverted>
                    <Icon name='checkmark' /> Cancel
                            </Button>
            </Modal.Actions>
        </Modal>
    }

    toggleFeatureImageHovering = () => {
        this.setState({ featureImageHovering: !this.state.featureImageHovering })
    }

    showEditor = () => {

        return <>
            <Menu secondary>
                <Menu.Item >
                    {/* <Button
                        content="save changes"
                        disabled={!this.state.unsavedChanges}
                        onClick={this.saveChanges}
                    /> */}
                    <Button as='div' labelPosition='right'>
                        <Button
                            basic
                            content="Save"
                            icon="save"
                            disabled={!this.state.unsavedChanges}
                            onClick={this.saveChanges}
                            loading={this.state.saving}
                        />
                        <Label as='a'
                            basic
                            color={this.state.unsavedChanges ? "red" : "green"}
                            pointing='left'
                            content={this.state.unsavedChanges ? "Unsaved Changes" : "Changes Saved"}
                        />

                    </Button>

                </Menu.Item>
                <Menu.Menu position="right">


                    <Menu.Item>
                        <Checkbox checked={this.state.editedPost.published} slider onChange={this.handlePublishChange} />
                        <Label>{this.state.editedPost.published === true ?
                            <><Icon name='share alternate' /> Published</>
                            :
                            <><Icon name='user secret' /> Private</>
                        }</Label>
                    </Menu.Item>
                    <Menu.Item>

                        {this.deletePostModal()}
                    </Menu.Item>
                </Menu.Menu>
            </Menu>

            <Dropzone onDrop={(acceptedFiles) => this.uploadFiles(acceptedFiles)}>
                {({ getRootProps, getInputProps }) => (
                    <Container fluid>
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            {this.state.featureImage && this.state.featureImage.length > 0 ?

                                <FeatureImageSegment onMouseEnter={this.toggleFeatureImageHovering} onMouseLeave={this.toggleFeatureImageHovering} loading={this.state.featureImageLoading} tertiary style={{ backgroundImage: `url('${this.state.featureImage}') ` }}>
                                    {this.state.featureImageHovering === true ?
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

            <Container text>



                <Input transparent onChange={this.handleTitleChange} style={{ fontSize: "3rem", margin: "1rem 0" }} value={this.state.editedPost.title} />
                <Editor
                    text={this.state.editedPost.body}
                    onChange={this.handleChange}
                    options={{ disableEditing: this.state.editingDisabled, toolbar: { buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'] } }}
                />

            </Container>
        </>
    }

    uploadFiles = (acceptedFiles) => {
        this.setState({ featureImageLoading: true })
        let formData = new FormData();
        formData.append('file', acceptedFiles[0])

        fetch(`${process.env.BASE_URL}/attach/posts/${this.state.savedPost.id}`, {
            method: "POST",
            body: formData,



            headers: {
                "X-CSRF-Token": this.props.csrfToken,
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(response => response.json())
            .then((e) => {
                this.props.dispatch({ type: "SET_POSTS", value: e.posts })
                this.setState({ featureImage: e.feature_image, featureImageLoading: false })
            })

    }


    render() {
        if (this.state.editingDisabled === false) return this.showEditor()

        return <PostViewer post={this.state.savedPost} />


    }
}

const mapStateToProps = (state) => ({
    posts: state.posts,
    user: state.user,
    baseUrl: state.baseUrl,
    csrfToken: state.csrfToken
})


export default withRouter(connect(mapStateToProps)(PostEditor))