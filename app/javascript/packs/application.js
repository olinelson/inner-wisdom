import WebpackerReact from 'webpacker-react'
import App from 'components/App'

import FlashNotification from 'components/FlashNotification'
import Nav from "components/Nav"
import UserConsentCheckbox from "components/UserConsentCheckbox"
import Blog from "components/Blog"
import PostEditor from "components/PostEditor"
import Counselling from "components/Counselling"
import FAQS from "components/FAQS"
import Supervision from "components/Supervision"
import Contact from "components/Contact"
import Home from "components/Home"
import Appointments from "components/Appointments"
import MyAccount from "components/MyAccount"
import Schedule from "components/Schedule"

import "styled-components"
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'semantic-ui-css/semantic.min.css'
import "components/stylesheet.css"
import 'draft-js/dist/Draft.css';


WebpackerReact.setup({ App, PostEditor, MyAccount, Schedule, Home, Appointments, Counselling, FAQS, Supervision, Contact, Blog, FlashNotification, Nav, UserConsentCheckbox }) // ES6 shorthand for {Hello: Hello}