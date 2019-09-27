import {REG} from "./constants";

export const isMobile = (account) => REG.MOBILE.test(account)
export const isEmail = (account) => REG.EMAIL.test(account)
export const isPassword = (password) => REG.PASSWORD.test(password)
export const isIdCard = (idCard) => REG.ID_CARD.test(idCard)
export const isLetter = (letter) => REG.LETTER.test(letter)

