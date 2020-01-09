import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {observer, inject} from 'mobx-react'
import {Carousel, WingBlank, Button, Toast} from 'antd-mobile'
import {IoIosMegaphone, IoIosHelpCircle} from 'react-icons/io'
import {formatDate, formatSpecialOffer} from '../../utils/format'
import {COMMON, ASSET_HOME} from '../../assets/static'
import Dialog from '../../components/common/Dialog'
import SimpleHeader from '../../components/common/SimpleHeader'
import NoData from '../../components/common/NoData'
import OtherApi from '../../api/other'
import './Index.scss'

@inject('userStore')
@inject('personStore')
@inject('noticeStore')
@inject('productStore')
@inject('localeStore')
@observer
class Index extends Component {
  state = {
    mySpread: {}
  };

  componentDidMount() {
    const {
      history,
      userStore,
      personStore,
      noticeStore,
      productStore,
      localeStore: {locale: {HOME}}
    } = this.props;

    if (!userStore.isOnline()) {
      Toast.info(HOME.PLEASE_LOGIN_FIRST, 2, () => history.push('/login'));
      return
    }
    noticeStore.getNotices();
    personStore.getSpecial();
    productStore.getProducts().then(productId => {
      personStore.getDepositRecords({productId, status: 0})
    });
    this.getMySpread();
  }

  getMySpread = () => {
    OtherApi.getMySpread().then(res => {
      if (res.status !== 1) {
        Toast.info(res.msg);
        return
      }
      this.setState({mySpread: res.data})
    })
  }

  render() {
    const {
      history,
      userStore,
      personStore,
      noticeStore,
      productStore,
      localeStore: {locale: {HOME}}
    } = this.props;
    const {notices} = noticeStore;
    const {depositRecords} = personStore;
    const {currentProduct} = productStore;
    const {mySpread = {}} = this.state;
    const hasRecords =
      userStore.isOnline() && depositRecords && depositRecords.length > 0;

    return (
      <div id="home">
        <section
          className="section-banner"
          style={{backgroundImage: `url(${ASSET_HOME.IMG_BG})`}}
        >
          <SimpleHeader
            color="#393838"
            bgColor="transparent"
            title={HOME.X_PLAN}
          />
          <div className="special">
            <b>{formatSpecialOffer(personStore.allUsableSpecial)}</b>
            <small>{HOME.AVAILABLE_PROMOTION}</small>
          </div>
          <Link className="subscribe" to={{pathname: '/deposit', state: 1}}>
            <img src={ASSET_HOME.SUBSCRIBE_ICON} alt=""/>
            {HOME.SUBSCRIB}
          </Link>
          <div
            className="notice-carousel"
            onClick={() => (notices.length ? history.push('/notices') : '')}
          >
            <label>
              <IoIosMegaphone className="megaphone"/>
              {HOME.NOTICE}：
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
                      onClick={() => history.push('/notice/' + notice.id)}
                    >
                      {notice.title}
                    </div>
                  ))}
                </Carousel>
              </WingBlank>
            ) : (
              <span className="item">{HOME.NO_NOTICE}</span>
            )}
          </div>
        </section>
        <section className="section-main">
          <div className="f-account">
            <div className="number">
              <span>{mySpread.followUserActiveCount || 0}人</span>
              <small>{HOME.EFFECTIVE_USER_COUNT}</small>
            </div>
            <Link to="/home/generalize">{HOME.SEE_TEAMS_DETAIL}</Link>
          </div>
          <div className="steps">
            <span>{HOME.X_PLAN}</span>
            <Link to="/home/rule">
              {HOME.RULES}
              <IoIosHelpCircle className="icon"/>
            </Link>
          </div>
          {hasRecords ? (
            <ul className="list">
              {depositRecords.map((record, key) => (
                <li key={key}>
                  <div className="aside">
                    {HOME.RETURN_DATE}
                    <small>{formatDate(record.unlockTime)}</small>
                  </div>
                  <div className="main">
                    <small>
                      {formatDate(record.addTime)}
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
              <NoData img={COMMON.NO_DATA_IMG} msg={HOME.JOIN_EVERYDAY}/>
              <Button
                activeClassName="active"
                className="primary-button take-apart"
                onClick={() => history.push('/deposit')}
              >
                {HOME.ATTEND_PLAN}
              </Button>
            </div>
          )}
        </section>
        <Dialog
          show={false}
          title={HOME.WARM_REMINDER}
          msg={HOME.DEPOSIT_BEFORE_AUTH}
        />
      </div>
    )
  }
}

export default Index
