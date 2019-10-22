import dayjs from "dayjs"
import {COIN_POINT_LENGTH} from "./constants";

export function formatDate(timestamp) {
  if (!timestamp) return ''
  return dayjs(timestamp * 1000).format('YYYY.MM.DD')
}

export function formatTime(timestamp) {
  if (!timestamp) return ''
  return dayjs(timestamp * 1000).format('YYYY.MM.DD HH:mm')
}

export function formatDateTime(timestamp) {
  if (!timestamp) return ''
  return dayjs(timestamp * 1000).format('YYYY.MM.DD HH:mm:ss')
}

// 币种价格与数量位数格式化
export function formatCoinPrice(price, length = COIN_POINT_LENGTH) {
  if (!price) return '--'
  return downFixed(price, length)
  // price = Number(price).toFixed(length)
  // return parseFloat(price)
}

// 币种价格与数量位数格式化
export function formatWalletPrice(price, length = COIN_POINT_LENGTH) {
  if (!price) return 0
  return downFixed(price, length)
  // price = Number(price).toFixed(length)
  // return parseFloat(price)
}

// 特价额度数量保留2位
export function formatSpecialOffer(price) {
  if (!price) return '--'
  return downFixed(price, 2)
  // price = Number(price).toFixed(2)
  // return parseFloat(price)
}

function downFixed(num, fix) {
  // num为原数字，fix是保留的小数位数
  let result = '0'
  if (Number(num) && fix > 0) { // 简单的做个判断
    fix = +fix || 2
    num = num + ''
    if (/e/.test(num)) { // 如果是包含e字符的数字直接返回
      result = num
    } else if (!/\./.test(num)) { // 如果没有小数点
      result = num + `.${Array(fix + 1).join('0')}`
    } else { // 如果有小数点
      num = num + `${Array(fix + 1).join('0')}`
      let reg = new RegExp(`-?\\d*.\\d{0,${fix}}`)
      result = reg.exec(num)[0]
    }
  }
  return result
}
