import React from 'react'
import ClientShow from './ClientShow'
import InvoiceNotificationManager from './InvoiceNotificationManager'
import moment from 'moment'

import { StateProvider } from './ClientShowContext'

export const getEvents = async (appState, dispatch) => {
  const res = await fetch(`${process.env.BASE_URL}/api/v1/api/v1/events/booked/${appState.user.id}`, {
    headers: {
      'X-CSRF-Token': appState.csrfToken,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
  try {
    const json = await res.json()
    dispatch({
      type: 'setEvents',
      events: json.events
    })
  } catch (error) {
    dispatch({
      type: 'addNotification',
      notification: { id: new Date(), type: 'alert', message: 'Could not retrieve events. Please refresh the page and try again. If this problem persists please contact your system administrator.' }
    })
    console.error('Error:', error)
    dispatch({
      type: 'setLoadingEvents',
      loadingEvents: false
    })
  }
}

export const getInvoiceItems = async (appState, dispatch) => {
  const res = await fetch(`${process.env.BASE_URL}/api/v1/stripe/invoice_items`, {
    method: 'POST',
    body: JSON.stringify({
      user: appState.user
    }),
    headers: {
      'X-CSRF-Token': appState.csrfToken,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
  try {
    const json = await res.json()
    if (json.invoice_items.data) {
      dispatch({
        type: 'setInvoiceItems',
        invoiceItems: json.invoice_items.data
      })
    } else {
      dispatch({
        type: 'setInvoiceItems',
        invoiceItems: null
      })
    }
  } catch (error) {
    dispatch({
      type: 'addNotification',
      notification: { id: new Date(), type: 'alert', message: 'Could not retrieve invoice items. Please try again. If this problem persists please contact your system administrator.' }
    })
    console.error('Error:', error)
    dispatch({
      type: 'setLoadingInvoiceItems',
      loadingInvoiceItems: false
    })
  }
}

export const getInvoices = async (appState, dispatch) => {
  const res = await fetch(`${process.env.BASE_URL}/api/v1/stripe/invoices`, {
    method: 'POST',
    body: JSON.stringify({
      user: appState.user
    }),
    headers: {
      'X-CSRF-Token': appState.csrfToken,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
  try {
    const json = await res.json()
    dispatch({
      type: 'setInvoices',
      invoices: json.invoices
    })
  } catch (error) {
    dispatch({
      type: 'addNotification',
      notification: { id: new Date(), type: 'alert', message: 'Could not retrieve invoices. Please try again. If this problem persists please contact your system administrator.' }
    })
    console.error('Error:', error)
    dispatch({
      type: 'setLoadingInvoices',
      loadingInvoices: false
    })
  }
}

export const refreshAction = (appState, dispatch) => {
  getInvoices(appState, dispatch)
  getInvoiceItems(appState, dispatch)
  getEvents(appState, dispatch)
}

function ClientShowApp (props) {
  const csrfToken = document.querySelectorAll('meta[name="csrf-token"]')[0].content

  const initialState = {
    csrfToken,

    events: [],
    invoiceItems: null,
    invoices: [],
    user: props.user,

    loadingEvents: true,
    loadingInvoiceItems: true,
    loadingInvoices: true,

    creating: false,
    notifications: [],
    emailError: false
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'setLoading':
        return {
          ...state,
          loading: action.loading
        }
      case 'setEvents':
        return {
          ...state,
          events: action.events,
          loadingEvents: false
        }
      case 'addNotification':
        const newNotification = action.notification
        newNotification.createdAt = moment()
        newNotification.expiresAt = moment().add(5, 'seconds')

        return {
          ...state,
          notifications: [...state.notifications, newNotification]
        }
      case 'setLoadingEvents':
        return {
          ...state,
          events: action.loadingEvents
        }
      case 'setInvoiceItems':
        return {
          ...state,
          invoiceItems: action.invoiceItems,
          loadingInvoiceItems: false
        }
      case 'removeInvoiceItemAndUpdateEvent':
        const invoiceItem = action.invoiceItem
        const filteredInvoiceItems = state.invoiceItems.filter(i => i.id !== invoiceItem.id)

        return {
          ...state,
          invoiceItems: filteredInvoiceItems,
          loadingInvoiceItems: false
        }
      case 'setInvoices':
        return {
          ...state,
          invoices: action.invoices,
          loadingInvoices: false
        }
      case 'setCreating':
        return {
          ...state,
          creating: action.creating
        }
      case 'setUser':
        return {
          ...state,
          user: action.user
        }
      case 'resetUserFromProps':
        return {
          ...state,
          user: props.user
        }
      case 'unShiftNotifications':
        const shiftedNotifications = [...state.notifications]
        shiftedNotifications.shift()

        return {
          ...state,
          notifications: shiftedNotifications
        }

      default:
        return state
    }
  }

  return <StateProvider initialState={initialState} reducer={reducer}>
      <InvoiceNotificationManager />
      <ClientShow />
           </StateProvider>
}

export default ClientShowApp
