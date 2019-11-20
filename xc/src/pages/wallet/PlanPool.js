import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Header from '../../components/common/Header'
import { formatTime } from '../../utils/format'
import NoData from '../../components/common/NoData'
import './PlanPool.scss'

// @inject('noticeStore')
@observer
class Notices extends Component {
  state = {
    planList: [
      {
        title: '22',
        addTime: '3232',
        amount: '323'
      },
      {
        title: '22',
        addTime: '3232',
        amount: '323'
      }
    ]
  }

  render() {
    const { history } = this.props
    const { planList } = this.state

    return (
      <div id="planPool">
        <Header
          title="计划池流水"
          isShadow
          isFixed
          bgPrimary
          onHandle={() => history.push('/user-center')}
        />
        <section>
          {!!planList ? (
            planList.map((planItem, key) => (
              <ul
                key={key.toString()}
                className="list-item"
                // onClick={() => history.push('/notice/' + planItem.id)}
              >
                <div className="left-side">
                  <li>{planItem.title}</li>
                  <li>{formatTime(planItem.addTime)}</li>
                </div>
                <span className="amount">+ {planItem.amount}</span>
              </ul>
            ))
          ) : (
            <NoData msg="暂无数据" />
          )}
        </section>
      </div>
    )
  }
}

export default Notices
