import React, { useState, useEffect } from 'react'
import { Message as SemanticMessage } from "semantic-ui-react"

import moment from 'moment'

export default function Message(props) {


    let createdAt = moment(props.message.id)

    let deadline = createdAt.add(10, 'seconds')

    const [hidden, setHidden] = useState(moment().isAfter(deadline))

    // if (moment().isAfter(deadline)) {
    //     return null
    // }




    useEffect(() => {
        const timer = setTimeout(() => {
            console.log('This will run after 1 second!')
            setHidden(true)
        }, 10000);
        return () => clearTimeout(timer);
    }, []);






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
