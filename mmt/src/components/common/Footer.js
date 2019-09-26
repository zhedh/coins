import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { FOOTER_ASSET } from '../../assets'
import FindSvg from '../../assets/images/common/icon-home.svg'
import DepositSvg from '../../assets/images/common/icon-deposit.svg'
import WalletSvg from '../../assets/images/common/icon-wallet.svg'
import './Footer.scss'
import {inject, observer} from "mobx-react";


const PATHS = [
  '/home',
  '/home/',
  '/deposit',
  '/deposit/',
  '/wallet',
  '/wallet/'
]

@inject('localeStore')
@observer
class Footer extends Component {
  handleChange = pathname => {
    const { history } = this.props
    history.push(pathname)
  }

  render() {
    const {  location,localeStore } = this.props
    const { COMMON } = localeStore.language || {}
    const show = PATHS.includes(location.pathname)
    const TABS = [
      {
        pathname: '/home',
        label: COMMON.HOMEPAGE,
        image: FindSvg,
        imagePre: FOOTER_ASSET.ICON_HOME
      },
      {
        pathname: '/deposit',
        label: FOOTER_ASSET.LABEL_DEPOSIT,
        image: DepositSvg,
        imagePre: FOOTER_ASSET.ICON_DEPOSIT
      },
      {
        pathname: '/wallet',
        label: COMMON.WALLET,
        image: WalletSvg,
        imagePre: FOOTER_ASSET.ICON_WALLET
      }
    ]


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
