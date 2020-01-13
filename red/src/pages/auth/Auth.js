import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {getQueryParam} from '../../utils/common'
import Header from '../../components/common/Header'
import Loading from "../../components/common/Loading"
import AuthBanner from '../../assets/images/xc/auth-advantage.png'
import AuthArrow from '../../assets/images/xc/auth-arrow.png'
import './Auth.scss'

@inject('userStore')
@inject('localeStore')
@observer
class Index extends Component {
  state = {
    show: false
  };

  componentDidMount() {
    this.sendUserAuth()
  }

  // 获取rsa和签名,
  sendUserAuth = () => {
    const {userStore, history} = this.props;
    const info = getQueryParam('info');
    const signature = getQueryParam('signature');
    userStore.userAuth({info, signature}).then(res => {
      if (res.status === 200) {
        history.push('/home');
        return
      }
      if (res.status === 201) {
        const {infoKey} = res.data;
        userStore.setInfoKey(infoKey);
        this.setState({show: true});
        return
      }
      history.push('/zbx-login')
    })
  };

  newUserAuth = () => {
    const {history} = this.props;
    history.push('/invite-code')
  };

  hadAuth = () => {
    const {history} = this.props;
    history.push('/bind')
  };

  render() {
    const {localeStore: {locale: {AUTH_MAIN}}} = this.props;
    const {show} = this.state;
    return (
      <div id="auth">
        {show ?
          <div>
            <Header bgWhite isFixed isShadow title={AUTH_MAIN.SELECT_AUTH_WAY}/>
            <div className="main-content">
              <img className="banner" src={AuthBanner} alt=""/>
              <div className="line" onClick={this.newUserAuth}>
                <div>
                  <span>{AUTH_MAIN.NEW_USER}</span>
                  <span>{AUTH_MAIN.DIRECT_LOGIN}</span>
                </div>
                <img src={AuthArrow} alt=""/>
              </div>
              <div className="line" onClick={this.hadAuth}>
                <div>
                  <span>{AUTH_MAIN.ACCOUNT_BIND}</span>
                  <span>{AUTH_MAIN.SIGN_IN_BIND_ACCOUNT}</span>
                </div>
                <img src={AuthArrow} alt=""/>
              </div>
            </div>
          </div> :
          <Loading/>
        }
      </div>
    )
  }
}

export default Index;
