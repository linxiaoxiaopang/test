/**
 * @param {Object} dataObj
 * @param {Object} keyObj
 * @param {Boolean} isKeyObj // true为{oldKey: newKey}, false为{newKey: oldKey}
 * @returns {Object}
 * @example see @/views/order/orderImport
 * @description 改变Obj数据的key
 */
export function changeObjKey(dataObj, keyObj, isKeyObj = false) {
  let nObj = {}

  if (isKeyObj) {
    Object.keys(dataObj).forEach((key) => {
      let nKey = keyObj[key]
      nKey && (nObj[nKey] = dataObj[key])
    })
  } else {
    let oldKeys = Object.keys(dataObj)
    Object.entries(keyObj).forEach((entry) => {
      if (oldKeys.includes(entry[1])) {
        nObj[entry[0]] = dataObj[oldKeys[oldKeys.indexOf(entry[1])]]
      } else if (Array.isArray(entry[1])) {
        let str = ''
        let boolean = entry[1].some((item) => {
          let itemBoolean = oldKeys.includes(item)
          if (itemBoolean) str = item
          return itemBoolean
        })
        if (boolean) {
          nObj[entry[0]] = dataObj[oldKeys[oldKeys.indexOf(str)]]
        }
      }
    })
  }

  return nObj
}
/**
 * @param {Array} dataArr
 * @param {Object} keyObj
 * @returns {Array}
 * @example see @/views/order/orderImport
 * @description 改变Obj数据的key
 */
export function changeArrKey(dataArr, keyObj) {
  return dataArr.map((item) => {
    return changeObjKey(item, keyObj)
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
export function getDicLabel(
  value,
  dic = [],
  props = { label: 'label', value: 'value' }
) {
  // console.log(value, dic, props);
  let item = dic.find((item) => item[props.value] === value)
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
export function getDicValue(
  label,
  dic = [],
  props = { label: 'label', value: 'value' }
) {
  // console.log(value, dic, props);
  let item = dic.find((item) => item[props.label] === label)
  return item ? item[props.value] : ''
}

/**
 * @param {Array} urls
 * @param {Function} handler
 * @param {Number} limit
 * @returns {Promise}
 * @example see productComponent.vue
 * @description 并发请求个数限制
 */
export function limitLoad(urls, handler, limit = 8) {
  // 对数组做一个拷贝
  const sequence = [...urls]

  let promises = []

  // 并发请求到最大数
  promises = sequence.splice(0, limit).map((url, index) => {
    // 这里返回的 index 是任务在 promises 的脚标，用于在 Promise.race 之后找到完成的任务脚标
    return handler(url).then(() => {
      return index
    })
  })

  // 利用数组的 reduce 方法来以队列的形式执行
  return sequence
    .reduce((last, url) => {
      return last
        .then(() => {
          // 返回最快改变状态的 Promise
          return Promise.race(promises)
        })
        .catch((err) => {
          // 这里的 catch 不仅用来捕获前面 then 方法抛出的错误
          // 更重要的是防止中断整个链式调用
          console.error(err)
        })
        .then((res) => {
          // 用新的 Promise 替换掉最快改变状态的 Promise
          promises[res] = handler(url).then(() => {
            return res
          })
        })
    }, Promise.resolve())
    .then(() => {
      return Promise.all(promises)
    })
}
/*console.log('handler');

function handler(url) {
  return new Promise(resolve => {
    setTimeout(function () {
      console.log(url);
      resolve(url)
    }, 1000)
  })
}
limitLoad([0,1,2,3,4,5,6,7,8,9], handler, 3).then(res => {
  console.log(res);
})*/

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


/*
for (let i = 0; i < 5; i++) {
  requestQueue(function () {
    return new Promise((resolve, reject) => {
      setTimeout(function () {
        (i%2 ? resolve : reject)(i)
      }, 1000)
    })
  })
}*/


export function delPropOfObj(obj, delArr) {
  delArr.forEach(prop => delete obj[prop])
  return obj
}

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