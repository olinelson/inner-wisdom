import React from 'react'
import { Icon, Divider } from "semantic-ui-react"

export default function Footer() {
    return <>
        <Divider hidden />
        <div style={{ backgroundColor: "rgba(128,128,128,0.1)", height: "20rem", display: "flex", alignItems: "center", justifyContent: "center" }} >
            <span><Icon name="copyright" /> Inner Wisdom {new Date().getFullYear()}</span>
        </div>
    </>


}
