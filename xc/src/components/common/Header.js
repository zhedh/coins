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
      hideIcon,
      bgPrimary
    } = this.props
    let classNames = ''
    classNames += isShadow ? 'shadow ' : ''
    classNames += isFixed ? 'fixed ' : ''
    classNames += bgWhite ? 'bg-White' : ''
    classNames += bgPrimary ? 'bg-Primary' : ''

    const iconSrc = icon
      ? icon
      : bgPrimary
        ? require('../../assets/images/arrow-left-1.png')
        : require('../../assets/images/arrow-left.png')

    return (
      <header id="common-header" className={classNames}>
        <img
          className={hideIcon ? 'hidden' : ''}
          src={iconSrc}
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
