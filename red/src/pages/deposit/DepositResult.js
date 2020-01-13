import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {Button} from 'antd-mobile'
import {AUTH, ASSET_COMMON} from '../../assets/static'
import './DepositResult.scss'

@inject('personStore')
@inject('localeStore')
@observer
class DepositResult extends Component {
  handleFinish = () => {
    const {history, location} = this.props;
    const isUnLock = location.state === 'unLock';
    isUnLock
      ? history.push({pathname: '/deposit', state: 1})
      : history.push('/home')
  };

  render() {
    const {localeStore: {locale: {DEPOSIT_RESULT}}} = this.props;
    const {history, location} = this.props;
    const isUnLock = location.state === 'unLock';
    return (
      <div id="verified-result">
        <img className="result-img" alt="结果图片" src={AUTH.IMG_SUCCESS}/>
        <div className="result-content">
          <h2>{DEPOSIT_RESULT.PAY_SUCCESS}</h2>
          {/* {!isUnLock && <p>
            {DEPOSIT_RESULT.DESC}
          </p>} */}
          <Button
            activeClassName="active"
            className="primary-button"
            onClick={this.handleFinish}
          >
            {DEPOSIT_RESULT.FINISH}
          </Button>
          {!isUnLock && (
            <Button
              activeClassName="active"
              className="primary-button hollow"
              onClick={() => history.push({pathname: '/deposit', state: 1})}
            >
              {DEPOSIT_RESULT.UNLOCK}{ASSET_COMMON.COIN_NAME}
            </Button>
          )}
        </div>
      </div>
    )
  }
}

export default DepositResult
