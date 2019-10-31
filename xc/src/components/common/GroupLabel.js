import React from 'react'
import './GroupLabel.scss'

export default function GroupLabel(props) {
  return (
    <div style={props.style} className="group-label">
      {props.title}
    </div>
  )
}
