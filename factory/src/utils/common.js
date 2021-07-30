
let queue = Promise.resolve()
let promises = []
let limit
requestLimitNum(6)
export function requestLimitNum(num) {
  limit = num
  for (let i = 0; i < limit; i++) {
    promises.push(Promise.resolve(i))
  }
  promises.length = limit
}
export function requestQueue(func) {
  queue = queue
    .then(() => {
      return Promise.race(promises)
    })
    .catch((err) => {
      // 这里的 catch 不仅用来捕获前面 then 方法抛出的错误
      // 更重要的是防止中断整个链式调用
      console.error(err)
    })
    .then((res) => {
      promises[res] = func().then(() => {
        return res
      })
    })
}

/**
 * 对obj进行取值（处理obj的多级取值，防止在某一级取不到值导致后续取值操作报错）
 * @param {any} obj
 * @param {string} keyStr
 * @returns {any}
 * @example getValueFromObj(obj, 'introduce_attr[0].introduce_detail')
 */
export function getValueFromObj (obj, keyStr = '') {
  if(!obj) return obj
  let keys = keyStr.replace(/\/|\[|\].?/g, '.').split('.')
  // console.log(keys);
  return keys.reduce((prev, key, index, arr) => {
    if(!key) return prev
    let value = prev[key]
    if(!value) arr.splice(index)
    // console.log(value);
    return value
  }, obj)
}