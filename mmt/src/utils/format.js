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
  price = Number(price).toFixed(length)
  return parseFloat(price)
}

// 币种价格与数量位数格式化
export function formatWalletPrice(price, length = COIN_POINT_LENGTH) {
  if (!price) return 0
  price = Number(price).toFixed(length)
  return parseFloat(price)
}

// 特价额度数量保留2位
export function formatSpecialOffer(price) {
  if (!price) return '--'
  price = Number(price).toFixed(2)
  return parseFloat(price)
}
