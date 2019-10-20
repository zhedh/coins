import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { FOOTER } from '../../assets/static'
import HomeSvg from '../../assets/images/new/icon-home.png'
import PlanActive from '../../assets/images/new/icon-plan.png'
import WalletSvg from '../../assets/images/new/icon-wallet.png'
import UserSvg from '../../assets/images/new/icon-user.png'

import './Footer.scss'

const TABS = [
  {
    pathname: '/home',
    label: '首页',
    image: HomeSvg,
    imagePre: FOOTER.ICON_HOME
  },
  {
    pathname: '/deposit',
    label: FOOTER.LABEL_DEPOSIT,
    image: PlanActive,
    imagePre: FOOTER.ICON_PLAN
  },
  {
    pathname: '/wallet',
    label: '钱包',
    image: WalletSvg,
    imagePre: FOOTER.ICON_WALLET
  },
  {
    pathname: '/user-center',
    label: '我的',
    image: UserSvg,
    imagePre: FOOTER.ICON_USER
  }
]

const PATHS = [
  '/home',
  '/home/',
  '/deposit',
  '/deposit/',
  '/wallet',
  '/wallet/',
  '/user-center',
  '/user-center/'
]

class Footer extends Component {
  handleChange = pathname => {
    const { history } = this.props
    history.push(pathname)
  }

  render() {
    const { location } = this.props
    const show = PATHS.includes(location.pathname)

    return show ? (
      <footer>
        <ul>
          {TABS.map(tab => (
            <li
              key={tab.pathname}
              className={tab.pathname === location.pathname ? 'active' : ''}
              onClick={() => this.handleChange(tab.pathname)}
            >
              <img
                src={
                  tab.pathname === location.pathname ? tab.imagePre : tab.image
                }
                alt={tab.label}
              />
              {/* {tab.label} */}
            </li>
          ))}
        </ul>
      </footer>
    ) : (
      ''
    )
  }
}

export default withRouter(Footer)
