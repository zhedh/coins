import Loadable from 'react-loadable'
import Loading from './components/common/Loading'

// import Home from './pages/home/Index'
// import Login from './pages/login/Login'

const Home = Loadable({
  loader: () => import('./pages/home/Index'),
  loading: Loading
})
const InviterFriend = Loadable({
  loader: () => import('./pages/home/InviterFriend'),
  loading: Loading
})
const Generalize = Loadable({
  loader: () => import('./pages/home/Generalize'),
  loading: Loading
})
const GeneralizeDetail = Loadable({
  loader: () => import('./pages/home/GeneralizeDetail'),
  loading: Loading
})
const Bargain = Loadable({
  loader: () => import('./pages/home/Bargain'),
  loading: Loading
})
const BargainRecord = Loadable({
  loader: () => import('./pages/home/BargainRecord'),
  loading: Loading
})
const Rule = Loadable({
  loader: () => import('./pages/home/Rule'),
  loading: Loading
})
const DepositHistory = Loadable({
  loader: () => import('./pages/home/DepositHistory'),
  loading: Loading
})

const Wallet = Loadable({
  loader: () => import('./pages/wallet/Index'),
  loading: Loading
})
const WalletUsdt = Loadable({
  loader: () => import('./pages/wallet/WalletUsdt'),
  loading: Loading
})
const WalletCoin = Loadable({
  loader: () => import('./pages/wallet/WalletCoin'),
  loading: Loading
})
const Withdraw = Loadable({
  loader: () => import('./pages/wallet/Withdraw'),
  loading: Loading
})
const Recharge = Loadable({
  loader: () => import('./pages/wallet/Recharge'),
  loading: Loading
})
const WithdrawRecord = Loadable({
  loader: () => import('./pages/wallet/WithdrawRecord'),
  loading: Loading
})

const Login = Loadable({
  loader: () => import('./pages/login/Login'),
  loading: Loading
})
const Register = Loadable({
  loader: () => import('./pages/login/Register'),
  loading: Loading
})
const Password = Loadable({
  loader: () => import('./pages/login/Password'),
  loading: Loading
})

const UserCenter = Loadable({
  loader: () => import('./pages/user/UserCenter'),
  loading: Loading
})
const Notices = Loadable({
  loader: () => import('./pages/notice/Notices'),
  loading: Loading
})
const NoticeDetail = Loadable({
  loader: () => import('./pages/notice/NoticeDetail'),
  loading: Loading
})
const AccountSafe = Loadable({
  loader: () => import('./pages/user/AccountSafe'),
  loading: Loading
})
const ContactUs = Loadable({
  loader: () => import('./pages/user/ContactUs'),
  loading: Loading
})
const VerifiedCountry = Loadable({
  loader: () => import('./pages/user/VerifiedCountry'),
  loading: Loading
})
const VerifiedIdentity = Loadable({
  loader: () => import('./pages/user/VerifiedIdentity'),
  loading: Loading
})
const VerifiedUpload = Loadable({
  loader: () => import('./pages/user/VerifiedUpload'),
  loading: Loading
})
const VerifiedResult = Loadable({
  loader: () => import('./pages/user/VerifiedResult'),
  loading: Loading
})

const NoMatch = Loadable({
  loader: () => import('./pages/exception/404'),
  loading: Loading
})

const Deposit = Loadable({
  loader: () => import('./pages/deposit/Deposit'),
  loading: Loading
})
const DepositResult = Loadable({
  loader: () => import('./pages/deposit/DepositResult'),
  loading: Loading
})

export default [
  // 主页
  {path: '/', name: 'Home', component: Home},
  {path: '/home', name: 'Home', component: Home},
  {
    path: '/home/inviter-friend',
    name: 'InviterFriend',
    component: InviterFriend
  },
  {path: '/home/generalize', name: 'Generalize', component: Generalize},
  {
    path: '/home/generalize/:id',
    name: 'GeneralizeDetail',
    component: GeneralizeDetail
  },
  {path: '/home/bargain', name: 'Bargain', component: Bargain},
  {
    path: '/home/bargain/record',
    name: 'BargainRecord',
    component: BargainRecord
  },
  {path: '/home/rule', name: 'Rule', component: Rule},
  {
    path: '/home/deposit-history',
    name: 'DepositHistory',
    component: DepositHistory
  },

  // 钱包
  {path: '/wallet', name: 'Wallet', component: Wallet},
  {path: '/wallet/usdt', name: 'WalletUsdt', component: WalletUsdt},
  {path: '/wallet/coin/:id', name: 'WalletCoin', component: WalletCoin},
  {path: '/wallet/withdraw/:type', name: 'Withdraw', component: Withdraw},
  {path: '/wallet/recharge/:type', name: 'Recharge', component: Recharge},
  {
    path: '/wallet/withdraw-record/:type',
    name: 'WithdrawRecord',
    component: WithdrawRecord
  },

  // 登陆注册
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/password/:type', name: 'Password', component: Password },

  // 个人中心
  { path: '/user-center', name: 'UserCenter', component: UserCenter },
  { path: '/notices', name: 'Notices', component: Notices },
  { path: '/notice/:id', name: 'NoticeDetail', component: NoticeDetail },
  { path: '/account', name: 'AccountSafe', component: AccountSafe },
  { path: '/contact-us', name: 'ContactUs', component: ContactUs },

  // 实名认证
  {
    path: '/verified-country',
    name: 'VerifiedCountry',
    component: VerifiedCountry
  },
  {
    path: '/verified-identity/:country',
    name: 'VerifiedIdentity',
    component: VerifiedIdentity
  },
  {
    path: '/verified-upload',
    name: 'VerifiedUpload',
    component: VerifiedUpload
  },
  {
    path: '/verified-result',
    name: 'VerifiedResult',
    component: VerifiedResult
  },

  // X PLAN
  {path: '/deposit', name: 'Deposit', component: Deposit},
  {path: '/deposit/result', name: 'DepositResult', component: DepositResult},

  // 404
  {
    path: '/404',
    name: '404',
    component: NoMatch
  }
]
