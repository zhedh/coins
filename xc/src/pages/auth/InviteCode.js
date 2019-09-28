import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {Button, Toast} from 'antd-mobile'
import AccountHeader from '../../components/partial/AccountHeader'
import {TOAST_DURATION} from "../../utils/constants"
import './InviteCode.scss'

@inject('userStore')
@observer
class InviteCode extends Component {
  state = {
    code: ''
  }

  onInputChange = (e, key) => {
    const {value} = e.target
    this.setState({[key]: value})
  }

  onSubmit = () => {
    const {code} = this.state
    const {history, userStore} = this.props
    const infoKey = userStore.getInfoKey()

    if (!infoKey) {
      Toast.fail('授权失效，请返回重试')
      return
    }

    userStore
      .newUserLogin({
        infoKey,
        recommendCode: code
      })
      .then(res => {
        if (res.status === 200) {
          Toast.success('授权成功', TOAST_DURATION, () => {
            history.push('/deposit')
          })
          return
        }
        Toast.info(res.msg)
      })
  }

  render() {
    const {code} = this.state
    const canSubmit = code === ''

    return (
      <div id="inviteCode">
        <AccountHeader title="输入邀请码"/>
        <div className="content">
          <label>
            <input
              className="input-main"
              type="text"
              placeholder="请输入X-PLAN 邀请码"
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
