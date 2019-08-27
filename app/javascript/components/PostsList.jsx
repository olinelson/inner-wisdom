import React from 'react'
import { Card, Menu, Image, Icon, Label, Button, Item } from "semantic-ui-react"
import { Link } from "react-router-dom"
import moment from 'moment'
import PostsPreview from "./PostPreview"
import { connect } from "react-redux"
import { withRouter } from 'react-router-dom'


function PostsList(props) {

    const handleCardClick = (id) => {
        props.history.push(`/posts/${id}`)
    }

    const cardMapper = (p) => {
        let firstParagraph = ReactHtmlParser(p.body)[0]

        return <PostsPreview blogView={props.blogView} key={p.id + "preview"} post={p} />

    }



    const createNewPost = () => {

        let user = props.user

        fetch(`${process.env.BASE_URL}/posts`, {
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
                <Menu.Item
                    name='create new'
                    content={<Button onClick={createNewPost} content="Create New" icon="add" basic />}
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