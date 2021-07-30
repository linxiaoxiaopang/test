export * from './utils/fileUtil'
export * from './utils/businessUtil'
export * from './utils/imageUtil'
export * from './utils/excel'
export * from './common'

/**
 * Created by jiachenpan on 16/11/18.
 */
import { v4 as uuidv4 } from 'uuid'
import cloneDeep from 'lodash/cloneDeep'
import superRouter from '@/router/superRouter'
import axios from 'axios'
import { Message } from 'element-ui'
import { PIC_BIG_SIZE, COMPRESS_MAX_NUM } from '@/utils/constant'
import Compressor from 'compressorjs'

export function parseTime(time) {
  if (time) {
    var date = new Date(time)
    var year = date.getFullYear()
    /* 在日期格式中，月份是从0开始的，因此要加0
     * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
     * */
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    // 拼接
    return year + '年' + month + '月' + day + '日 ' + hours + ':' + minutes + ':' + seconds
  } else {
    return ''
  }
}

// 格式化为YYYY-MM-DD
export function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [year, month, day].join('-')
}

export function parseCharacterTime(time) {
  if (time) {
    var date = new Date(time)
    var year = date.getFullYear()
    /* 在日期格式中，月份是从0开始的，因此要加0
     * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
     * */
    var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    // 拼接
    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
  } else {
    return ''
  }
}

//将远程图片下载本地成为base64图片
export function getURLBase64(url, config = {}) {
  return axios
    .get(url, {
      responseType: 'blob',
      ...config
    })
    .then((res) => {
      const { status, data } = res || {}
      if (status >= 200 && status < 300) {
        const fileReader = new FileReader()
        const p = new Promise((resolve, reject) => {
          fileReader.onloadend = function(e) {
            resolve(e.target.result)
          }
        })
        fileReader.readAsDataURL(data)
        return p
      }
    })
    .catch((err) => {
      const { message } = err
      if (message && message.cancelMessage) {
        Message.success('取消下载成功')
      }
      console.log(err)
    })
}

export function getURLBlod(url, config = {}) {
  return axios
    .get(url, {
      responseType: 'blob',
      ...config
    })
    .then((res) => {
      const { status, data } = res || {}
      if (status >= 200 && status < 300) {
        return data
      }
    })
    .catch((err) => {
      const { message } = err
      if (message && message.cancelMessage) {
        Message.success('取消下载成功')
      }
      console.log(err)
    })
}
//创建随机id
export const createRandomNum = () => {
  return (
    Date.now().toString(16) +
    Math.random()
      .toString(16)
      .slice(2, 8)
  )
}

export const timeRandomNum = () => {
  return (
    parseTime(Date.now()).replace(/[^\d]/g, '') +
    Math.random()
      .toString(16)
      .slice(2, 8)
  )
}

export const timeNum = () => {
  return parseTime(Date.now()).replace(/[^\d]/g, '')
}

export function parseDay(time) {
  return parseTime(time).split(' ')[0]
}
export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function(...args) {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later.bind(context, ...args), wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

// 替换邮箱字符
export function regEmail(email) {
  if (String(email).indexOf('@') > 0) {
    const str = email.split('@')
    let _s = ''
    if (str[0].length > 3) {
      for (var i = 0; i < str[0].length - 3; i++) {
        _s += '*'
      }
    }
    var new_email = str[0].substr(0, 3) + _s + '@' + str[1]
  }
  return new_email
}

// 替换手机字符
export function regMobile(mobile) {
  if (mobile.length > 7) {
    var new_mobile = mobile.substr(0, 3) + '****' + mobile.substr(7)
  }
  return new_mobile
}

//生产uuid
export function getUUID() {
  return uuidv4()
}

//表单校验
export function requireFun(val) {
  return val + '必填'
}

//筛选掉与当前名称相同的父级分类
export function normalizer(node, name) {
  if (node.children && !node.children.length) {
    delete node.children
  }
  if (node.label === name) {
    node.label = undefined
    delete node.children
  }
  return {
    id: node.id,
    label: node.label,
    children: node.children
  }
}

//格式化字符串为数组对象

export function formatsJsonStrToArray(jsonStr) {
  const repJsonStr = jsonStr.replace(/\(/g, '[').replace(/\)/g, ']')
  const tmpArr = JSON.parse(repJsonStr || '[]')
  return tmpArr.map((item) => {
    return {
      id: item[0],
      name: item[1]
    }
  })
}

export function getPicName(path = '') {
  path = path || ''
  const pointLastIndex = path.lastIndexOf('.')
  const chaLastIndex = path.lastIndexOf('/')
  return path.slice(chaLastIndex + 1, pointLastIndex)
}

export function mapChildrenFilter(data, role) {
  const len = data.length
  for (let i = 0; i < len; i++) {
    const { permission } = data[i] || {}
    if (permission && permission.length && !permission.includes(role)) {
      data.splice(i, 1)
      --i
      continue
    }
    if (data[i] && data[i].children) {
      mapChildrenFilter(data[i].children, role)
    }
  }
  return data
}

export function file2Content(file) {
  return new Promise((resolve) => {
    const fileReader = new FileReader()
    fileReader.onloadend = function(e) {
      const result = e.target.result
      resolve(result)
    }
    fileReader.onerror = function(e) {
      resolve(false)
    }
    fileReader.readAsText(file, 'utf-8')
  })
}

// export function shakingChildren(treeData) {
//   let tmp = []
//   treeData.map(item => {
//     const bool = Array.isArray(item.children) && item.children.length
//     if (bool) {
//       tmp = tmp.concat(shakingChildren(item.children))
//     }
//     item.children = []
//     tmp = tmp.concat(item)
//   })
//   return tmp
// }

//返回递归数组中key字段的数组
export function shakingChildren(data, key) {
  let tempArr = []
  data = cloneDeep(data)
  data.map((item) => {
    if (Array.isArray(key)) {
      const tmpObj = {}
      key.map((sKey) => {
        tmpObj[sKey] = item[sKey]
      })
      tempArr.push(tmpObj)
    } else if (key) {
      tempArr.push(item[key])
    } else {
      tempArr.push(item)
    }

    if (Array.isArray(item.children) && item.children.length > 0) {
      if (key) {
        tempArr = tempArr.concat(shakingChildren(item.children, key))
      } else {
        tempArr = tempArr.concat(shakingChildren(item.children))
      }
    }
    item.children = []
  })
  return tempArr.filter((item) => item)
}
export function treeData(data, pid) {
  let tmp = []
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    if (item.pid === pid) {
      tmp.push(item)
      data.splice(i, 1)
      item.children = treeData(data, item.id)
      i--
    }
  }
  if (pid === null) {
    tmp = data.concat(tmp)
  }
  return tmp
}

export function bothDifferent(origin, source) {
  origin = cloneDeep(origin, 1)
  source = cloneDeep(source, 1)
  for (let i = 0; i < origin.length; i++) {
    const oItem = origin[i]

    const isSame =
      source.findIndex(({ component, path }) => {
        const oComponent = oItem.component === 'Layout' ? '' : oItem.component
        component = component === 'Layout' ? '' : component
        const oPath = oItem.path.replace(/^\//, '')
        path = path.replace(/^\//, '')
        return oComponent === component && path === oPath
      }) >= 0

    if (isSame) {
      origin.splice(i, 1)
      i--
    }
  }
  return origin
}

//获取superRouterd的id
function getLastId() {
  const cloneRoutes = cloneDeep(superRouter)
  const maxNum = Math.max(...shakingChildren(cloneRoutes, 'id').map((item) => item.split('-')[1])) + 1
  console.log(maxNum)
}
getLastId()

//获取缩略图
export function getThumbnail(file, callback) {
  return new Promise((resolve, reject) => {
    if (file.type == 'image/jpeg' && file.size >= PIC_BIG_SIZE) {
      var reader = new FileReader()
      reader.onload = function(e) {
        var array = new Uint8Array(e.target.result),
          start,
          end
        for (var i = 2; i < array.length; i++) {
          if (array[i] == 0xff) {
            if (!start) {
              if (array[i + 1] == 0xd8) {
                start = i
              }
            } else {
              if (array[i + 1] == 0xd9) {
                end = i
                // break;
              }
            }
          }
        }
        if (start && end) {
          const arr = array.subarray(start, end)

          resolve({
            url: URL.createObjectURL(new File([arr], { type: 'image/jpeg' }))
          })
        } else {
          resolve({ url: callback(URL.createObjectURL(file)) })
        }
      }
      reader.readAsArrayBuffer(file.slice(0, 50000))
    } else if (file.type.indexOf('image/') === 0) {
      resolve({
        url: URL.createObjectURL(file)
      })
    }
  })
}

export function compressFile(file, maxWidth = COMPRESS_MAX_NUM, maxHeight = COMPRESS_MAX_NUM) {
  return new Promise((resolve) => {
    new Compressor(file, {
      maxWidth: maxWidth,
      maxHeight: maxHeight,
      convertSize: 'Infinity',
      success(result) {
        const { width: naturalWidth, height: naturalHeight } = this.image
        resolve({
          file: result,
          name: result.name,
          naturalWidth,
          naturalHeight
        })
      },
      error(err) {
        resolve(null)
      }
    })
  })
}
//获取base64缩略图
export function getBase64Thumbnail(file, callback) {
  return new Promise((resolve, reject) => {
    if (file.type == 'image/jpeg' && file.size >= PIC_BIG_SIZE) {
      var reader = new FileReader()
      reader.onload = function(e) {
        var array = new Uint8Array(e.target.result),
          start,
          end
        for (var i = 2; i < array.length; i++) {
          if (array[i] == 0xff) {
            if (!start) {
              if (array[i + 1] == 0xd8) {
                start = i
              }
            } else {
              if (array[i + 1] == 0xd9) {
                end = i
                break
              }
            }
          }
        }
        if (start && end) {
          const arr = array.subarray(start, end)
          reader.onload = function(e) {
            resolve({
              url: this.result
            })
          }
          reader.readAsDataURL(new Blob([arr], { type: 'image/jpeg' }))
        } else {
          reader.onload = function(e) {
            resolve({
              url: this.result
            })
          }
          reader.readAsDataURL(file)
        }
      }
      reader.readAsArrayBuffer(file.slice(0, 50000))
    } else if (file.type.indexOf('image/') === 0) {
      // eslint-disable-next-line no-redeclare
      var reader = new FileReader()
      reader.onload = function(e) {
        resolve({
          url: this.result
        })
      }
      reader.readAsDataURL(file)
    }
  })
}

//创建spanMeth的唯一Id
export function createdSpanMethodId(row) {
  const { sale_date, order_code, id } = row
  return `${sale_date}${order_code}${id}`
}

export function getValByKey(data, matchVal, option = {}) {
  const defaultOption = {
    key: 'label',
    valKey: 'value'
  }
  if (matchVal === undefined) {
    throw new Error('matchVal 参数是必传')
  }
  option = Object.assign({}, defaultOption, option)
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    if (item[option.valKey] == matchVal) {
      return item[option.key]
    }
  }
}

export function conversionCoord(origin, documentOption, boxOption) {
  const defaultOption = {
    width: 400
  }
  const option = Object.assign({}, defaultOption, boxOption)
  const { top, left, width, height } = origin || {}
  const { width: documentWidth } = documentOption || {}
  const { width: boxWidth } = option
  const proportion = boxWidth / documentWidth
  return {
    top: top * proportion + 'px',
    left: left * proportion + 'px',
    width: width * proportion + 'px',
    height: height * proportion + 'px'
  }
}

export function shakeChilrenBeRow(results) {
  return clearHidden(formatResults(results))
  function formatResults(results) {
    return results.map((item) => {
      item.sonTypeArr = []
      if (item.children) {
        for (let i = 0; i < item.children.length; i++) {
          const sonItem = item.children[i]
          if (!(sonItem.children && sonItem.children.length)) {
            sonItem.hidden = true
            item.sonTypeArr.push(sonItem)
          } else {
            formatResults(item.children)
          }
        }
      }

      return item
    })
  }

  function clearHidden(results) {
    for (let i = 0; i < results.length; i++) {
      if (results[i].hidden) {
        results.splice(i, 1)
        --i
      } else {
        clearHidden(results[i].children || [])
      }
    }
    return results
  }
}

export function objBeArray(obj) {
  const tmpArr = []
  for (let key in obj) {
    tmpArr.push({
      id: Number(key),
      name: obj[key]
    })
  }
  return tmpArr
}

export function getMousePos(event) {
  const e = event || window.event
  const scrollX = document.documentElement.scrollLeft || document.body.scrollLeft
  const scrollY = document.documentElement.scrollTop || document.body.scrollTop
  const x = e.pageX || e.clientX + scrollX
  const y = e.pageY || e.clientY + scrollY
  //alert('x: ' + x + '\ny: ' + y);
  return { x: x, y: y }
}

export function getPartObj(obj = {}, keys) {
  return keys.reduce((tempObj, key) => {
    tempObj[key] = obj[key]
    return tempObj
  }, {})
}
