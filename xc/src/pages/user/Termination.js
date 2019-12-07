import React from 'react';
import {Button, Toast} from "antd-mobile";
import './Termination.scss';
import Header from "../../components/common/Header";
import PersonApi from "../../api/person";

class Termination extends React.Component {
  state = {
    walletTo: '',
    type: 'XC',
    canSubmit: true,
    initData: {
      lockOrderAmount: 0, // 本金
      winCount: 0, // 利润
      daysDeduct: 0, // 15天内解除的违约费用
      canUse: 0, // 实际可提现
      serviceCharge: 0, // 手续费率
      fee: 0 // 手续费
    },
  };

  componentDidMount() {
    const {type} = this.state;
    this.terminationInit({type,})
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
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

  onSubmit = () => {
    const {history} = this.props
    const {type, walletTo} = this.state;
    this.setState({canSubmit: false});
    PersonApi.termination({type, walletTo}).then(res => {
      this.timer = setTimeout(() => this.setState({canSubmit: true}), 500);
      if (res.status === -103) {
        history.push('/login')
      }
      if (res.status !== 200 && res.status !== 1) {
        Toast.info(res.msg);
        return;
      }
      Toast.success('解除合约成功', 2, () => history.push('/user-center'))
    })
  };

  render() {
    const {walletTo, canSubmit, initData} = this.state;
    const disabled = !walletTo || !canSubmit;

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
                // onBlur={this.onAddressBlur}
              />
            </div>
            <small>
              <span>首单在15天内额外扣除：{initData.daysDeduct}XC</span>
              <span>手续费：{(initData.serviceCharge || 0) * 100}%</span>
            </small>
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
          2、一旦提交了解除合约,用户将停止参与计划切无法登陆,系统将停用当前账号。
          <br/>
          3、客服人员将核算每个用户，每单的投入的成本,如用户收益没有达到所投入的成本，解除合约后，平台将补足剩余成本部分到用户提交地址；如收益达到或超出所投入的成本，用户解除合约则会扣除剩余收益部分,将参与计划计划成本部分按50%返还到用户提交的地址中。
          <br/>
          4、用户如果在首次参与计划15天以内选择解除合约,平台将额外每单扣除30xc作为合约违约金。
          <br/>
          5、解除合约地址如果是站外将收取手续费2%，如是站内将免除转账手续费。
          <br/>
          6、请用户仔细核对收款地址,因链上转账不可逆，如因地址错误造成的损失,该损失由用户承担。
          <br/>
          7、用户X plan系统如果使用手机注册，那么手机号码需与账户一致，我们将在线验证其真实性。
          <br/>
          8、用户X plan系统如果使用邮箱注册，系统将发送邮件给用户，用户需按规定内容回复邮件用作解约审核。
        </section>
      </div>
    );
  }
}

export default Termination;

// 13bnZesBPQBco51XRRD1WmM7QSVFnF7p8F
