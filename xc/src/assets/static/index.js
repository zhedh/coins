import {SWITCH} from '../../config'
import STATIC_XC from './xc'
import STATIC_NTTC from './nttc'
import STATIC_MMT from './mmt'

function getStatic(coin) {
  switch (coin) {
    case 'XC':
      return STATIC_XC
    case 'NTTC':
      return STATIC_NTTC
    case 'MMT':
      return STATIC_MMT
    default:
      return STATIC_XC
  }
}

const STATIC = getStatic(SWITCH.PROJECT)

const {COMMON, HOME, BARGAIN, AUTH, DEPOSIT, FOOTER,USER} = STATIC

export {COMMON, HOME, BARGAIN, AUTH, DEPOSIT, FOOTER,USER}
