import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Header from '../../components/common/Header'
import { formatTime } from '../../utils/format'
import NoData from '../../components/common/NoData'
import './BargainRecord.scss'

@inject('localeStore')
@inject('personStore')
@inject('productStore')
@observer
class BargainRecord extends Component {
  componentDidMount() {
    const { personStore, productStore } = this.props
    productStore.getProductId().then(productId => {
      personStore.getSpecialRecords({ productId })
    })
  }

  render() {
    const { personStore, localeStore } = this.props
    const { specialRecords } = personStore
    const { HOME, COMMON } = localeStore.language || {}
    return (
      <div id="bargain-record">
        <Header title={HOME.PROMOTION_QUOTA_RECORDS} isFixed isShadow bgWhite />
        <ul>
          {specialRecords.map(record => (
            <li key={record.id}>
              <time>{formatTime(record.addTime)}</time>
              <p>
                <span>{record.remark}</span>
                <span>{record.amount}</span>
              </p>
            </li>
          ))}
          {specialRecords.length <= 0 && <NoData msg={COMMON.NO_DATA} />}
        </ul>
      </div>
    )
  }
}

export default BargainRecord
