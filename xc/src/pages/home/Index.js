import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { observer, inject } from 'mobx-react'
import { Carousel, WingBlank, Button, Toast } from 'antd-mobile'
import { IoIosMegaphone, IoIosHelpCircle } from 'react-icons/io'
import { formatDate, formatSpecialOffer } from '../../utils/format'
import { COMMON, HOME } from '../../assets/static'
import Dialog from '../../components/common/Dialog'
import SimpleHeader from '../../components/common/SimpleHeader'
import NoData from '../../components/common/NoData'
import OtherApi from '../../api/other'
import './Index.scss'

@inject('userStore')
@inject('personStore')
@inject('noticeStore')
@inject('productStore')
@observer
class Index extends Component {
  state = {
    mySpread: {}
  }

  componentDidMount() {
    const {
      userStore,
      personStore,
      noticeStore,
      productStore,
      history
    } = this.props

    if (!userStore.isOnline()) {
      Toast.info('请先登录', 2, () => history.push('/login'))
      return
    }
    noticeStore.getNotices()
    personStore.getSpecial()
    productStore.getProducts().then(productId => {
      personStore.getDepositRecords({ productId, status: 0 })
    })
    this.getMySpread()
  }

  getMySpread = () => {
    OtherApi.getMySpread().then(res => {
      if (res.status !== 1) {
        Toast.info(res.msg)
        return
      }
      this.setState({ mySpread: res.data })
    })
  }

  render() {
    const {
      history,
      userStore,
      personStore,
      noticeStore,
      productStore
    } = this.props
    const { notices } = noticeStore
    const { depositRecords } = personStore
    const { currentProduct } = productStore
    const { mySpread = {} } = this.state
    const hasRecords =
      userStore.isOnline() && depositRecords && depositRecords.length > 0

    return (
      <div id="home">
        <section
          className="section-banner"
          style={{ backgroundImage: `url(${HOME.IMG_BG})` }}
        >
          <SimpleHeader
            color="#393838"
            bgColor="transparent"
            title={HOME.TITLE}
          />
          <div className="special">
            <b>{formatSpecialOffer(personStore.allUsableSpecial)}</b>
            <small>可用特价额度</small>
          </div>
          <Link className="subscribe" to={{ pathname: '/deposit', state: 1 }}>
            <img src={HOME.SUBSCRIBE_ICON} alt="" />
            认购
          </Link>
          <div
            className="notice-carousel"
            onClick={() => (notices.length ? history.push('/notices') : '')}
          >
            <label>
              <IoIosMegaphone className="megaphone" />
              公告：
            </label>
            {notices.length ? (
              <WingBlank>
                <Carousel
                  className="carousel"
                  vertical
                  dots={false}
                  dragging={false}
                  swiping={false}
                  autoplay
                  infinite
                >
                  {notices.map(notice => (
                    <div
                      key={notice.id}
                      className="item"
                      // onClick={() => window.location.href=notice.linkUrl}
                      onClick={() => history.push('/notice/' + notice.id)}
                    >
                      {notice.title}
                    </div>
                  ))}
                </Carousel>
              </WingBlank>
            ) : (
              <span className="item">暂无公告</span>
            )}
          </div>
        </section>
        <section className="section-main">
          <div className="f-account">
            <div className="number">
              <span>{mySpread.followUserActiveCount || 0}人</span>
              <small>当前团队有效用户数</small>
            </div>
            <Link to="/home/generalize">查看团队详情</Link>
          </div>
          <div className="steps">
            <span>X PLAN</span>
            <Link to="/home/rule">
              规则介绍
              <IoIosHelpCircle className="icon" />
            </Link>
          </div>
          {hasRecords ? (
            <ul className="list">
              {depositRecords.map((record, key) => (
                <li key={key}>
                  <div className="aside">
                    返还日期
                    <small>{formatDate(record.unlockTime)}</small>
                  </div>
                  <div className="main">
                    <small>
                      {formatDate(record.addTime)}
                      {/*&nbsp;{record.remark}*/}
                    </small>
                    <span>
                      <b>{Number(record.amount).toFixed(0)} </b>
                      {currentProduct.productName}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-data-wrapper">
              <NoData img={COMMON.NO_DATA_IMG} msg="每天存一笔，天天有钱赚！" />
              <Button
                activeClassName="active"
                className="primary-button take-apart"
                onClick={() => history.push('/deposit')}
              >
                参与计划
              </Button>
            </div>
          )}
        </section>
        <Dialog
          show={false}
          title="温馨提示"
          msg="参与计划需先进行身份认证哦"
        />
      </div>
    )
  }
}

export default Index
