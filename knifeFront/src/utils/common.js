import {validatenull} from '@/components/avue/utils/validate'

/**
 * 将dataObj的键名替换为keyObj里的对应值
 * @param {Object} dataObj
 * @param {Object} keyObj
 * @param {Boolean} isKeyObj // true为{oldKey: newKey}, false为{newKey: oldKey}
 * @returns {Object}
 * @example see @/views/order/orderImport
 * @description 改变Obj数据的key
 */
export function changeObjKey(dataObj, keyObj, isKeyObj = false) {
  let nObj = {}

  if (isKeyObj){
    Object.keys(dataObj).forEach(key => {
      let nKey = keyObj[key]
      nKey && (nObj[nKey] = dataObj[key])
    })
  } else {
    // 旧键名数组
    let dataKeys = Object.keys(dataObj)
    Object.entries(keyObj).forEach(entry => {
      // keyObj旧键名允许类型是数组
      let oKeys = Array.isArray(entry[1]) ? entry[1] : [entry[1]]
      // 获取旧键名，即dataKeys的某一个子项
      let oKey = dataKeys.find(dataKey => {
        return oKeys.find(oKey => {
          // 表格标题名（即旧键名）允许含有*和空格
          return dataKey.replace(/[* ]/g, '') === oKey
        })
      })

      nObj[entry[0]] = dataObj[oKey] || ''
    })
  }

  return nObj
}
/**
 * 将dataArr的键名替换为keyObj里的对应值
 * @param {Array} dataArr
 * @param {Object} keyObj
 * @param {Boolean} isKeyObj
 * @returns {Array}
 * @example see @/views/order/orderImport
 * @description 改变Obj数据的key
 */
export function changeArrKey(dataArr, keyObj, isKeyObj = false) {
  return dataArr.map(item => {
    return changeObjKey(item, keyObj, isKeyObj)
  })
}

export function uniqueArray(arr) {
  return arr.filter((item, index, arr) => arr.indexOf(item) === index)
}

/**
 * @param {Number|String} value
 * @param {Array} dic
 * @param {Object} props
 * @returns {String}
 * @example see @/views/order/relationDetails
 * @description 字典，根据value获取label
 */
export function getDicLabel(value, dic = [], props = {label: 'label', value: 'value'}) {
  // console.log(value, dic, props);
  let item = dic.find(item => item[props.value] === value)
  return item ? item[props.label] : ''
}

/**
 * @param {String} label
 * @param {Array} dic
 * @param {Object} props
 * @returns {String|Number}
 * @example see @/views/order/relationDetails
 * @description 字典，根据label获取value
 */
export function getDicValue(label, dic = [], props = {label: 'label', value: 'value'}) {
  // console.log(value, dic, props);
  let item = dic.find(item => item[props.label] === label)
  return item ? item[props.value] : ''
}


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