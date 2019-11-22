import React, { useState, useEffect } from 'react'
import { Message as SemanticMessage } from "semantic-ui-react"
import moment from 'moment'

export default function Message(props) {
    const [hidden, setHidden] = useState(false)



    useEffect(() => {
        let interval = setInterval(() => {
            if (moment().isAfter(props.message.expiresAt)) {
                setHidden(true)
                clearInterval(interval)
            }
        }, 500);

        return () => clearInterval(interval);
    });

    if (!props.message) return null
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
                negative
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
