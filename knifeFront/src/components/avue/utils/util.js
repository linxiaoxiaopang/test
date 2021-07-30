import { validatenull } from './validate'
import store from '@/store'
/**
 * 根据字典的value和字典值key显示label
 * @param {string} key
 * @param value
 * @return
 */
export const getLabel = (key, value) => {
  store.dispatch('GetDic', key)
  let aDic = store.state.dic[key]
  return findByvalue(aDic.dicData, value, aDic.props)
}
/**
 * 将树形数据转化为dic数据
 */
export const toDic = (dic) => {
  let tempArr = []
  dic.map((treeItem) => {
    tempArr.push(treeItem)
    let children = treeItem.children
    if (!validatenull(children)) tempArr = tempArr.concat(toDic(children))
  })
  return tempArr
}
/**
 * 将树形数据转化为dic数据
 */
export const delDicEmptyChildren = (dic) => {
  return deepClone(dic).map((dicItem) => {
    let children = dicItem.children
    if (validatenull(children)) {
      dicItem.children = undefined
    } else if (Array.isArray(children)) {
      dicItem.children = delDicEmptyChildren(children)
    }
    return dicItem
  })
}
/**
 * 根据字典的value显示label
 */
export const findByvalue = (dic, value, props = { label: 'label', value: 'value' }) => {
  // console.log('findByvalue', dic, value, props);
  let result = ''
  if (validatenull(dic)) return value
  dic = toDic(dic)
  if (typeof value == 'string' || typeof value == 'number' || typeof value == 'boolean') {
    let index = 0
    index = findArray(dic, value, props)
    if (index != -1) {
      result = dic[index][props.label]
    } else {
      result = value
    }
  } else if (value instanceof Array && dic[0].children) {
    let index = 0
    let count = 0
    while (count < value.length) {
      index = findArray(dic, value[count], props)
      if (!validatenull(dic[index])) {
        result = result + dic[index][props.label] + '/'
        dic = dic[index].children
      }
      count++
    }
    result = result.substr(0, result.length - 1)
  } else if (value instanceof Array) {
    result = []
    let index = 0
    value.forEach((ele) => {
      index = findArray(dic, ele, props)
      if (index != -1) {
        result.push(dic[index][props.label])
      } else {
        result.push(ele)
      }
    })
    result = result.toString()
  }
  return result
}
/**
 * 根据字典的value查找对应的index
 */
export const findArray = (dic, value, props = { label: 'label', value: 'value' }) => {
  // console.log('findArray', dic, value, props);
  for (let i = 0; i < dic.length; i++) {
    if (dic[i][props.value] == value) {
      return i
    }
  }
  return -1
}
/**
 * 获取字典
 */
export const setDic = (dicData, DIC) => {
  return typeof dicData == 'string' ? DIC : dicData
}
/**
 * 设置px
 */
export const setPx = (val, defval) => {
  if (validatenull(val)) {
    val = defval
  }
  val = val + ''
  if (val.indexOf('%') == -1) {
    val = val + 'px'
  }
  return val
}

/**
 * 搜索框获取动态组件
 */
export const getSearchType = (type) => {
  if (type == 'select' || type == 'checkbox') {
    return 'crudSelect'
  } else if (type == 'radio') {
    return 'crudRadio'
  } else if (type == 'time') {
    return 'crudTime'
  } else if (type == 'date' || type == 'datetime' || type == 'daterange') {
    return 'crudDate'
  } else if (type == 'cascader') {
    return 'crudCascader'
  } else if (type == 'number') {
    return 'crudInputNumber'
  } else {
    return 'crudInput'
  }
}

/**
 * 动态获取组件
 */
export const getComponent = (type) => {
  if (type == 'select') {
    return 'crudSelect'
  } else if (type == 'radio') {
    return 'crudRadio'
  } else if (type == 'checkbox') {
    return 'crudCheckbox'
  } else if (type == 'time') {
    return 'crudTime'
  } else if (type == 'date' || type == 'datetime' || type == 'daterange') {
    return 'crudDate'
  } else if (type == 'cascader') {
    return 'crudCascader'
  } else if (type == 'number') {
    return 'crudInputNumber'
  } else if (type == 'ueditor') {
    return 'crudUeditor'
  } else if (type == 'upload') {
    return 'crudUpload'
  } else if (type == 'fileUpload') {
    return 'crudFileUpload'
  } else if (type == 'password') {
    return 'crudInput'
  } else {
    return 'crudInput'
  }
}

/**
 * 动态获取组件
 */
export const getSingleComponent = (type) => {
  if (type == 'select') {
    return 'avueCrudSelect'
  } else if (type == 'radio') {
    return 'avueCrudRadio'
  } else if (type == 'checkbox') {
    return 'avueCrudCheckbox'
  } else if (type == 'time') {
    return 'avueCrudTime'
  } else if (type == 'date' || type == 'datetime' || type == 'daterange') {
    return 'avueCrudDate'
  } else if (type == 'cascader') {
    return 'avueCrudCascader'
  } else if (type == 'number') {
    return 'avueCrudInputNumber'
  } else if (type == 'ueditor') {
    return 'avueCrudUeditor'
  } else if (type == 'upload') {
    return 'avueCrudUpload'
  } else if (type == 'fileUpload') {
    return 'avueCrudFileUpload'
  } else if (type == 'password') {
    return 'avueCrudInput'
  } else {
    return 'avueCrudInput'
  }
}

/**
 * get请求数据缓存
 */
export const httpGet = (httpGet) => {
  let httpGetCache = {}
  return function (url) {
    if (httpGetCache[url]) return httpGetCache[url]

    httpGetCache[url] = httpGet(url).catch((err) => {
      httpGetCache[url] = null
      return Promise.reject(err)
    })
    return httpGetCache[url]
  }
}

/**
 * post请求数据缓存
 */
export const httpPost = (httpPost) => {
  let httpPostCache = {}
  return function (url) {
    if (httpPostCache[url]) return httpPostCache[url]

    httpPostCache[url] = httpPost(url, {}).catch((err) => {
      httpPostCache[url] = null
      return Promise.reject(err)
    })
    return httpPostCache[url]
  }
}

export const getObjType = function getObjType(obj) {
  var toString = Object.prototype.toString
  var map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object',
    '[object Promise]': 'promise'
  }
  if (obj instanceof Element) {
    return 'element'
  }
  return map[toString.call(obj)]
}
/**
 * 对象深拷贝
 */
export const deepClone = function deepClone(data) {
  var type = getObjType(data)
  var obj
  if (type === 'array') {
    obj = []
  } else if (type === 'object') {
    obj = {}
  } else {
    // 不再具有下一层次
    return data
  }
  if (type === 'array') {
    for (var i = 0, len = data.length; i < len; i++) {
      delete data[i].$parent
      obj.push(deepClone(data[i]))
    }
  } else if (type === 'object') {
    for (var key in data) {
      delete data.$parent
      obj[key] = deepClone(data[key])
    }
  }
  return obj
}

export function vaildData(val, dafult) {
  if (typeof val == 'boolean') {
    return val
  }
  return !validatenull(val) ? val : dafult
}

/**
 * @param {any} nData
 * @param {any} oData
 * @returns {Object}
 * @example see
 */
export function getDiffData(nData, oData) {
  if (validatenull(oData) && !validatenull(oData)) return nData

  let type = getObjType(nData)
  let oType = getObjType(oData)
  let obj = {}

  if (type === 'array') {
    if (type !== oType) return obj
    obj = []
  } else if (type === 'object') {
    if (type !== oType) return obj
    obj = {}
  } else {
    // 不再具有下一层次
    if (nData !== oData) obj = nData
    return obj
  }
  if (type === 'array') {
    for (var i = 0, len = nData.length; i < len; i++) {
      delete nData[i].$parent
      let nVal = nData[i]
      let oVal = oData[i]
      let diffData = getDiffData(nVal, oVal)

      if (diffData instanceof Array) {
        if (diffData.length == 0) continue
      } else if (diffData instanceof Object) {
        if (JSON.stringify(diffData) === '{}') continue
      } else if (diffData === undefined) {
        continue
      }
      obj.push(diffData)
    }
  } else if (type === 'object') {
    for (var key in nData) {
      delete nData.$parent
      let nVal = nData[key]
      let oVal = oData[key]
      let diffData = getDiffData(nVal, oVal)

      if (diffData instanceof Array) {
        if (diffData.length == 0) continue
      } else if (diffData instanceof Object) {
        if (JSON.stringify(diffData) === '{}') continue
      } else if (diffData === undefined) {
        continue
      }
      obj[key] = diffData
    }
  }
  return obj
}
