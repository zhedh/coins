import React, {Component} from 'react'
import {inject, observer} from "mobx-react"
import Header from "../../components/common/Header"
import {formatTime, formatCoinPrice} from "../../utils/format"
import NoData from "../../components/common/NoData"
import './BargainRecord.scss'

@inject('personStore')
@inject('productStore')
@observer
class BargainRecord extends Component {
  componentDidMount() {
    const {personStore, productStore} = this.props
    productStore.getProductId().then(productId => {
      personStore.getSpecialRecords({productId})
    })
  }

  render() {
    const {personStore} = this.props
    const {specialRecords} = personStore

    return (
      <div id="bargain-record">
        <Header title="特价额度记录" isFixed isShadow bgPrimary/>
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
            )}
          {specialRecords.length <= 0 && <NoData msg="暂无数据"/>}
        </ul>
      </div>
    );
  }
}

export default BargainRecord;
