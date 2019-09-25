import React, {Component} from 'react'
import {Toast} from "antd-mobile"
import OtherApi from "../../api/other"
import {chineseCapital} from "../../utils/common"
import {formatTime} from "../../utils/format"
import Header from "../../components/common/Header"
import NoData from "../../components/common/NoData"
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
        <Header title={title} isShadow isFixed/>
        {hasUsers ?
          <ul>
            <li>
              <span>用户</span>
              <time>推广时间</time>
            </li>
            {users.map(user =>
              <li key={user.regTime}>
                <span>{user.phoneNo || user.email}</span>
                <time>{formatTime(user.regTime)}</time>
              </li>)
            }
          </ul> : <NoData msg="暂无数据"/>
        }
      </div>
    );
  }
}

export default GeneralizeDetail
