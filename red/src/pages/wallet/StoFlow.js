import React, {Component} from 'react';
import Header from "../../components/common/Header";
import WalletApi from "../../api/wallet";
import {Toast} from "antd-mobile";
import {formatCoinPrice, formatTime} from "../../utils/format";
import InfiniteScroll from "react-infinite-scroll-component";
import {inject, observer} from "mobx-react";
import './StoFlow.scss';

@inject('localeStore')
@observer
class StoFlow extends Component {
  state = {
    list: [],
    hasMore: true,
    page: 1,
    pageSize: 10,
  };

  componentDidMount() {
    this.getList();
  }

  getList = () => {
    const {page, pageSize, list} = this.state;
    WalletApi.getStoList({page, row: pageSize}).then(res => {
      if (res.status !== 1) {
        Toast.info(res.msg);
        return
      }
      const arr = res.data.sort((a, b) => b.addTime - a.addTime);
      const hasMore = arr.length >= pageSize;
      list.push(...arr);
      this.setState({list, hasMore, page: hasMore ? page + 1 : 1});
    })
  };

  render() {
    const {
      history,
      localeStore: {locale: {MY_WALLET}}
    } = this.props;
    const {list,hasMore} = this.state;

    return (
      <div className="sto-flow">
        <Header
          title="STO 账户流水"
          isShadow
          isFixed
          bgPrimary
          onHandle={() => history.push('/wallet')}
        />
        <InfiniteScroll
          dataLength={list.length}
          next={this.getList}
          hasMore={hasMore}
          loader={<p style={{textAlign: 'center'}} className="loading">{MY_WALLET.LOADING}</p>}
          endMessage={
            <p style={{textAlign: 'center', color: '#ccc'}}>
              {list.length <= 0
                ? MY_WALLET.NO_RECORD
                : MY_WALLET.TO_LOWER_THE}
            </p>
          }
        >
          <ul>
            {list.map((item, key) => (
              <li key={key}>
                <div className="info">
                  {item.remark}
                  <small>{formatTime(item.addTime)}</small>
                </div>
                <div className="amount">
                  {formatCoinPrice(item.amount)}
                </div>
              </li>
            ))}
          </ul>
        </InfiniteScroll>
      </div>
    );
  }
}

export default StoFlow;
