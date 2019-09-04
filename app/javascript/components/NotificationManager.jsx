import React, { useState, useEffect } from 'react'

import { Container, Button } from "semantic-ui-react"
import styled from "styled-components"
import { connect } from "react-redux"

import Message from "./Message"

function NotificationManager(props) {
    const messages = props.notifications
    if (messages) return <>

        <div style={{ position: "fixed", top: "4rem", right: "1rem", width: "10rem", zIndex: 500 }}>
            {/* <Button onClick={() => props.dispatch({ type: "ADD_NOTIFICATION", value: { id: new Date, type: "notice", message: "hello world" } })}></Button> */}
            {messages.map(m => <Message key={m.id} message={m} />)}
        </div>
    </>
    else return null
}

const mapStateToProps = (state) => ({
    notifications: state.notifications
})

export default connect(mapStateToProps)(NotificationManager)
// export default Notification

