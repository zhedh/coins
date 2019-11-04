import React, {Component} from 'react'
import {withRouter} from 'react-router'
import {FOOTER} from '../../assets/static'

import './Footer.scss'

const TABS = [
  {
    pathname: '/home',
    label: '首页',
    image: FOOTER.ICON_HOME,
    imagePre: FOOTER.ICON_HOME_PRE
  },
  {
    pathname: '/deposit',
    label: FOOTER.LABEL_DEPOSIT,
    image: FOOTER.ICON_PLAN,
    imagePre: FOOTER.ICON_PLAN_PRE
  },
  {
    pathname: '/wallet',
    label: '钱包',
    image: FOOTER.ICON_WALLET,
    imagePre: FOOTER.ICON_WALLET_PRE
  },
  {
    pathname: '/user-center',
    label: '我的',
    image: FOOTER.ICON_USER,
    imagePre: FOOTER.ICON_USER_PRE
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
    const {history} = this.props
    history.push(pathname)
  }

  render() {
    const {location} = this.props
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
