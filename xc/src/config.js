// XC代码仓库：
// ssh://www@47.75.138.157/data/git/zmfund-front.git

// XC生产访问地址：http://www.zbxcoin.com
// XC开发访问地址：http://47.75.196.141:81/


// 切换开发和生产API
export const ONLINE = true

const COIN = {
  PROD: {
    API_BASE_URL: 'https://api.zbxcoin.com/api',
    XC_AUTH_URL: 'https://test.zbx.one/xplan_authorization',
  },
  DEV: {
    // API_BASE_URL: 'http://47.75.138.157/api',
    API_BASE_URL: 'http://47.75.196.141/api',
    XC_AUTH_URL: 'https://test.zbx.one/xplan_authorization',
  }
}

export const CONFIG = ONLINE ? COIN.PROD : COIN.DEV
