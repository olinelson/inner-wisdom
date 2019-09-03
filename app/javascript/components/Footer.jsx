import React from 'react'
import { Icon, Divider } from "semantic-ui-react"
import { withRouter } from "react-router"

function Footer(props) {

    let path = props.location.pathname

    if (path === "/schedule" || path === "/appointments") return null

    return <>
        <Divider hidden />
        <div style={{ backgroundColor: "rgba(128,128,128,0.1)", height: "15rem", display: "flex", alignItems: "center", justifyContent: "center" }} >
            <span><Icon name="copyright" /> Inner Wisdom {new Date().getFullYear()}</span>
        </div>
    </>


}

export default withRouter(Footer)
