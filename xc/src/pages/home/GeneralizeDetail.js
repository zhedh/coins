import React, {Component} from 'react'
import {Toast} from "antd-mobile"
import InfiniteScroll from 'react-infinite-scroll-component'
import OtherApi from "../../api/other"
import {chineseCapital} from "../../utils/common"
import {cryptoAccountDisplay, formatTime} from "../../utils/format"
import Header from "../../components/common/Header"
import NoData from "../../components/common/NoData"
import GroupLabel from "../../components/common/GroupLabel"
import {formatCoinPrice} from "../../utils/format"
import './GeneralizeDetail.scss'


class GeneralizeDetail extends Component {
  state = {
    title: '一代推荐',
    users: [{
      phoneNo: 18368095040,
      regTime: +new Date() / 1000
    }, {
      phoneNo: '2@qq.com',
      regTime: +new Date() / 1000
    }, {
      phoneNo: '2ererjekj43@qq.com',
      regTime: +new Date() / 1000
    }],

    hasMore: true,
    page: 1,
    row: 10,
    type: 1,
  }

  componentDidMount() {
    const {match} = this.props
    const {id} = match.params
    this.setState({title: chineseCapital(id) + '代推荐', type: id})
    this.getSpreadList()
  }

  getSpreadList = () => {
    const {page, row, type, users} = this.state
    // console.log({page, row, type})
    OtherApi.getSpreadList({
      type,
      page,
      row
    }).then(res => {
      // console.log(res)
      if (res.status !== 1) {
        Toast.info(res.msg)
        this.setState({hasMore: false})

        return;
      }
      const arr = res.data
      const hasMore = arr.length === row
      users.push(...arr)
      this.setState({users, hasMore, page: hasMore ? page + 1 : 1})
    })
  }

  render() {
    const {title, users, hasMore} = this.state;

    return (
      <div id="generalize-detail">
        <Header title={title} isShadow bgPrimary isFixed/>
        <GroupLabel style={{fontSize: '1.1rem'}} title="注：以下数据只代表前一天结算后的数据，旗下业绩不包含其本人"/>

        <InfiniteScroll
          dataLength={users.length}
          next={this.getSpreadList}
          hasMore={hasMore}
          loader={<p style={{textAlign: 'center', color: '#ccc'}}>加载中...</p>}
          endMessage={
            <div style={{textAlign: 'center', color: '#ccc'}}>
              {users.length <= 0 ? <NoData msg="暂无数据"/> : <p>已经到底了！</p>}
            </div>
          }
        >
          <ul>
            {users.map((user, key) =>
              <li key={key}>
                <p>
                  <label>用户名称</label>
                  <span>{cryptoAccountDisplay(user.phoneNo || user.email)}</span>
                </p>
                <p>
                  <label>推广时间</label>
                  <span>{formatTime(user.regTime)}</span>
                </p>
                <p>
                  <label>有效成员</label>
                  <span>{user.followUserActiveCount}</span>
                </p>
                <p>
                  <label>旗下业绩</label>
                  <span>{formatCoinPrice(user.followUserOrderingCount)}</span>
                </p>
              </li>
            )}
          </ul>
        </InfiniteScroll>
      </div>
    );
  }
}

export default GeneralizeDetail
