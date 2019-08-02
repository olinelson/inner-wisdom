import React from 'react'
import { Card, Menu, Image, Icon, Label, Button, Item } from "semantic-ui-react"
import { Link } from "react-router-dom"
import moment from 'moment'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import PostsPreview from "./PostPreview"
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'


function PostsList(props) {

    const handleCardClick = (id) => {
        props.history.push(`/posts/${id}`)
    }

    const cardMapper = (p) => {
        let firstParagraph = ReactHtmlParser(p.body)[0]

        return <PostsPreview key={p.id + "preview"} post={p} />

        return <Item
            style={{ cursor: "pointer" }}
            key={p.id}
            onClick={() => handleCardClick(p.id)}>

            <Item.Content>
                <Image floated='left' size="tiny" src={p.feature_image} />
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
                </Item.Description>


            </Item.Content>



        </Item>
    }



    const createNewPost = () => {

        let user = props.user

        fetch(`${props.baseUrl}/posts`, {
            method: "POST",
            headers: {
                "X-CSRF-Token": props.csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(response => response.json())
            .then((e) => props.dispatch({ type: "SET_POSTS", value: e.posts }))

    }


    const showToolBar = () => {
        return <Menu style={{ gridArea: "toolBar" }} secondary>
            <Menu.Menu position="right">
                <Menu.Item icon="add" name='create new'
                    // active={activeItem === 'messages'}
                    onClick={createNewPost}
                />
            </Menu.Menu>

        </Menu>
    }

    const showUserOrPublishedPosts = () => {
        let sortedPosts = props.allPosts.sort((b, a) => a.id - b.id)
        // sort by date published coming soon!
        // let sortedPosts = props.allPosts.sort((a, b) => new Date(a.updated) - new Date(b.updated))

        if (props.blogView) return showPublishedPosts(sortedPosts)
        return showUsersPosts(sortedPosts)
    }

    const showUsersPosts = (sortedPosts) => {
        let result = sortedPosts.map(p => {
            if (p.user_id == props.user.id) return cardMapper(p)
        })
        return result
    }

    const showPublishedPosts = (sortedPosts) => {
        let result = sortedPosts.map(p => {
            if (p.published === true) return cardMapper(p)
        })
        return result
    }

    return <>
        {props.creatable ? showToolBar() : null}
        {/* <Card.Group style={{ gridArea: "panel" }} stackable >

            {showUserOrPublishedPosts()}

        </Card.Group> */}
        <Item.Group style={{ gridArea: "panel", margin: "0rem !important" }}  >

            {showUserOrPublishedPosts()}

        </Item.Group>
    </>
}

const mapStateToProps = (state) => ({
    user: state.user,
    allPosts: state.posts,
    myAccountPanel: state.myAccountPanel,
    refreshMethod: state.refreshMethod,
    baseUrl: state.baseUrl,
    csrfToken: state.csrfToken
})

export default withRouter(connect(mapStateToProps)(PostsList))