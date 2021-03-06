import React, { useState, useEffect } from 'react'

import { Message } from "semantic-ui-react"
import styled from "styled-components"


let CustomMessage = styled(Message)`
        // right: .5rem;
        // top: .5rem;

        // width: 10rem;
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
            case "error":
                return <CustomMessage
                    onDismiss={(e) => hideMessage(e)}
                    floating
                    key={message.id}
                    negative
                    header='Error'
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

