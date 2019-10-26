import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import Header from '../../components/common/Header'
import {inject, observer} from 'mobx-react'
import './AccountSafe.scss'

@inject('userStore')
@observer
class AccountSafe extends Component {
  render() {
    const {
      history,
      userStore: {hasPayPassword}
    } = this.props

    return (
      <div id="account-safe">
        <Header
          title="安全中心"
          isShadow
          isFixed
          bgPrimary
          onHandle={() => history.push('/user-center')}
        />
        <div className="list">
          <Link to="/password/reset">
            <p>重置登录密码</p>
            <img
              className="arrow"
              src={require('../../assets/images/arrow-right.png')}
              alt=""
            />
          </Link>
          <Link to={`/password/${hasPayPassword ? 'repay' : 'pay'}`}>
            <p>{hasPayPassword ? '重置交易密码' : '设置交易密码'}</p>
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
