import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Button, Toast } from 'antd-mobile'
import { TOAST_DURATION } from '../../utils/constants'
import { isEmail, isMobile, isPassword } from '../../utils/reg'
import AccountHeader from '../../components/partial/AccountHeader'
import './InviteCode.scss'

class InviteCode extends Component {
  state = {
    code: ''
  }

  onInputChange = (e, key) => {
    const { value } = e.target
    this.setState({ [key]: value })
  }

  onSubmit = () => {
    const { code } = this.state
  }

  render() {
    const { code } = this.state
    const canSubmit = code === ''

    return (
      <div id="inviteCode">
        <AccountHeader title="输入邀请码" />
        <div className="content">
          <label>
            <input
              className="input-main"
              type="text"
              placeholder="请输入X-PLAN 邮箱/手机号"
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
            确认
          </Button>
        </div>
      </div>
    )
  }
}

export default InviteCode
