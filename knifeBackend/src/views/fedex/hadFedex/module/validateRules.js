// 验证邮编
export function isEmpty(value) {
  return value === undefined || value === '' || value === null
}

export const checkPostcode = (rule, value, cb) => {
  const regEmail = /^[0-9]\d{5}(?!\d)$/
  if (regEmail.test(value)) {
    cb()
  } else {
    cb(new Error('请输入合法的邮箱'))
  }
}
// 验证中文名
export const checkCNname = (rule, value, cb) => {
  const regCNname = /^[\u4E00-\u9FA5]+$/
  if (regCNname.test(value)) {
    cb()
  } else {
    cb(new Error('请输入中文名字'))
  }
}
// 验证电话
export const checkPhone = (rule, value, cb) => {
  const regTelephone = /^\d{3}-\d{7,8}|\d{4}-\d{7,8}$/
  const regPhone = /^1[3|4|5|6|7|8|9][0-9]{9}$/
  if (regTelephone.test(value) || regPhone.test(value)) {
    cb()
  } else {
    cb(new Error('请输入合法的电话或者手机号码'))
  }
}
// 不能输中文
export function isvalidChinaese(rule, value, cb) {
  const reg = /^[0-9a-zA-Z\- \/_?:.,\s]+$/
  if (reg.test(value)) {
    cb()
  } else {
    cb(new Error('不能输入中文'))
  }
}

// 校验英文字母
export const checkEng = (rule, value, cb) => {
  const regEng = /^[a-zA-Z\s]{0,100}$/
  if (regEng.test(value)) {
    cb()
  } else {
    cb(new Error('请填写英文字母'))
  }
}

// 校验英文字母下划线
export function isCommonCharacters(rule, value, callback) {
  if (value === undefined || value === '') {
    return callback()
  }
  const re = /^[\w\s]+$/
  const rsCheck = re.test(value)
  if (!rsCheck) {
    callback(new Error('只能输入数字字母下划线'))
  } else {
    callback()
  }
}

// 验证是否是正整数
export function isIntegerAndZero(rule, value, callback) {
  if (isEmpty(value)) {
    return callback()
  }
  const reg = /^[0-9]{1,100}$/
  const rsCheck = reg.test(value)
  if (!rsCheck || value == 0) {
    callback(new Error('请输入正整数'))
  } else {
    callback()
  }
}
// 金额
export function isMoney(rule, value, callback) {
  if (isEmpty(value)) {
    return callback()
  }
  const re = /(?:^[1-9]([0-9]+)?(?:\.[0-9]{1,2})?$)|(?:^(?:0){1}$)|(?:^[0-9]\.[0-9](?:[0-9])?$)/
  const rsCheck = re.test(value)
  if (!rsCheck) {
    callback(new Error('金额格式错误'))
  } else {
    callback()
  }
}
