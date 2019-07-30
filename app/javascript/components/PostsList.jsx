import React from 'react'
import { Card, Menu, Image, Icon, Label, Button } from "semantic-ui-react"
import { Link } from "react-router-dom"
import moment from 'moment'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

import { connect } from "react-redux"


function PostsList(props) {

    const handleCardClick = (id) => {
        props.history.push(`/posts/${id}`)
    }

    const cardMapper = (p) => {
        let firstParagraph = ReactHtmlParser(p.body)[0]

        return <Card
            fluid
            key={p.id}
            onClick={() => handleCardClick(p.id)}>

            <Card.Content>
                <Image floated='left' size="tiny" src={p.feature_image} />
                <Card.Header>{p.title}</Card.Header>
                <Card.Meta>
                    <span className='date'>Created {moment(p.created_at).format('Do MMMM  YYYY')}</span>
                </Card.Meta>
                {/* <Card.Description> */}
                {firstParagraph}
                {/* </Card.Description> */}


            </Card.Content>
            {props.blogView ? null :
                <Card.Content textAlign="right" extra>
                    {p.published ?
                        <Label>
                            <Icon name='share alternate' /> Published
                        </Label>
                        :
                        <Label>
                            <Icon name='user secret' /> Private
                        </Label>
                    }
                </Card.Content>
            }


        </Card>
    }

    // const cardMapper = (p) => {
    //     return <Card
    //         key={p.id}
    //         onClick={() => handleCardClick(p.id)}>
    //         <Card.Content>
    //             <Image floated='left' size="tiny" src={p.feature_image} />
    //             <Card.Header>{p.title}</Card.Header>
    //             <Card.Meta>
    //                 <span className='date'>Created {moment(p.created_at).format('Do MMMM  YYYY')}</span>
    //             </Card.Meta>
    //             {/* <Card.Description> */}
    //             {firstParagraph}
    //             {p.published ?
    //                 <Label>
    //                     <Icon name='share alternate' /> Published
    //                     </Label>
    //                 :
    //                 <Label>
    //                     <Icon name='user secret' /> Private
    //                     </Label>
    //             }
    //             {/* </Card.Description> */}
    //         </Card.Content>

    //         {/* <Card.Content>
    //             <Card.Header>{p.title}</Card.Header>
    //             <Card.Meta>
    //                 <span className='date'>created {moment(p.created_at).format('Do MMMM  YYYY')}</span>
    //             </Card.Meta>
    //             <Card.Description>
    //                 {p.published ?
    //                     <Label>
    //                         <Icon name='share alternate' /> Published
    //                     </Label>
    //                     :
    //                     <Label>
    //                         <Icon name='user secret' /> Private
    //                     </Label>
    //                 }
    //             </Card.Description>
    //         </Card.Content> */}

    //     </Card>
    // }



    const createNewPost = () => {

        let user = props.user

        fetch(`${props.baseUrl}/posts`, {
            method: "POST",
            headers: {
                "X-CSRF-Token": this.props.csrfToken,
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
        let sortedPosts = props.allPosts.sort((b, a) => new Date(a.created) - new Date(b.created))
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
            if (p.published) return cardMapper(p)
        })
        return result
    }

    return <>
        {props.creatable ? showToolBar() : null}
        <Card.Group style={{ gridArea: "panel" }} stackable >

            {showUserOrPublishedPosts()}

        </Card.Group>
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

export default connect(mapStateToProps)(PostsList)