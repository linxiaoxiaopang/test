/**
 * Created by jiachenpan on 16/11/18.
 */

export function isEmpty(value) {
  return value === undefined || value === '' || value === null
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * 验证邮箱
 * @param str
 * @returns {boolean}
 */
export function validatEmail(str) {
  const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
  return reg.test(str)
}

// 手机号验证
export function isvalidPhone(str) {
  const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
  return reg.test(str)
}

// 不能输入中文
export function isvalidChinaese(str) {
  const reg = /^[a-zA-Z0-9_]+$/g
  return reg.test(str)
}

//输入中英文下划线和数字
export function isReasonableText(str) {
  // return /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(str)
  return /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(str)
}

//只适用element-ui库 的校验方法
// 验证是否正整数

/* 大小写字母*/
export function validatAlphabets(rule, value, callback) {
  if (isEmpty(value)) {
    return callback()
  }
  const reg = /^[A-Z\sa-z\d-_]+$/
  const rsCheck = reg.test(value)
  if (!rsCheck) {
    callback('请输入大小写字母')
  } else {
    callback()
  }
}

export function isInteger(rule, value, callback) {
  if (isEmpty(value)) {
    return callback()
  }
  const re = /^[1-9][0-9]*$/
  const rsCheck = re.test(value)
  if (!rsCheck) {
    callback(new Error('请输入正整数'))
  } else {
    callback()
  }
}

// 验证是否是整数

export function isIntegerAndZero(rule, value, callback) {
  if (value === undefined || value === '') {
    return callback(new Error('输入不可以为空'))
  }
  const re = /^[0-9]*$/
  const rsCheck = re.test(value)
  if (!rsCheck) {
    callback(new Error('请输入大于等于0的整数'))
  } else {
    callback()
  }
}

// 验证是否是金额_
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

// 验证是否数字字母_
export function isCommonCharacters(rule, value, callback) {
  if (value === undefined || value === '') {
    return callback()
  }
  const re = /^\w+$/
  const rsCheck = re.test(value)
  if (!rsCheck) {
    callback(new Error('只能输入数字字母下划线'))
  } else {
    callback()
  }
}

// 验证是否数字字母_和点字符
export function isCommonCharactersAndPoint(rule, value, callback) {
  if (value === undefined || value === '') {
    return callback()
  }
  const re = /^[\w-.+]+$/
  const rsCheck = re.test(value)
  if (!rsCheck) {
    callback(new Error('只能输入数字字母，下划线，加号。'))
  } else {
    callback()
  }
}

/* 邮件*/
export function isEmail(rule, value, callback) {
  if (isEmpty(value)) {
    return callback()
  }
  const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
  const rsCheck = reg.test(value)
  if (!rsCheck) {
    callback('请输入正确的Email')
  } else {
    callback()
  }
}

// 至少8-16个字符，至少1个大写字母，1个小写字母和1个数字，其他可以是任意字符
export function isRobust(rule, value, callback) {
  if (isEmpty(value)) {
    return callback()
  }
  const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/
  const rsCheck = reg.test(value)
  if (!rsCheck) {
    callback('至少6-20个字符，至少存在1个大写字母，1个小写字母和1个数字')
  } else {
    callback()
  }
}

//至少2-6个字符
export function is2And6char(rule, value, callback) {
  if (isEmpty(value)) {
    return callback()
  }
  const reg = /^.{2,6}$/
  const rsCheck = reg.test(value)
  if (!rsCheck) {
    callback('至少2-6个字符')
  } else {
    callback()
  }
}
//至少4-20个字符
export function is4And20char(rule, value, callback) {
  if (isEmpty(value)) {
    return callback()
  }
  const reg = /^.{4,20}$/
  const rsCheck = reg.test(value)
  if (!rsCheck) {
    callback('至少4-20个字符')
  } else {
    callback()
  }
}
/* 大小写字母数字、_*/
export function isW(rule, value, callback) {
  if (isEmpty(value)) {
    return callback()
  }
  const reg = /^\w+$/
  const rsCheck = reg.test(value)
  if (!rsCheck) {
    callback('请输入大小写字母、数字、_')
  } else {
    callback()
  }
}
