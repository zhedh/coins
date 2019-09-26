import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Button } from 'antd-mobile'
import { AUTH_ASSET } from '../../assets'
import './DepositResult.scss'

@inject('localeStore')
@inject('personStore')
@observer
class DepositResult extends Component {
  handleFinish = () => {
    const { history, location } = this.props
    const isUnLock = location.state === 'unLock'
    isUnLock
      ? history.push({ pathname: '/deposit', state: 1 })
      : history.push('/home')
  }

  render() {
    const { history, location, localeStore } = this.props
    const { DEPOSIT } = localeStore
    const isUnLock = location.state === 'unLock'
    return (
      <div id="verified-result">
        <img className="result-img" alt="结果图片" src={AUTH_ASSET.IMG_SUCCESS} />
        <div className="result-content">
          <h2>{DEPOSIT.PAY_SUCCESS}！</h2>
          <Button
            activeClassName="active"
            className="primary-button"
            onClick={this.handleFinish}
          >
            {DEPOSIT.FINISH}
          </Button>
          {!isUnLock && (
            <Button
              activeClassName="active"
              className="primary-button hollow"
              onClick={() => history.push({ pathname: '/deposit', state: 1 })}
            >
              {DEPOSIT.UNLOCK_MUSDT}
            </Button>
          )}
        </div>
      </div>
    )
  }
}

export default DepositResult
