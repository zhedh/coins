import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {Button} from 'antd-mobile'
import {AUTH, COMMON} from '../../assets/static'
import './DepositResult.scss'

@inject('personStore')
@observer
class DepositResult extends Component {
  handleFinish = () => {
    const {history, location} = this.props
    const isUnLock = location.state === 'unLock'
    isUnLock ?
      history.push({pathname: '/deposit', state: 1}) :
      history.push('/home')
  }

  render() {
    const {history, location} = this.props
    const isUnLock = location.state === 'unLock'
    return (
      <div id="verified-result">
        <img
          className="result-img"
          alt="结果图片"
          src={AUTH.IMG_SUCCESS}
        />
        <div className="result-content">
          <h2>支付成功！</h2>
          <Button
            activeClassName="active"
            className="primary-button"
            onClick={this.handleFinish}
          >
            完成
          </Button>
          {!isUnLock && <Button
            activeClassName="active"
            className="primary-button hollow"
            onClick={() => history.push({pathname: '/deposit', state: 1})}
          >
            解锁{COMMON.COIN_NAME}
          </Button>}
        </div>
      </div>
    )
  }
}

export default DepositResult
