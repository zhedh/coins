import React, {Component} from 'react'
import {inject, observer} from "mobx-react"
import InfiniteScroll from "react-infinite-scroll-component"
import {Toast} from "antd-mobile"
import {PersonApi} from "../../api"
import Header from "../../components/common/Header"
import {formatTime, formatCoinPrice} from "../../utils/format"
import NoData from "../../components/common/NoData"
import './BargainRecord.scss'

@inject('productStore')
@inject('localeStore')
@observer
class BargainRecord extends Component {
  state = {
    productId: '',
    specialRecords: [],
    hasMore: true,
    page: 1,
    row: 10,
  }

  componentDidMount() {
    const {productStore} = this.props
    productStore.getProductId().then(productId => {
      this.setState({productId}, () => this.getSpecialRecords())
    })
  }

  getSpecialRecords = () => {
    const {page, row, productId, specialRecords} = this.state;

    PersonApi.getSpecialRecords({
      productId, page, row
    }).then(res => {
      if (res.status !== 1) {
        Toast.info(res.msg);
        this.setState({hasMore: false});

        return;
      }
      const arr = res.data;
      const hasMore = arr.length === row;
      specialRecords.push(...arr);
      this.setState({specialRecords, hasMore, page: hasMore ? page + 1 : 1})
    })
  };

  render() {
    const {localeStore: {locale: {BARGAIN_RECORD}}} = this.props;
    const {specialRecords, hasMore} = this.state;

    return (
      <div id="bargain-record">
        <Header title={BARGAIN_RECORD.PROMOTION_RECORD} isFixed isShadow bgPrimary/>
        <div className="space">&nbsp;</div>
        <InfiniteScroll
          dataLength={specialRecords.length}
          next={this.getSpecialRecords}
          hasMore={hasMore}
          loader={<p style={{textAlign: 'center', color: '#ccc'}}>{BARGAIN_RECORD.LOADING}</p>}
          endMessage={
            <div style={{textAlign: 'center', color: '#ccc'}}>
              {specialRecords.length <= 0 ? <NoData msg={BARGAIN_RECORD.NO_RECORD}/> : <p className="footer">{BARGAIN_RECORD.TO_LOWER_THE}</p>}
            </div>
          }
        >
          <ul>
            {
              specialRecords.map(record =>
                <li key={record.id}>
                  <label>
                    {record.remark}
                    <time>{formatTime(record.addTime)}</time>
                  </label>
                  <span className={`count ${record.amount > 0 ? 'add' : 'minus'}`}>
                  {formatCoinPrice(record.amount)}
                </span>
                </li>
              )
            }
          </ul>
        </InfiniteScroll>
      </div>
    );
  }
}

export default BargainRecord;
