import React, { Component } from 'react'

import { Message, Container } from "semantic-ui-react"
import styled from "styled-components"

let CustomMessage = styled(Message)`
        position: fixed !important;
        right: .5rem;
        top: .5rem;
        z-index: 1;
        width: 10rem;
    `

let CustomContainer = styled.div`
        border: 1px solid red;
        display: grid;
        justify-content: center;
        padding: 1rem;
        z-index: 1;
        postion: absolute;
    `

export default class Notification extends Component {

    state = {
        hideNotification: false
    }

    componentDidMount = () => {
        setTimeout(() => { this.setState({ hideNotification: true }) }, 3000);
    }


    renderMessage = () => {
        switch (this.props.type) {
            case "notice":
                return <CustomMessage
                    positive
                    // header='Notice'
                    content={this.props.message}
                />
            case "alert":
                return <CustomMessage
                    warning
                    header='Alert'
                    content={this.props.message}
                />
        }
    }


    // return <CustomContainer centered >{renderMessage(props)}</CustomContainer>
    render() {
        return this.state.hideNotification ? null : this.renderMessage()
    }

}

