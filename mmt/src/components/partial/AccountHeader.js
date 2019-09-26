import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { withRouter } from 'react-router'
import './AccountHeader.scss'

@inject('localeStore')
@observer
class AccountHeader extends Component {
  onBack = () => {
    const { history, onHandle } = this.props

    if (onHandle) {
      onHandle()
      return
    }
    history.goBack()
  }

  switchLang = () => {
    const { localeStore, text } = this.props
    let locale
    if (text === '切换语言') {
      locale = 'zh_CN'
    } else {
      locale = 'en_US'
    }
    localeStore.changeLocale(locale)
  }

  render() {
    const { title = '重置密码', msg, hideBack, text } = this.props

    return (
      <div className="account-header">
        <div className="top">
          <img
            className={hideBack ? 'hidden' : ''}
            src={require('../../assets/images/arrow-left.png')}
            alt="返回"
            onClick={this.onBack}
          />
          {text && <span onClick={this.switchLang}>{text}</span>}
        </div>

        <h1>{title}</h1>
        {msg && <p>{msg}</p>}
      </div>
    )
  }
}

export default withRouter(AccountHeader)
