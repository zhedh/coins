// X PLAN代码仓库：
// ssh://www@47.75.138.157/data/git/zmfund-front.git

// XC生产访问地址：http://www.zbxcoin.com
// XC开发访问地址：http://47.75.138.157:81/

/**
 * @description 开关配置，打包前修改配置
 *
 * PROJECT String 项目名（XC|NTTC）
 * ONLINE bool 线上版本
 * */

export const SWITCH = {
  PROJECT: 'XC',
  ONLINE: false
}

const COIN = {
  XC: {
    PROD: {
      API_BASE_URL: 'https://api.zbxcoin.com/api'
    },
    DEV: {
      API_BASE_URL: 'http://47.75.138.157/api'
    }
  }
}

const CURRENT_PROJECT = COIN[SWITCH.PROJECT]

export const CONFIG = SWITCH.ONLINE ? CURRENT_PROJECT.PROD : CURRENT_PROJECT.DEV
