import React from 'react'
import { Link } from "react-router-dom"

export default function LinkOrATag(props) {
    if (props.static) return <a href={`/#${props.to}`}>{props.children}</a>
    return <Link to={props.to}>{props.children}</Link>
}
