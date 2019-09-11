import React, { useState, useEffect } from 'react'

import { Message } from "semantic-ui-react"
import styled from "styled-components"


let CustomMessage = styled(Message)`
        // position: fixed !important;
        // right: .5rem;
        // top: .5rem;
        // z-index: 1;
        // width: 10rem;
    `

let CustomContainer = styled.div`
        border: 1px solid red;
        display: grid;
        justify-content: center;
        padding: 1rem;
        z-index: 1;
        postion: absolute;
    `

function Notification(props) {

    const [messages, setMessages] = useState(props.notifications)

    const [currentCount, setCount] = useState(props.notifications ? props.notifications.length : 0)


    const hideMessage = (e) => {
        e.target.parentElement.style.display = "none"
    }

    const renderMessage = (message) => {
        switch (message.type) {
            case "notice":
                return <CustomMessage
                    onDismiss={(e) => hideMessage(e)}
                    floating
                    key={message.id}
                    positive
                    header='Notice'
                    content={message.message}
                />
            case "alert":
                return <CustomMessage
                    onDismiss={(e) => hideMessage(e)}
                    floating
                    key={message.id}
                    warning
                    header='Alert'
                    content={message.message}
                />
        }
    }

    const deleteMessage = () => {

        if (currentCount === 1) setMessages([])
        else setMessages([...messages].slice(1))
        setCount(currentCount - 1)
    }

    useEffect(
        () => {

            if (currentCount <= 0) {
                return;
            }
            const id = setInterval(deleteMessage, 5000);
            return () => clearInterval(id);
        },
        [currentCount]
    )


    if (messages) return <div style={{ position: "fixed", top: "4rem", right: "1rem", width: "10rem" }}>
        {messages.map(m => renderMessage(m))}
    </div>
    else return null


}
export default Notification

