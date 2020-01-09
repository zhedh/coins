import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Button, Toast } from 'antd-mobile'
import Header from '../../components/common/Header'
import { TOAST_DURATION } from '../../utils/constants'
import './InviteCode.scss'

@inject('userStore')
@inject('localeStore')
@observer
class InviteCode extends Component {
  state = {
    code: ''
  }

  onInputChange = (e, key) => {
    const { value } = e.target
    this.setState({ [key]: value })
  }

  onSubmit = () => {
    const { history, userStore } = this.props;
    const {localeStore: {locale: {AUTH_CODE}}} = this.props;
    const { code } = this.state;
    const infoKey = userStore.getInfoKey();

    // if (!infoKey) {
    //   Toast.fail('授权失效，请返回重试')
    //   return
    // }

    userStore
      .newUserLogin({
        infoKey,
        recommendCode: code
      })
      .then(res => {
        if (res.status === 200) {
          Toast.success(AUTH_CODE.AUTH_SUCCESS, TOAST_DURATION, () => {
            history.push('/deposit')
          })
        } else {
          Toast.info(res.msg, TOAST_DURATION)
          //  () => { history.push('/zbx-login')}
        }
      })
  }

  render() {
    const {localeStore: {locale: {AUTH_CODE}}} = this.props;
    const { code } = this.state;
    const canSubmit = code === '';

    return (
      <div id="inviteCode">
        <Header title={AUTH_CODE.CODE} />
        <div className="content">
          <label>
            <input
              className="input-main"
              type="text"
              placeholder={AUTH_CODE.INPUT_CODE}
              value={code}
              onChange={e => this.onInputChange(e, 'code')}
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
            {AUTH_CODE.CONFIRM}
          </Button>
        </div>
      </div>
    )
  }
}

export default InviteCode
