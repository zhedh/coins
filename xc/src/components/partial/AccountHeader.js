import React, {Component} from 'react'
import {withRouter} from "react-router";
import './AccountHeader.scss'

class AccountHeader extends Component {
  onBack = () => {
    const {history, onHandle} = this.props

    if (onHandle) {
      onHandle()
      return
    }
    history.goBack()
  }

  render() {
    const {title = '重置密码', msg, hideBack} = this.props

    return (
      <div className="account-header">
        <img
          className={hideBack ? 'hidden' : ''}
          src={require('../../assets/images/arrow-left.png')}
          alt="返回"
          onClick={this.onBack}
        />
        <h1>{title}</h1>
        {msg && <p>{msg}</p>}
      </div>
    );
  }
}

export default withRouter(AccountHeader)
