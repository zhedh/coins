import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Button, Toast } from 'antd-mobile'
import Header from '../../components/common/Header'
import openPwdImg from '../../assets/images/open-pwd.png'
import closePwdImg from '../../assets/images/close-pwd.png'
import { isEmail, isMobile, isPassword } from '../../utils/reg'
import { TOAST_DURATION } from '../../utils/constants'
import './Bind.scss'

@inject('userStore')
@inject('localeStore')
@observer
class Bind extends Component {
  state = {
    account: '',
    password: '',
    phonePrefix: '86',
    type: 'password'
  };

  onInputChange = (e, key) => {
    const { value } = e.target;
    this.setState({ [key]: value })
  }

  onSetType = currentType => {
    this.setState({ type: currentType === 'text' ? 'password' : 'text' })
  }

  onSubmit = () => {
    const {localeStore: {locale: {AUTH_BIND}}} = this.props;
    const { history, userStore } = this.props;
    const infoKey = userStore.getInfoKey();
    const { account, password, phonePrefix } = this.state;

    // if (!infoKey) {
    //   Toast.fail(AUTH_BIND.AUTH_FAILURE_TO_RETRY)
    //   return
    // }

    if (!isEmail(account) && !isMobile(account)) {
      Toast.info(AUTH_BIND.ACCOUNT_ERR, TOAST_DURATION);
      return
    }

    if (!isPassword(password)) {
      Toast.info(AUTH_BIND.PASSWORD_ERR, TOAST_DURATION);
      return
    }

    userStore
      .oldUserLogin({
        infoKey,
        userName: account,
        password,
        phonePrefix: isMobile(account) ? phonePrefix : null
      })
      .then(res => {
        if (res.status === 200) {
          Toast.success(AUTH_BIND.AUTH_SUCCESS, TOAST_DURATION, () => {
            history.push('/deposit')
          })
        } else {
          Toast.info(res.msg, TOAST_DURATION)
          // Toast.info(res.msg, TOAST_DURATION, () => {
          //   history.push('/zbx-login')
          // })
        }
      })
  };

  render() {
    const {localeStore: {locale: {AUTH_BIND}}} = this.props;
    const { account, password, type } = this.state;
    const canSubmit = account === '' || password === '';

    return (
      <div id="bind">
        <Header title={AUTH_BIND.ACCOUNT_BIND} />
        <div className="content">
          <label>
            <input
              className="input-main"
              type="text"
              placeholder={AUTH_BIND.INPUT_EMAIL_OR_PHONE}
              value={account}
              onChange={e => this.onInputChange(e, 'account')}
            />
          </label>
          <label>
            <input
              className="input-main"
              type={type}
              placeholder={AUTH_BIND.PASSWORD}
              value={password}
              onChange={e => this.onInputChange(e, 'password')}
            />
            <img
              src={type === 'text' ? openPwdImg : closePwdImg}
              alt=""
              onClick={() => this.onSetType(type)}
            />
          </label>
        </div>

        <div className="btn-box">
          <Button
            activeClassName="active"
            className="primary-button"
            disabled={canSubmit}
            onClick={this.onSubmit}
          >
            {AUTH_BIND.CONFIRM_BIND}
          </Button>
        </div>
      </div>
    )
  }
}

export default Bind
