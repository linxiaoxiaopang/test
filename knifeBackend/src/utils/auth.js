import Cookies from 'js-cookie'

const TokenKey = 'Token'
const ExpiresTime = 'expiresTime'
const DirExpiresTime = 100 * 60 * 60 * 24
export function getToken() {
  return Cookies.get(TokenKey)
}

export function getTokenExpiresTime() {
  return Cookies.get(ExpiresTime)
}

export function setToken(token, rememberMe, expires = 1) {
  if (rememberMe) {
    Cookies.set(TokenKey, token, { expires })
    return Cookies.set(TokenKey, token, { expires, domain: 'zdcustom.com' })
  } else {
    Cookies.set(TokenKey, token)
    return Cookies.set(TokenKey, token, { domain: 'zdcustom.com' })
  }
}

export function setTokenExpiresTime(expiresTime, rememberMe, expires = 1) {
  if (rememberMe) {
    return Cookies.set(ExpiresTime, expiresTime, { expires })
  } else return Cookies.set(ExpiresTime, expiresTime, { expires: -1 })
}

export function removeToken() {
  const domain = process.env.VUE_APP_TOP_DOMAIN
  Cookies.remove(TokenKey, { domain })
  return Cookies.remove(TokenKey)
}

export function removeTokenExpiresTime() {
  return Cookies.remove(ExpiresTime)
}
