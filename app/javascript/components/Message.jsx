import React, { useState, useEffect } from 'react'
import { Message as SemanticMessage } from "semantic-ui-react"

export default function Message(props) {
    const [hidden, setHidden] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setHidden(true)
        }, 10000);
        return () => clearTimeout(timer);
    }, []);

    switch (props.message.type) {
        case "notice":
            return <SemanticMessage
                style={{ zIndex: 500 }}
                hidden={hidden}
                onDismiss={() => setHidden(true)}
                floating
                key={props.message.id}
                positive
                header='Notice'
                content={props.message.message}
            />
        case "warning":
            return <SemanticMessage
                style={{ zIndex: 500 }}
                hidden={hidden}
                onDismiss={() => setHidden(true)}
                floating
                key={props.message.id}
                warning
                header='Warning'
                content={props.message.message}
            />
        case "alert":
            return <SemanticMessage
                style={{ zIndex: 500 }}
                hidden={hidden}
                onDismiss={() => setHidden(true)}
                floating
                key={props.message.id}
                warning
                header='Alert'
                content={props.message.message}
            />
        default:
            return <SemanticMessage
                style={{ zIndex: 500 }}
                hidden={hidden}
                onDismiss={() => setHidden(true)}
                floating
                key={props.message.id}
                header='Notice'
                content={props.message.message}
            />
    }
}
