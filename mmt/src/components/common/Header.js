import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import './Header.scss'

class Header extends Component {
  onBack = () => {
    const {history, onHandle} = this.props

    if (onHandle) {
      onHandle()
    } else {
      history.goBack()
    }
  }

  render() {
    const {
      children,
      title = '',
      isShadow,
      isFixed,
      bgWhite,
      icon,
      hideIcon
    } = this.props
    let classNames = ''
    classNames += isShadow ? 'shadow ' : ''
    classNames += isFixed ? 'fixed ' : ''
    classNames += bgWhite ? 'bg-White' : ''

    return (
      <header id="common-header" className={classNames}>
        <img
          className={hideIcon ? 'hidden': ''}
          src={icon ? icon : require('../../assets/images/arrow-left.png')}
          alt="返回"
          onClick={this.onBack}
        />
        <span className="right-content">{title}</span>
        <div>{children}</div>
      </header>
    )
  }
}

export default withRouter(Header)
