import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {Drawer, SegmentedControl} from 'antd-mobile'
import {DEPOSIT} from '../../assets/static'
import Header from '../../components/common/Header'
import DepositBuy from '../../components/partial/DepositBuy'
import DepositUnlock from '../../components/partial/DepositUnlock'
import leftDrawerIcon from '../../assets/images/left-drawer.png'
import './Deposit.scss'

@inject('personStore')
@inject('productStore')
@observer
class Deposit extends Component {
  state = {
    showDrawer: false,
    ensureToUnlock: false,
    selectTabIndex: 0
  }

  componentDidMount() {
    const {productStore, personStore, location} = this.props
    const selectTabIndex = location.state || 0
    this.setState({selectTabIndex})
    personStore.getUserInfo()
    personStore.getSpecial()
    productStore.getProducts().then(productId => {
      if (productId) {
        productStore.getProductDetail(productId)
      }
    })
  }

  onClose = () => {
    this.setState({ensureToPay: false, ensureToUnlock: false})
  }

  onDepositBuy = () => {
    this.setState({ensureToPay: true})
  }

  onUnlockLimit = () => {
    this.setState({ensureToUnlock: true})
  }

  onSegmentedChange = e => {
    const {selectedSegmentIndex} = e.nativeEvent
    this.setState({selectTabIndex: selectedSegmentIndex})
  }

  onDeposit = () => {
    const {selectTabIndex} = this.state
    if (selectTabIndex === 0) {
      this.onDepositBuy()
    } else {
      this.onUnlockLimit()
    }
  }

  selectProduct = id => {
    const {productStore} = this.props
    this.setState({showDrawer: false}, () => {
      productStore.changeProduct(id, true)
    })
  }

  render() {
    const {productStore} = this.props
    const {products, productDetail} = productStore
    const {showDrawer, selectTabIndex} = this.state

    const sidebar = (
      <div className="sidebar">
        <header className="sidebar-header">
          <span>{DEPOSIT.SIDEBAR_TITLE}</span>
          <img
            src={leftDrawerIcon}
            alt="抽屉"
            onClick={() => this.setState({showDrawer: false})}
          />
        </header>
        <ul>
          <li>全部</li>
          {products.map(product => (
            <li
              key={product.id}
              className={productDetail.id === product.id ? 'active' : ''}
              onClick={() => this.selectProduct(product.id)}
            >
              {product.productName}
            </li>
          ))}
        </ul>
      </div>
    )

    return (
      <div id="deposit">
        <Drawer
          className="am-drawer"
          sidebar={sidebar}
          open={showDrawer}
          onOpenChange={() => this.setState({showDrawer: !showDrawer})}
        >
          <main>
            <Header
              isFixed
              isShadow
              bgWhite
              title={DEPOSIT.TITLE}
              // onHandle={() => this.setState({showDrawer: true})}
              onHandle={() => null}
              hideIcon
              // icon={leftDrawerIcon}
            >
              <span className="drawer-text">{productDetail.productName}</span>
            </Header>
            <section className="select-bar">
              <SegmentedControl
                className="segmented-control"
                values={DEPOSIT.TABS}
                selectedIndex={selectTabIndex}
                onChange={this.onSegmentedChange}
              />
            </section>
            <DepositBuy
              show={selectTabIndex === 0}
              onDeposit={this.onDepositBuy}
            />
            <DepositUnlock
              show={selectTabIndex === 1}
              onDeposit={this.onUnlockLimit}
            />
          </main>
        </Drawer>
      </div>
    )
  }
}

export default Deposit
