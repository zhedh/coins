import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {Link} from 'react-router-dom';
import {Toast} from 'antd-mobile';
import {OtherApi} from '../../api';
import arrowRight from '../../assets/images/arrow-right.png';
import arrowRightWhite from '../../assets/images/arrow-right-white.png';
import {ASSET_HOME} from "../../assets/static";
import GroupLabel from "../../components/common/GroupLabel";
import './Generalize.scss';

@inject('localeStore')
@observer
class Generalize extends Component {
  state = {
    mySpread: {}
  };

  componentDidMount() {
    this.getMySpread()
  }

  getMySpread = () => {
    OtherApi.getMySpread().then(res => {
      if (res.status !== 1) {
        Toast.info(res.msg);
        return
      }
      this.setState({mySpread: res.data})
    })
  };

  toDetail = id => {
    const {history} = this.props;
    history.push(`/home/generalize/${id}`)
  };

  render() {
    const {localeStore: {locale: {GENERALIZE}}} = this.props;
    const {mySpread = {}} = this.state;

    return (
      <div id="generalize">
        <section
          className="section-banner"
          style={{backgroundImage: `url(${ASSET_HOME.GENERALIZE_BG})`}}>
          <h1>
            <Link className="back" to="/home">
              <img src={arrowRightWhite} alt="返回"/>
            </Link>
            {GENERALIZE.MY_REFERRALS}
            <Link className="to-inviter" to="/home/inviter-friend">
              {GENERALIZE.INVITE_FRIENDS}
            </Link>
          </h1>
          <div className="content">
            {mySpread.recommendAllCount}
            <small>{GENERALIZE.TOTAL_REFERRALS}</small>
          </div>
        </section>
        <section className="section-main">
          <GroupLabel title={GENERALIZE.REFERRING_LIST}/>
          <ul className="list">
            <li onClick={() => this.toDetail(1)}>
              <p>
                <img src={ASSET_HOME.GENERALIZE_USER_ONE_ICON} alt=""/>
                {GENERALIZE.FIRST_GENERATION_REFERRALS}
              </p>
              <aside>
                {mySpread.recommendCount}
                <img src={arrowRight} alt=""/>
              </aside>
            </li>
            {/*<li onClick={() => this.toDetail(2)}>*/}
            {/*<p>*/}
            {/*<img src={HOME.GENERALIZE_USER_TWO_ICON} alt=""/>*/}
            {/*{GENERALIZE.SECOND_GENERATION_REFERRALS}*/}
            {/*</p>*/}
            {/*<aside>*/}
            {/*{mySpread.recommendCount2}*/}
            {/*<img src={arrowRight} alt=""/>*/}
            {/*</aside>*/}
            {/*</li>*/}
          </ul>
          <GroupLabel title={GENERALIZE.REFERRING_TEAM}/>
          <ul className="team">
            <li>
              <span>{mySpread.followUserActiveCount}</span>
              <small>{GENERALIZE.ACTIVE_MEMBER}</small>
            </li>
            <li>
                <span>
                  {ASSET_HOME.GENERALIZE_LEVEL[mySpread.teamLevel]}
                </span>
              <small>{GENERALIZE.NODE_LEVEL}</small>
            </li>
            <li>
              <span>{mySpread.rebate}</span>
              <small>{GENERALIZE.REBATE_PROPORTION}</small>
            </li>
          </ul>
        </section>
      </div>
    )
  }
}

export default Generalize
