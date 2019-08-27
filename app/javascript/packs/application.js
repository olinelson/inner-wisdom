// This file is will automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript, and only use these pack files to reference
// that code, so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

// require('dotenv').config()
// import dotenv from 'dotenv'



import WebpackerReact from 'webpacker-react'

import App from 'components/App'

import FlashNotification from 'components/FlashNotification'
import Nav from "components/Nav"


import "styled-components"
// import 'react-big-calendar/lib/sass/styles';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'semantic-ui-css/semantic.min.css'
import "components/stylesheet.css"
import 'draft-js/dist/Draft.css';




WebpackerReact.setup({ App, FlashNotification, Nav }) // ES6 shorthand for {Hello: Hello}