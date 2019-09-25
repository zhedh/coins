import React, {Component} from 'react'
import {inject, observer} from "mobx-react"
import {Toast} from "antd-mobile";
import Header from '../../components/common/Header'
import {formatCoinPrice, formatDate} from "../../utils/format"
import './WithdrawRecord.scss'

@inject('localeStore')
@inject('walletStore')
@observer
class WithdrawRecord extends Component {
  state = {records: [], type: null}

  componentDidMount() {
    const {walletStore, match} = this.props
    const {type} = match.params
    this.setState({type})
    walletStore.withdrawRecords({type}).then(res => {
      if (res.status !== 1) {
        Toast.info(res.msg)
        return
      }
      this.setState({records: res.data})
    })
  }

  getStatusLabel(status) {
    const {localeStore} = this.props
    const {WALLET} = localeStore.language || {}

    //状态，0待审核，1提币中，2提币成功，3审核拒绝
    switch (status) {
      case 0:
        return {
          label: WALLET.WAITING_FOR_REVIEW,
          className: 'pending'
        }
      case 1:
        return {
          label: WALLET.WITHDRAWING,
          className: 'pending'
        }
      case 2:
        return {
          label: WALLET.COMPLETED,
          className: 'succeed'
        }
      case 3:
        return {
          label: WALLET.REJECTED,
          className: 'danger'
        }
      default:
        return {
          label: '',
          className: ''
        }
    }
  }

  render() {
    const {localeStore} = this.props
    const {WALLET} = localeStore.language || {}
    const {records, type} = this.state;
    const isUsdt = type === 'USDT'

    return (
      <div id="withdraw-record">
        <Header title={WALLET.WITHDRAWAL_RECORD} isFixed isShadow/>
        <ul>
          {records.map(record =>
            <li key={record.id}>
              <p>
                <label>{WALLET.ADDRESS}</label>
                <span>{record.walletTo}</span>
              </p>
              <p>
                <label>{WALLET.DATE}</label>
                <span>{formatDate(record.addTime)}</span>
              </p>
              <p>
                <label>{(!isUsdt && record.tranNum) ? 'MUSDT' : ''}{WALLET.AMOUNT}</label>
                <span>{formatCoinPrice(record.amount)}</span>
              </p>
              {!isUsdt && record.tranNum && <p>
                <label>{WALLET.CONVERTED_MMT_AMOUNT}</label>
                <span>{formatCoinPrice(record.tranNum)}</span>
              </p>}
              {record.hash && <p>
                <label>Hash</label>
                <span>{record.hash}</span>
              </p>}
              <p>
                <label>{WALLET.STATUS}</label>
                <span className={this.getStatusLabel(record.status).className}>
                  {this.getStatusLabel(record.status).label}
                </span>
              </p>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default WithdrawRecord;
