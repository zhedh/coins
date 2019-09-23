import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { FOOTER } from '../../assets/static'
import FindSvg from '../../assets/images/common/icon-home.svg'
import DepositSvg from '../../assets/images/common/icon-deposit.svg'
import WalletSvg from '../../assets/images/common/icon-wallet.svg'
import './Footer.scss'

const TABS = [
  {
    pathname: '/home',
    label: '首页',
    image: FindSvg,
    imagePre: FOOTER.ICON_HOME
  },
  {
    pathname: '/deposit',
    label: FOOTER.LABEL_DEPOSIT,
    image: DepositSvg,
    imagePre: FOOTER.ICON_DEPOSIT
  },
  {
    pathname: '/wallet',
    label: '钱包',
    image: WalletSvg,
    imagePre: FOOTER.ICON_WALLET
  }
]

const PATHS = [
  '/home',
  '/home/',
  '/deposit',
  '/deposit/',
  '/wallet',
  '/wallet/'
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
              {tab.label}
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
