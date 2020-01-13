// RED代码仓库：
// ssh://www@47.75.138.157/data/git/xhs-front.git
// ssh://www@47.75.196.141/data/git/xhs-front.git

// RED生产访问地址：http://www.zbxcoin.com
// RED开发访问地址：http://47.75.196.141:8110/


// 切换开发和生产API
export const ONLINE = false

const COIN = {
  PROD: {
    API_BASE_URL: 'https://api.zbxcoin.com/api',
    // XC_AUTH_URL: 'https://test.zbx.one/xplan_authorization',
  },
  DEV: {
    API_BASE_URL: 'http://47.75.196.141:8100/api',
    // XC_AUTH_URL: 'https://test.zbx.one/xplan_authorization',
  }
}

export const CONFIG = ONLINE ? COIN.PROD : COIN.DEV
