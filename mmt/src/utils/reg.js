import {REG} from "./constants";

export const isMobile = (account) => REG.MOBILE.test(account)
export const isEmail = (account) => REG.EMAIL.test(account)
export const isPassword = (password) => REG.PASSWORD.test(password)

