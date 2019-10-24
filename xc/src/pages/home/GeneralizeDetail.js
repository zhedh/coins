import React, {Component} from 'react'
import {Toast} from "antd-mobile"
import OtherApi from "../../api/other"
import {chineseCapital} from "../../utils/common"
import {formatTime} from "../../utils/format"
import Header from "../../components/common/Header"
import NoData from "../../components/common/NoData"
import GroupLabel from "../../components/common/GroupLabel"
import {formatCoinPrice} from "../../utils/format"
import './GeneralizeDetail.scss'


class GeneralizeDetail extends Component {
  state = {
    title: '一代推荐',
    users: []
  }

  componentDidMount() {
    const {match} = this.props
    const {id} = match.params
    this.setState({title: chineseCapital(id) + '代推荐'})
    this.getSpreadList(id)
  }

  getSpreadList = (id) => {
    OtherApi.getSpreadList({
      type: id
    }).then(res => {
      if (res.status !== 1) {
        Toast.info(res.msg)
        return;
      }
      this.setState({users: res.data})
    })
  }

  render() {
    const {title, users} = this.state;
    const hasUsers = users && users.length > 0

    return (
      <div id="generalize-detail">
        <Header title={title} isShadow bgPrimary isFixed/>
        <GroupLabel title="注:以下数据只代表前一天结算后的数据,旗下业绩包含本人"/>
        {hasUsers ?
          <ul>
            {users.map(user =>
              <li>
                <p>
                  <label>用户名称</label>
                  <span>{user.phoneNo || user.email}</span>
                </p>
                <p>
                  <label>推广时间</label>
                  <span>{formatTime(user.regTime)}</span>
                </p>
                <p>
                  <label>活跃成员</label>
                  <span>{user.followUserActiveCount}</span>
                </p>
                <p>
                  <label>有效成员</label>
                  <span></span>
                </p>
                <p>
                  <label>旗下业绩</label>
                  <span>{formatCoinPrice(user.followUserOrderingCount)}</span>
                </p>
              </li>
            )}
          </ul> : <NoData msg="暂无数据"/>
        }
      </div>
    );
  }
}

export default GeneralizeDetail
