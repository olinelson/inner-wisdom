import React, { useState, useEffect, useRef } from 'react'
import ClientShow from './ClientShow'
import InvoiceNotificationManager from './InvoiceNotificationManager'

// new appState stuff
import { StateProvider, useStateValue } from '../context/ClientShowContext';
import moment from 'moment';


const uuidv1 = require('uuid/v1')

export const getEvents = (appState, dispatch) => {
    fetch(`${process.env.BASE_URL}/events/booked/${appState.user.id}`, {
        headers: {
            "X-CSRF-Token": appState.csrfToken,
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest"
        }
    })
        .then(res => res.json())
        .catch(error => {
            dispatch({
                type: 'addNotification',
                notification: { id: new Date, type: "alert", message: "Could not retrieve events. Please refresh the page and try again. If this problem persists please contact your system administrator." }
            })
            console.error('Error:', error)
            dispatch({
                type: 'setLoadingEvents',
                loadingEvents: false
            })
        })
        .then((res) => {
            dispatch({
                type: 'setEvents',
                events: res.events
            })
        })
}


export const getInvoiceItems = (appState, dispatch) => {
    fetch(`${process.env.BASE_URL}/stripe/invoice_items`, {
        method: "POST",
        body: JSON.stringify({
            user: appState.user
        }),
        headers: {
            "X-CSRF-Token": appState.csrfToken,
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest"
        }
    })
        .then(res => res.json())
        .catch(error => {
            dispatch({
                type: 'addNotification',
                notification: { id: new Date, type: "alert", message: "Could not retrieve invoice items. Please try again. If this problem persists please contact your system administrator." }
            })
            console.error('Error:', error)
            dispatch({
                type: 'setLoadingInvoiceItems',
                loadingInvoiceItems: false
            })
        })
        .then((res) => {
            if (res.invoice_items.data) {
                dispatch({
                    type: 'setInvoiceItems',
                    invoiceItems: res.invoice_items.data
                })
            } else {
                dispatch({
                    type: 'setInvoiceItems',
                    invoiceItems: null
                })
            }

        })
}


export const getInvoices = (appState, dispatch) => {
    fetch(`${process.env.BASE_URL}/stripe/invoices`, {
        method: "POST",
        body: JSON.stringify({
            user: appState.user
        }),
        headers: {
            "X-CSRF-Token": appState.csrfToken,
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest"
        }
    })
        .then(res => res.json())
        .catch(error => {
            dispatch({
                type: 'addNotification',
                notification: { id: new Date, type: "alert", message: "Could not retrieve invoices. Please try again. If this problem persists please contact your system administrator." }
            })
            console.error('Error:', error)
            dispatch({
                type: 'setLoadingInvoices',
                loadingInvoices: false
            })
        })
        .then((res) => {
            dispatch({
                type: 'setInvoices',
                invoices: res.invoices
            })
        })
}




function ClientShowApp(props) {

    const csrfToken = document.querySelectorAll('meta[name="csrf-token"]')[0].content

    const initialState = {
        csrfToken,
        events: [],
        invoiceItems: null,
        user: props.user,

        loadingEvents: true,
        loadingInvoiceItems: true,
        loadingInvoices: true,

        approving: false,
        deleting: false,
        creating: false,
        notifications: [],
        emailError: false
    };

    const reducer = (state, action) => {
        switch (action.type) {
            case 'setLoading':
                return {
                    ...state,
                    loading: action.loading
                };
            case 'setEvents':
                return {
                    ...state,
                    events: action.events,
                    loadingEvents: false
                };
            case 'addNotification':
                let newNotification = action.notification
                newNotification.createdAt = moment()
                newNotification.expiresAt = moment().add(5, 'seconds')

                return {
                    ...state,
                    notifications: [...state.notifications, newNotification]
                };
            case 'setLoadingEvents':
                return {
                    ...state,
                    events: action.loadingEvents
                };
            case 'setInvoiceItems':
                return {
                    ...state,
                    invoiceItems: action.invoiceItems,
                    loadingInvoiceItems: false
                }
            case 'removeInvoiceItemAndUpdateEvent':
                let invoiceItem = action.invoiceItem
                let filteredInvoiceItems = state.invoiceItems.filter(i => i.id !== invoiceItem.id)

                return {
                    ...state,
                    invoiceItems: filteredInvoiceItems,
                    loadingInvoiceItems: false
                }
            case 'setInvoices':
                return {
                    ...state,
                    invoices: action.invoices,
                    loadingInvoices: false,
                }
            case 'setCreating':
                return {
                    ...state,
                    creating: action.creating,
                }
            case 'setUser':
                return {
                    ...state,
                    user: action.user,
                }
            case 'unShiftNotifications':
                let shiftedNotifications = [...state.notifications]
                shiftedNotifications.shift()

                return {
                    ...state,
                    notifications: shiftedNotifications
                }

            default:
                return state;
        }
    };








    return <StateProvider initialState={initialState} reducer={reducer}>
        <InvoiceNotificationManager />
        <ClientShow />
    </StateProvider>


}


export default ClientShowApp

