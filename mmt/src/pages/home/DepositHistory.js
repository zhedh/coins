import React, { Component } from 'react'
import Header from '../../components/common/Header'
import './DepositHistory.scss'

const HISTORIES = [
  {
    id: 1,
    time: '2019.07.09 15:00',
    status: '已返还',
    order: '201907091234',
    depositZbx: '100.00',
    payUsdt: '58.89',
    fee: '0.15',
    exchangePrince: '0.45',
    returnZbx: '123.19'
  },
  {
    id: 2,
    time: '2019.07.09 15:00',
    status: '已返还',
    order: '201907091234',
    depositZbx: '100.00',
    payUsdt: '58.89',
    fee: '0.15',
    exchangePrince: '0.45',
    returnZbx: '123.19'
  }
]

class DepositHistory extends Component {
  state = {
    depositHistories: HISTORIES
  }

  render() {
    const { history } = this.props
    const { depositHistories } = this.state

    return (
      <div id="deposit-history">
        <Header
          title="参与计划历史"
          isFixed
          isShadow
          onHandle={() => history.push('/home')}
        />
        <ul>
          {depositHistories.map(history => (
            <li key={history.id}>
              <aside>
                <span>{history.time}</span>
                <small>{history.status}</small>
              </aside>
              <p>
                <label>订单号</label>
                <span>{history.order}</span>
              </p>
              <p>
                <label>X PLAN</label>
                <span>{history.depositZbx}</span>
              </p>
              <p>
                <label>支付USDT</label>
                <span>{history.payUsdt}</span>
              </p>
              <p>
                <label>含手续费</label>
                <span>{history.fee}</span>
              </p>
              <p>
                <label>返还日兑价XC/USDT</label>
                <span>{history.exchangePrince}</span>
              </p>
              <p>
                <label>到期返还XC</label>
                <span>{history.returnZbx}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default DepositHistory
