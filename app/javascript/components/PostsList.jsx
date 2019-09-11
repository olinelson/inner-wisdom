import React, { useState, useEffect } from 'react'
import { Menu, Button, Placeholder, Item, } from "semantic-ui-react"
import PostsPreview from "./PostPreview"

function PostsList(props) {
    const csrfToken = document.querySelectorAll('meta[name="csrf-token"]')[0].content
    const [loading, setLoading] = useState(true)
    const [posts, setPosts] = useState([])


    useEffect(() => {
        props.blogView ? getPublishedPosts() : getAllPosts()
    }, []);

    // const handleCardClick = (id) => {
    //     props.history.push(`/posts/${id}`)
    // }

    const cardMapper = (p) => {
        return <PostsPreview blogView={props.blogView} key={p.id + "preview"} post={p} />
    }

    const getAllPosts = () => {
        fetch(`${process.env.BASE_URL}/posts`, {
            headers: {
                "X-CSRF-Token": csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(response => response.json())
            .then((r) => {
                setPosts(r.posts)
                console.log(r)
                setLoading(false)
            })
    }
    const getPublishedPosts = () => {
        fetch(`${process.env.BASE_URL}/posts/published`, {
            headers: {
                "X-CSRF-Token": csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(response => response.json())
            .then((r) => {
                setPosts(r.posts)
                console.log(r)
                setLoading(false)
            })
    }



    const createNewPost = () => {
        fetch(`${process.env.BASE_URL}/posts`, {
            method: "POST",
            headers: {
                "X-CSRF-Token": csrfToken,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })
            .then(response => response.json())
            .then((r) => {
                setPosts([r.newPost, ...posts])

            })
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

    return <>

        {props.creatable ? showToolBar() : null}

        <Item.Group style={{ gridArea: "panel" }}  >
            {loading ?
                <>
                    <Placeholder>
                        <Placeholder.Header image >
                            <Placeholder.Line />
                            <Placeholder.Line />
                        </Placeholder.Header>
                    </Placeholder>
                    <Placeholder>
                        <Placeholder.Header image>
                            <Placeholder.Line />
                            <Placeholder.Line />
                        </Placeholder.Header>
                    </Placeholder>
                    <Placeholder>
                        <Placeholder.Header image>
                            <Placeholder.Line />
                            <Placeholder.Line />
                        </Placeholder.Header>
                    </Placeholder>
                </>
                : null
            }
            {posts.map(p => cardMapper(p))}
            {!loading && posts.length < 1 ? <p>no blog posts yet...</p> : null}
        </Item.Group>
    </>
}

export default PostsList