import WebpackerReact from 'webpacker-react'
import App from 'components/App'

import FlashNotification from 'components/FlashNotification'
import Nav from "components/Nav"
import UserConsentCheckbox from "components/UserConsentCheckbox"

import "styled-components"
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'semantic-ui-css/semantic.min.css'
import "components/stylesheet.css"
import 'draft-js/dist/Draft.css';





WebpackerReact.setup({ App, FlashNotification, Nav, UserConsentCheckbox }) // ES6 shorthand for {Hello: Hello}