// 项目配置文件

// 修改样式配置文件：
// 1.styles 文件夹下 mixin.scss 修改 variable 的引用
// 2.package.json 下修改 antd-mobile 主题颜色

// X PLAN代码仓库：
// ssh://www@47.75.138.157/data/git/zmfund-front.git
//
// NTTC代码仓库：
// ssh://www@47.75.138.157/data/git/nttc-front.git

// XC线上访问地址：www.zbxcoin.com
// XC测试环境访问地址：http://47.75.138.157:81/

// nttc正式站接口地址：http://api.naturenode.org
// nttc测式站接口地址：http://47.75.138.157:8080
//
// nttc正式站访问地址：http://www.naturenode.org
// nttc测试站访问地址：http://47.75.138.157:8081

// mmt正式站接口地址：http://api.naturenode.org
// mmt测式站接口地址：http://47.75.138.157:8080
//
// mmt正式站访问地址：http://www.naturenode.org
// mmt测试站访问地址：http://47.75.138.157:8091

/**
 * @description 开关配置，打包前修改配置
 *
 * PROJECT String 项目名（XC|NTTC）
 * ONLINE bool 线上版本
 * */

export const SWITCH = {
  PROJECT: 'XC',
  // PROJECT: 'NTTC',
  // PROJECT: 'MMT',
  ONLINE: true
}

const COIN = {
  XC: {
    PROD: {
      API_BASE_URL: 'https://api.zbxcoin.com/api'
    },
    DEV: {
      API_BASE_URL: 'http://47.75.138.157/api'
    }
  },
  NTTC: {
    PROD: {
      API_BASE_URL: 'http://api.naturenode.org/api'
    },
    DEV: {
      API_BASE_URL: 'http://47.75.138.157:8080/api'
    }
  },
  MMT: {
    PROD: {
      API_BASE_URL: 'http://api.naturenode.org/api'
    },
    DEV: {
      API_BASE_URL: 'http://47.75.138.157:8090/api'
    }
  }
}

const CURRENT_PROJECT = COIN[SWITCH.PROJECT]

export const CONFIG = SWITCH.ONLINE ? CURRENT_PROJECT.PROD : CURRENT_PROJECT.DEV
