// This file is will automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript, and only use these pack files to reference
// that code, so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

// require('dotenv').config()
// import dotenv from 'dotenv'

// console.log(require('dotenv').config({ path: '../../../.env' }))

import WebpackerReact from 'webpacker-react'
// components
// import Calendar from 'components/Calendar'
// import Checkout from 'components/Checkout'
import App from 'components/App'
// import Home from 'components/Home'
import FlashNotification from 'components/FlashNotification'
// import Nav from "components/Nav"
// import Appointments from "components/Appointments"
// import PostEditor from "components/PostEditor"
// import PostsList from "components/PostsList"
// import PostViewer from "components/PostViewer"
// import PostPreview from "components/PostViewer"
// import Blog from "components/Blog"
import StaticNav from "components/StaticNav"




import 'reset-css'
import 'medium-editor/dist/css/medium-editor.css'
import 'medium-editor/dist/css/themes/default.css'
import "styled-components"
// import 'react-big-calendar/lib/sass/styles';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'semantic-ui-css/semantic.min.css'
import "components/stylesheet.css"



WebpackerReact.setup({ App, FlashNotification, StaticNav }) // ES6 shorthand for {Hello: Hello}