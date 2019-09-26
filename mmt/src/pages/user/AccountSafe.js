import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'
import Header from '../../components/common/Header'
import './AccountSafe.scss'

@inject('userStore')
@inject('localeStore')
@observer
class AccountSafe extends Component {
  render() {
    const {
      history,
      localeStore,
      userStore: { hasPayPassword }
    } = this.props
    const { USER_CENTER, PASSWORD } = localeStore.language || {}

    return (
      <div id="account-safe">
        <Header
          title={USER_CENTER.SECURITY_CENTER}
          isShadow={true}
          onHandle={() => history.push('/user-center')}
        />
        <Link to="/password/reset">
          <p>{USER_CENTER.RESET_LOGIN_PASSWORD}</p>
          <img
            className="arrow"
            src={require('../../assets/images/arrow-right.png')}
            alt=""
          />
        </Link>
        <Link to={`/password/${hasPayPassword ? 'repay' : 'pay'}`}>
          <p>
            {hasPayPassword
              ? PASSWORD.RESET_PAY_PASSWORD
              : PASSWORD.SET_PAY_PASSWORD}
          </p>
          <img
            className="arrow"
            src={require('../../assets/images/arrow-right.png')}
            alt=""
          />
        </Link>
      </div>
    )
  }
}

export default AccountSafe
