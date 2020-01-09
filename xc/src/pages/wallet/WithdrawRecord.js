import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Toast } from 'antd-mobile'
import Header from '../../components/common/Header'
import { formatCoinPrice, formatDate } from '../../utils/format'
import './WithdrawRecord.scss'

@inject('walletStore')
@inject('localeStore')
@observer
class WithdrawRecord extends Component {
  state = { records: [] }

  componentDidMount() {
    const { walletStore, match } = this.props
    const { type } = match.params
    walletStore.withdrawRecords({ type }).then(res => {
      if (res.status !== 1) {
        Toast.info(res.msg)
        return
      }
      this.setState({ records: res.data })
    })
  }

  getStatusLabel(status) {
    const {
      localeStore: {
        locale: { WITHDRAW_RECORD }
      }
    } = this.props
    //状态，0待审核，1提币中，2提币成功，3审核拒绝
    switch (status) {
      case 0:
        return {
          label: WITHDRAW_RECORD.WAITING_FOR_REVIEW,
          className: 'pending'
        }
      case 1:
        return {
          label: WITHDRAW_RECORD.WITHDRAWING,
          className: 'pending'
        }
      case 2:
        return {
          label: WITHDRAW_RECORD.WITHDRAW_COMPLETED,
          className: 'succeed'
        }
      case 3:
        return {
          label: WITHDRAW_RECORD.WITHDRAW_REJECTED,
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
    const {
      records,
      localeStore: {
        locale: { WITHDRAW_RECORD }
      }
    } = this.state

    return (
      <div id="withdraw-record">
        <Header
          title={WITHDRAW_RECORD.WITHDRAWAL_RECORD}
          bgPrimary
          isFixed
          isShadow
        />
        <ul>
          {records.map(record => (
            <li key={record.id}>
              <p>
                <label>{WITHDRAW_RECORD.ADDRESS}</label>
                <span>{record.walletTo}</span>
              </p>
              <p>
                <label>{WITHDRAW_RECORD.DATE}</label>
                <span>{formatDate(record.addTime)}</span>
              </p>
              <p>
                <label>{WITHDRAW_RECORD.AMOUNT}</label>
                <span>{formatCoinPrice(record.amount)}</span>
              </p>
              {/*<p>*/}
              {/*<label>{WITHDRAW_RECORD.ORDER_NUMBER}</label>*/}
              {/*<span>{record.order}</span>*/}
              {/*</p>*/}
              {record.hash && (
                <p>
                  <label>Hash</label>
                  <span>{record.hash}</span>
                </p>
              )}
              <p>
                <label>{WITHDRAW_RECORD.STATUS}</label>
                <span className={this.getStatusLabel(record.status).className}>
                  {this.getStatusLabel(record.status).label}
                </span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default WithdrawRecord
