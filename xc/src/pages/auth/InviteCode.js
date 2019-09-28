import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Button, Toast } from 'antd-mobile'
import AccountHeader from '../../components/partial/AccountHeader'
import './InviteCode.scss'

@inject('authStore')
@inject('userStore')
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
    const { code } = this.state
    const { history, userStore, authStore } = this.props
    const { infoKey } = authStore

    userStore
      .newUserLogin({ info_key: infoKey, recommend_code: code })
      .then(() => {
        Toast.success('授权成功', 0.9, () => {
          history.push('/home')
        })
      })
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
