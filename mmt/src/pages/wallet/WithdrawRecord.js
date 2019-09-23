import React, {Component} from 'react'
import {inject, observer} from "mobx-react"
import {Toast} from "antd-mobile";
import Header from '../../components/common/Header'
import {formatCoinPrice, formatDate} from "../../utils/format"
import './WithdrawRecord.scss'

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
    //状态，0待审核，1提币中，2提币成功，3审核拒绝
    switch (status) {
      case 0:
        return {
          label: '待审核',
          className: 'pending'
        }
      case 1:
        return {
          label: '提币中',
          className: 'pending'
        }
      case 2:
        return {
          label: '提币成功',
          className: 'succeed'
        }
      case 3:
        return {
          label: '审核拒绝',
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
    const {records, type} = this.state;
    const isUsdt = type === 'USDT'

    return (
      <div id="withdraw-record">
        <Header title="提币记录" isFixed isShadow/>
        <ul>
          {records.map(record =>
            <li key={record.id}>
              <p>
                <label>地址</label>
                <span>{record.walletTo}</span>
              </p>
              <p>
                <label>时间</label>
                <span>{formatDate(record.addTime)}</span>
              </p>
              <p>
                <label>{(!isUsdt && record.tranNum) ? 'MUSDT' : ''}数量</label>
                <span>{formatCoinPrice(record.amount)}</span>
              </p>
              {!isUsdt && record.tranNum && <p>
                <label>折合MMT</label>
                <span>{formatCoinPrice(record.tranNum)}</span>
              </p>}
              {record.hash && <p>
                <label>Hash</label>
                <span>{record.hash}</span>
              </p>}
              <p>
                <label>状态</label>
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
