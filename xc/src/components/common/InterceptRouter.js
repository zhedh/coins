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
    const {history, location} = this.props
    if (location.pathname === '/') {
      // history.push('/home')
      history.push('/login')
    }
    if (location.pathname !== '/user-center') {
      hideChatButton();
    }
  }

  render() {
    return this.props.children
  }
}

export default withRouter(InterceptRouter)
