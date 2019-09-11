import React from 'react'

export default function LinkOrATag(props) {
    // if (props.static) return <a href={`/#${props.to}`}>{props.children}</a>
    return <a href={`${process.env.BASE_URL}${props.to}`}>{props.children}</a>
    // return <Link to={props.to}>{props.children}</Link>
}
