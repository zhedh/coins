import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Toast } from 'antd-mobile'
import { inject } from 'mobx-react'
import { OtherApi } from '../../api'
import { HOME_MMT } from '../../assets/static'
import arrowLeft from '../../assets/images/arrow-left.png'
import arrowRightWhite from '../../assets/images/arrow-right-white.png'
import './Generalize.scss'
@inject('localeStore')
class Generalize extends Component {
  state = {
    mySpread: {}
  }

  componentDidMount() {
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

  toDetail = id => {
    const { history } = this.props
    history.push(`/home/generalize/${id}`)
  }

  render() {
    const { localeStore } = this.props
    const { HOME } = localeStore.language || {}
    const { mySpread = {} } = this.state
    return (
      <div id="generalize">
        <section
          className="section-banner"
          style={{ backgroundImage: `url(${HOME.GENERALIZE_BG})` }}
        >
          <h1>
            <Link to="/home/inviter-friend">
              <img src={arrowRightWhite} alt="返回" />
            </Link>
            {HOME.MY_REFERRALS}
          </h1>
          <div className="content">
            <div className="count">
              {mySpread.recommendAllCount}
              <small>{HOME.TOTAL_REFERRALS}</small>
            </div>
          </div>
        </section>
        <section className="section-main">
          <div className="group">
            <label>{HOME.REFERRING_LIST}</label>
            <ul className="list">
              <li onClick={() => this.toDetail(1)}>
                <p>
                  <img src={HOME_MMT.GENERALIZE_USER_ONE_ICON} alt="" />
                  {HOME.FIRST_GENERATION_REFERRALS}
                </p>
                <aside>
                  {mySpread.recommendCount}
                  <img src={arrowLeft} alt="" />
                </aside>
              </li>
              <li onClick={() => this.toDetail(2)}>
                <p>
                  <img src={HOME.GENERALIZE_USER_TWO_ICON} alt="" />
                  {HOME.SECOND_GENERATION_REFERRALS}
                </p>
                <aside>
                  {mySpread.recommendCount2}
                  <img src={arrowLeft} alt="" />
                </aside>
              </li>
            </ul>
          </div>
          <div className="group">
            <label>{HOME.REFERRING_TEAM}</label>
            <ul className="team">
              <li>
                <span>{mySpread.teamCount}</span>
                <small>{HOME.ACTIVE_MEMBER}</small>
              </li>
              <li>
                <span>{HOME_MMT.GENERALIZE_LEVEL[mySpread.teamLevel]}</span>
                <small>{HOME.NODE_LEVEL}</small>
              </li>
              <li>
                <span>{mySpread.rebate}</span>
                <small>{HOME.REBATE_PROPORTION}</small>
              </li>
            </ul>
          </div>
        </section>
      </div>
    )
  }
}

export default Generalize
