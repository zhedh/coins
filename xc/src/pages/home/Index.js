import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { observer, inject } from 'mobx-react'
import { Carousel, WingBlank, Button } from 'antd-mobile'
import { FiChevronRight, FiHelpCircle } from 'react-icons/fi'
import { IoIosMegaphone, IoIosHelpCircle } from 'react-icons/io'
import { formatDate, formatSpecialOffer } from '../../utils/format'
import BuyCornor from '../../assets/images/new/buy-cornor.png'
import { COMMON, HOME } from '../../assets/static'
import Dialog from '../../components/common/Dialog'
import Header from '../../components/common/Header'
import NoData from '../../components/common/NoData'
import './Index.scss'

@inject('userStore')
@inject('personStore')
@inject('noticeStore')
@inject('productStore')
@observer
class Index extends Component {
  componentDidMount() {
    const { userStore, personStore, noticeStore, productStore } = this.props
    noticeStore.getNotices()
    if (userStore.isOnline) {
      personStore.getSpecial()
      productStore.getProducts().then(productId => {
        personStore.getDepositRecords({ productId, status: 0 })
      })
    }
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
    const hasRecords =
      userStore.isOnline && depositRecords && depositRecords.length > 0

    return (
      <div id="home">
        <section
          className="section-banner"
          style={{ backgroundImage: `url(${HOME.IMG_BG})` }}
        >
          <Header hideIcon title={HOME.TITLE} />
          <div className="special">
            <b>{formatSpecialOffer(personStore.allUsableSpecial)}</b>
            <small>可用特价额度</small>
          </div>
          <div className="right-corner">
            <img src={BuyCornor} alt="" />
            认购
          </div>
          {/* <ul style={{ display: 'none' }} className="tabs">
            <li
              onClick={() =>
                history.push(userStore.isOnline ? '/home/bargain' : '/login')
              }
            >
              <div className="text">
                {userStore.isOnline ? (
                  <b>{formatSpecialOffer(personStore.allUsableSpecial)}</b>
                ) : (
                  <span>登录查看</span>
                )}
                <br />
                <small>可用特价额度</small>
              </div>
              <FiChevronRight className="icon" />
            </li>
            <li
              onClick={() =>
                history.push(
                  userStore.isOnline ? '/home/inviter-friend' : '/login'
                )
              }
            >
              <div className="text inviter-award">
                <GoMailRead className="icon" />
                邀请奖励
              </div>
              <FiChevronRight className="icon" />
            </li>
          </ul> */}
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
              <span>24人</span>
              <small>当前团队F用户数</small>
            </div>
            <button>查看团队详情</button>
          </div>
          <div className="steps">
            {/*<Link to={userStore.isOnline ? '/home/deposit-history' : '/login'}>*/}
            {/*参与计划中*/}
            {/*</Link>*/}
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
                    <time>{formatDate(record.unlockTime)}</time>
                  </div>
                  <div className="main">
                    <small>
                      {formatDate(record.addTime)}
                      &nbsp;{record.remark}
                    </small>
                    {Number(record.amount).toFixed(0)}{' '}
                    {currentProduct.productName}
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
