import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {Drawer, SegmentedControl} from 'antd-mobile'
import {DEPOSIT} from '../../assets/static'
import Header from '../../components/common/Header'
import DepositBuy from '../../components/partial/DepositBuy'
import DepositUnlock from '../../components/partial/DepositUnlock'
import './Deposit.scss'

@inject('personStore')
@inject('productStore')
@observer
class Deposit extends Component {
  state = {
    showDrawer: false,
    selectTabIndex: 1
  }

  componentDidMount() {
    const {productStore, personStore, location} = this.props
    const selectTabIndex = location.state || this.state.selectTabIndex
    this.setState({selectTabIndex})
    personStore.getUserInfo()
    personStore.getSpecial()
    productStore.getProducts().then(productId => {
      if (productId) {
        productStore.getProductDetail(productId)
      }
    })
  }

  onSegmentedChange = e => {
    const {selectedSegmentIndex} = e.nativeEvent
    this.setState({selectTabIndex: selectedSegmentIndex})
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
            src={DEPOSIT.DRAWER_MENU_ICON}
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
              bgPrimary
              title={DEPOSIT.TITLE}
              onHandle={() => this.setState({showDrawer: true})}
              icon={DEPOSIT.DRAWER_MENU_ICON}
            />
            <section className="select-bar">
              <SegmentedControl
                className="segmented-control"
                values={DEPOSIT.TABS}
                selectedIndex={selectTabIndex}
                onChange={this.onSegmentedChange}
              />
            </section>
            <DepositBuy show={selectTabIndex === 0}/>
            <DepositUnlock show={selectTabIndex === 1}/>
          </main>
        </Drawer>
      </div>
    )
  }
}

export default Deposit
