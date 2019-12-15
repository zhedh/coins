import React from 'react';
import {Button, Modal, Toast} from "antd-mobile";
import Header from "../../components/common/Header";
import PersonApi from "../../api/person";
import {inject, observer} from "mobx-react";
import Captcha from "../../components/common/Captcha";
import {isMobile} from "../../utils/reg";
import UserApi from "../../api/user";
import {COUNT_DOWN} from "../../utils/constants";
import './Termination.scss';

@inject('userStore')
@inject('personStore')
@observer
class Termination extends React.Component {
  state = {
    walletTo: '',
    type: 'XC',
    canSubmit: true,
    showConfirm: false,
    initData: {
      lockOrderAmount: 0, // 本金
      winCount: 0, // 利润
      daysDeduct: 0, // 15天内解除的违约费用
      canUse: 0, // 实际可提现
      serviceCharge: 0, // 手续费率
      fee: 0 // 手续费
    },
    imgSrc: '',
    captcha: '',
    captchaKey: +new Date(),
    count: COUNT_DOWN,
    isCountDown: false,
    code: '',
  };

  componentDidMount() {
    const {personStore} = this.props;
    const {type} = this.state;
    this.terminationInit({type,});
    this.getCaptchaPng();
    personStore.getUserInfo()
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    clearTimeout(this.countDowntimer);
  }

  terminationInit = (options = {}) => {
    return PersonApi.terminationInit(options).then(res => {
      if (res.status !== 200 && res.status !== 1) {
        Toast.info(res.msg);
        return;
      }
      this.setState({initData: res.data})
    })
  };

  getCaptchaPng = () => {
    const key = +new Date();

    UserApi.getCaptchaPng({key}).then(res => {
      this.setState({captchaKey: key, imgSrc: res})
    })
  };

  onInputChange = (e, key) => {
    const {value} = e.target
    this.setState({[key]: value})
  };

  onAddressChange = (e) => {
    const {value} = e.target
    this.setState({walletTo: value})
  };

  onAddressBlur = (e) => {
    const {value} = e.target;
    const {type, canSubmit} = this.state;
    if (!value || !canSubmit) return;
    this.terminationInit({type, walletTo: value,})
  };

  onCountDown = () => {
    let {count} = this.state
    this.countDowntimer = setTimeout(() => {
      if (count <= 0) {
        this.setState({isCountDown: false, count: COUNT_DOWN});
        clearTimeout(this.timer)
      } else {
        this.setState({count: --count});
        this.onCountDown()
      }
    }, 1000)
  };

  getCode = () => {
    const {personStore: {userName}, userStore} = this.props;
    const {captcha, captchaKey} = this.state;
    if (!captcha) {
      Toast.info('请填写图形验证码');
      return;
    }
    userStore.getCode({
      captcha,
      account: userName,
      type: 'termination'
    }, {key: captchaKey}).then(res => {
      if (res.status !== 1) {
        Toast.info(res.msg);
        this.getCaptchaPng();
        return
      }
      this.setState({isCountDown: true, count: COUNT_DOWN})
      this.onCountDown()
    })
  };

  onSubmit = () => {
    const {personStore: {userName}} = this.props;
    const {walletTo, code} = this.state;

    if (!walletTo) {
      Toast.info('请填写钱包地址');
      return;
    }
    if (!code) {
      Toast.info(`请填写${isMobile(userName) ? '手机' : '邮箱'}验证码`)
      return;
    }
    this.setState({showConfirm: true});
  };

  submitTermination = () => {
    const {history, userStore} = this.props;
    const {type, walletTo, code} = this.state;
    this.setState({canSubmit: false, showConfirm: false});
    PersonApi.termination({type, walletTo, code}).then(res => {
      this.timer = setTimeout(() => this.setState({canSubmit: true}), 500);
      if (res.status === -103) {
        history.push('/login')
      }
      if (res.status !== 200 && res.status !== 1) {
        Toast.info(res.msg);
        return;
      }
      Toast.success('解除合约成功', 2, () => {
        userStore.logout();
        history.push('/login')
      })
    })
  };

  render() {
    const {
      walletTo,
      canSubmit,
      initData,
      showConfirm,
      code,
      imgSrc,
      captcha,
      count,
      isCountDown,
    } = this.state;
    const {personStore: {userName}} = this.props
    const disabled = !walletTo || !canSubmit || !code;

    return (
      <div className="termination">
        <Header title="解除合约" bgPrimary isFixed isShadow>
        </Header>
        <section className="section-form">
          <div className="row">
            <label>收款地址（XC地址）</label>
            <div className="input-box">
              <input
                type="text"
                placeholder="输入或长按粘贴地址"
                value={walletTo}
                onChange={this.onAddressChange}
                onBlur={this.onAddressBlur}
              />
            </div>
            <small>
              <span>首单在15天内额外扣除：{initData.daysDeduct}XC</span>
              <span>手续费：{(initData.serviceCharge || 0) * 100}%</span>
            </small>
          </div>
          <div className="row">
            <label>图形验证码</label>
            <Captcha
              imgSrc={imgSrc}
              value={captcha}
              onChange={e => this.onInputChange(e, 'captcha')}
              getCaptchaPng={this.getCaptchaPng}
            />
          </div>
          <div className="row">
            <label>{isMobile(userName) ? '手机验证码' : '邮箱验证码'}</label>
            <div className="input-box">
              <input
                type="text"
                placeholder="请输入验证码"
                value={code}
                onChange={(e) => this.onInputChange(e, 'code')}
              />
              <button
                className={isCountDown ? 'count-down' : ''}
                onClick={this.getCode}>
                {isCountDown ? `${count}S` : '获取验证码'}
              </button>
            </div>
          </div>
          <div className="btn-box">
            <small>实际到账数量：{initData.canUse}XC</small>
            <Button
              activeClassName="active"
              className="primary-button"
              disabled={disabled}
              onClick={this.onSubmit}>
              解除合约
            </Button>
          </div>
        </section>
        <section className="section-agreement">
          解除合约相关说明：
          <br/>
          1、提交解除合约前,请将USDT 和XC 账户可用资产全部转移，以免合约解除造成不必要的损失。
          <br/>
          2、一旦提交了解除合约,用户将停止参与计划并无法登陆,系统将禁用当前账号。
          <br/>
          3、系统将核算每个用户，每单的投入的成本,如用户收益没有达到所投入的成本，解除合约后，平台将补足剩余成本部分到用户提交地址；如收益达到或超出所投入的成本，用户解除合约则会扣除剩余收益部分,将参与计划成本部分按50%返还到用户提交的地址中。
          <br/>
          4、用户如果在首次参与计划15天以内选择解除合约,平台将额外每单扣除30xc作为合约违约金。
          <br/>
          5、解除合约地址如果是站外将收取手续费2%，如是站内将免除转账手续费。
          <br/>
          <span style={{color: '#e22020'}}>
            6、请用户仔细核对收款地址,因链上转账不可逆，如因地址错误造成的损失，该损失由用户承担。
          </span>
        </section>
        <Modal
          visible={showConfirm}
          className="confirm-modal"
          maskClosable
          transparent
          onClose={() => this.setState({showConfirm: false})}
        >
          <div style={{
            fontSize: '1.5rem',
            textAlign: 'justify',
            color: '#333',
            background: 'rgba(255,255,255,0.7)'
          }}>
            <p style={{margin: '0', padding: '10px 15px 20px',}}>
              一旦提交解除合约，将会停用该账号，无法登录，请确认。
            </p>
            <aside style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderTop: '1px solid #eee'
            }}>
              <button
                style={{
                  width: '50%',
                  height: '40px',
                  lineHeight: '40px',
                  border: 'none',
                  background: 'transparent',
                  borderRight: '1px solid #eee'
                }}
                onClick={() => this.setState({showConfirm: false})}
              >
                取消
              </button>
              <button
                style={{
                  width: '50%',
                  height: '40px',
                  lineHeight: '40px',
                  border: 'none',
                  background: 'transparent',
                }}
                onClick={this.submitTermination}
              >
                确认
              </button>
            </aside>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Termination;
