import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/common/Header'
import { inject, observer } from 'mobx-react'
import './AccountSafe.scss'

@inject('userStore')
@inject('localeStore')
@observer
class AccountSafe extends Component {
  render() {
    const {
      history,
      userStore: { hasPayPassword },
      localeStore: {
        locale: { ACCOUNT_SAFE }
      }
    } = this.props

    return (
      <div id="account-safe">
        <Header
          title={ACCOUNT_SAFE.SAFETY_CENTER}
          isShadow
          isFixed
          bgPrimary
          onHandle={() => history.push('/user-center')}
        />
        <div className="list">
          <Link to="/password/reset">
            <p>{ACCOUNT_SAFE.RESET_LOGIN_PWD}</p>
            <img
              className="arrow"
              src={require('../../assets/images/arrow-right.png')}
              alt=""
            />
          </Link>
          <Link to={`/password/${hasPayPassword ? 'repay' : 'pay'}`}>
            <p>
              {hasPayPassword
                ? ACCOUNT_SAFE.RESET_PAY_PWD
                : ACCOUNT_SAFE.SET_PAY_PWD}
            </p>
            <img
              className="arrow"
              src={require('../../assets/images/arrow-right.png')}
              alt=""
            />
          </Link>
        </div>
      </div>
    )
  }
}

export default AccountSafe
