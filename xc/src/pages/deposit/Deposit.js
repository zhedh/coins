import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {Drawer, SegmentedControl, Toast} from 'antd-mobile'
import {ASSET_DEPOSIT} from '../../assets/static'
import Header from '../../components/common/Header'
import DepositBuy from '../../components/partial/DepositBuy'
import DepositUnlock from '../../components/partial/DepositUnlock'
import './Deposit.scss'

@inject('userStore')
@inject('personStore')
@inject('productStore')
@inject('localeStore')
@observer
class Deposit extends Component {
  state = {
    showDrawer: false,
    selectTabIndex: 0
  };

  componentDidMount() {
    const {localeStore: {locale: {DEPOSIT}}} = this.props;
    const {userStore, productStore, personStore, location, history} = this.props;
    const selectTabIndex = location.state || this.state.selectTabIndex;
    this.setState({selectTabIndex});

    if (!userStore.isOnline()) {
      Toast.info(DEPOSIT.PLEASE_LOGIN_FIRST, 2, () => history.push('/login'));
      return
    }
    personStore.getUserInfo();
    personStore.getSpecial();
    productStore.getProducts().then(productId => {
      if (productId) {
        productStore.getProductDetail(productId)
      }
    })
  }

  onSegmentedChange = e => {
    const {selectedSegmentIndex} = e.nativeEvent;
    this.setState({selectTabIndex: selectedSegmentIndex})
  };

  selectProduct = id => {
    const {productStore} = this.props;
    this.setState({showDrawer: false}, () => {
      productStore.changeProduct(id, true)
    })
  };

  render() {
    const {localeStore: {locale: {DEPOSIT}}} = this.props;
    const {productStore} = this.props;
    const {products, productDetail} = productStore;
    const {showDrawer, selectTabIndex} = this.state;

    const sidebar = (
      <div className="sidebar">
        <header className="sidebar-header">
          <span>{DEPOSIT.SELECT_PLAN}</span>
          <img
            src={ASSET_DEPOSIT.DRAWER_MENU_ICON}
            alt="抽屉"
            onClick={() => this.setState({showDrawer: false})}
          />
        </header>
        <ul>
          <li>{DEPOSIT.ALL}</li>
          {products.map(product => (
            <li
              key={product.id}
              className={productDetail.productId === product.id ? 'active' : ''}
              onClick={() => this.selectProduct(product.id)}
            >
              {product.productName}
            </li>
          ))}
        </ul>
      </div>
    );

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
              title={DEPOSIT.X_PLAN}
              onHandle={() => this.setState({showDrawer: true})}
              icon={ASSET_DEPOSIT.DRAWER_MENU_ICON}
            />
            <section className="select-bar">
              <SegmentedControl
                className="segmented-control"
                values={[DEPOSIT.X_PLAN, DEPOSIT.PROMOTION]}
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

export default Deposit;
