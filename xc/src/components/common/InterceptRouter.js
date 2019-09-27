import {Component} from "react"
import {withRouter} from "react-router"
import {inject, observer} from "mobx-react"
import {hideChatButton} from "../../utils/common";

@inject('userStore')
@inject('productStore')
@observer
class InterceptRouter extends Component {
  componentWillMount() {
    const {userStore} = this.props
    userStore.setUserStatus()

  }

  componentDidMount() {
    const {userStore, history, location} = this.props
    if (location.pathname === '/') {
      history.push('/home')
      // history.push('/login')
    }
    if (location.pathname !== '/user-center') {
      hideChatButton();
    }

    if (!userStore.isOnline && !this.isToLogin(location.pathname)) {
      history.push({pathname: '/login', state: {hideBack: true}})
    }
  }

  isToLogin(pathname) {
    const paths = ['login', 'register', 'password']
    return paths.some(path => pathname.includes(path))
  }

  render() {
    return this.props.children
  }
}

export default withRouter(InterceptRouter)
