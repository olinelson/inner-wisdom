import WebpackerReact from 'webpacker-react'


// global components
import Nav from "components/Nav"
import UserConsentCheckbox from "components/UserConsentCheckbox"
import FlashNotification from 'components/FlashNotification'
import Footer from "components/Footer"


// pages
import Home from "components/Home"
import Counselling from "components/Counselling"
import Supervision from "components/Supervision"
import Fees from "components/Fees"
import FAQS from "components/FAQS"
import Blog from "components/BlogApp/Blog"
import Contact from "components/Contact"
import Appointments from "components/Appointments"
import MyAccount from "components/MyAccountApp/MyAccount"
import PostEditor from "components/BlogApp/PostEditor"


// admin pages
import Schedule from "components/ScheduleApp/Schedule"
import Clients from "components/Clients"
import ClientShowApp from "components/ClientShowApp/ClientShowApp"

// styles
import "styled-components"
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'semantic-ui-css/semantic.min.css'
import "components/stylesheet.css"
import 'draft-js/dist/Draft.css';


WebpackerReact.setup({
    ClientShowApp,
    PostEditor,
    Schedule,
    Footer,
    MyAccount,
    Clients,
    Home,
    Appointments,
    Counselling,
    FAQS,
    Supervision,
    Contact,
    Blog,
    FlashNotification,
    Nav,
    UserConsentCheckbox,
    Fees
}) // ES6 shorthand for {Hello: Hello}