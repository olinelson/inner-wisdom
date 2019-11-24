import React, { useEffect, useState } from 'react'
import Message from '../Message'
const uuidv1 = require('uuid/v1')
import moment from 'moment'

import { useStateValue } from './ClientShowContext'

export default function InvoiceNotificationManager() {
    const [appState, dispatch] = useStateValue();

    const { notifications } = appState

    return (

        <div style={{ position: "fixed", right: "1rem", zIndex: "100" }}>

            {notifications.map(n => {
                if (moment().isBefore(n.expiresAt)) {
                    return < Message key={uuidv1()} message={n} />
                } else {
                    return null
                }

            })}
        </div>
    )
}