import React, {Component} from 'react'
import {Toast} from "antd-mobile"
import {WalletApi} from "../../api"
import Header from '../../components/common/Header'
import {formatTime} from '../../utils/format'
import NoData from '../../components/common/NoData'
import './PlanPool.scss'

class Notices extends Component {
  state = {
    planFlow: []
  }

  componentDidMount() {
    const {match} = this.props
    const {id} = match.params
    WalletApi.getPlanPool({productId: id}).then(res => {
      if (res.status !== 1) {
        Toast.info(res.msg)
        return
      }
      this.setState({planFlow: res.data})
    })
  }

  render() {
    const {history} = this.props
    const {planList} = this.state

    return (
      <div id="planPool">
        <Header
          title="计划池流水"
          isShadow
          isFixed
          bgPrimary
          onHandle={() => history.push('/wallet')}
        />
        <section>
          {!!planList ? (
            planList.map((planItem, key) => (
              <ul
                key={key.toString()}
                className="list-item"
              >
                <div className="left-side">
                  <li>{planItem.remark}</li>
                  <li>{formatTime(planItem.addTime)}</li>
                </div>
                <span className="amount">+ {planItem.amount}</span>
              </ul>
            ))
          ) : (
            <NoData msg="暂无数据"/>
          )}
        </section>
      </div>
    )
  }
}

export default Notices
