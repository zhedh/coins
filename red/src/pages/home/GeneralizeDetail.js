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
import {inject, observer} from "mobx-react";

@inject('localeStore')
@observer
class GeneralizeDetail extends Component {
  state = {
    title: '一代推荐',
    users: [],
    hasMore: true,
    page: 1,
    row: 10,
    type: 1,
  }

  componentDidMount() {
    const {match} = this.props;
    // const {localeStore: {locale: {GENERALIZE_RECORD}}} = this.props;
    const {id} = match.params;
    this.setState({title: chineseCapital(id) + '代推荐', type: id});
    this.getSpreadList()
  }

  getSpreadList = () => {
    const {page, row, type, users} = this.state;
    OtherApi.getSpreadList({
      type,
      page,
      row
    }).then(res => {
      if (res.status !== 1) {
        Toast.info(res.msg);
        this.setState({hasMore: false});

        return;
      }
      const arr = res.data;
      const hasMore = arr.length === row;
      users.push(...arr);
      this.setState({users, hasMore, page: hasMore ? page + 1 : 1})
    })
  };

  render() {
    const {localeStore: {locale: {GENERALIZE_RECORD}}} = this.props;
    const {title, users, hasMore} = this.state;

    return (
      <div id="generalize-detail">
        <Header title={title} isShadow bgPrimary isFixed/>
        <GroupLabel style={{fontSize: '1.1rem'}} title={GENERALIZE_RECORD.REMARK}/>

        <InfiniteScroll
          dataLength={users.length}
          next={this.getSpreadList}
          hasMore={hasMore}
          loader={<p style={{textAlign: 'center', color: '#ccc'}}>{GENERALIZE_RECORD.LOADING}</p>}
          endMessage={
            <div style={{textAlign: 'center', color: '#ccc'}}>
              {users.length <= 0 ? <NoData msg={GENERALIZE_RECORD.NO_RECORD}/> : <p>{GENERALIZE_RECORD.TO_LOWER_THE}</p>}
            </div>
          }
        >
          <ul>
            {users.map((user, key) =>
              <li key={key}>
                <p>
                  <label>{GENERALIZE_RECORD.USER_ACCOUNT}</label>
                  <span>{cryptoAccountDisplay(user.phoneNo || user.email)}</span>
                </p>
                <p>
                  <label>{GENERALIZE_RECORD.REFERRING_DATE}</label>
                  <span>{formatTime(user.regTime)}</span>
                </p>
                <p>
                  <label>{GENERALIZE_RECORD.EFFECTIVE_MEMBERS}</label>
                  <span>{user.followUserActiveCount}</span>
                </p>
                <p>
                  <label>{GENERALIZE_RECORD.PERFORMANCE}</label>
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
