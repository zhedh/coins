import React from 'react'
import './SimpleHeader.scss'

export default function SimpleHeader(props) {
  const {title, bgColor = '', isFixed = false, color} = props
  const classNames = `simple-header ${isFixed ? 'fixed' : ''}`

  return (
    <header style={{background: bgColor, color}} className={classNames}>
      {title}
    </header>
  )
}
