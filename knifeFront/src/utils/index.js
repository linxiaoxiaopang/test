/* eslint-disable */
export * from './calculate'
export * from './parse'
export * from './validate'
export * from './common'
export * from './validate'

/**
 * Created by jiachenpan on 16/11/18.
 */
import { v4 as uuidv4 } from 'uuid'
import cloneDeep from 'lodash/cloneDeep'
import superRouter from '@/router/superRouter'
import axios from 'axios'
import { Message } from 'element-ui'
import { PICBIGSIZE, COMPRESS_MAX_NUM } from '@/utils/constant'
import tinycolor from 'tinycolor2'
import Compressor from 'compressorjs'

export function colorStr2Obj(data, oldHue) {
  var alpha = data && data.a
  var color
  if (data && data.hsl) {
    color = tinycolor(data.hsl)
  } else if (data && data.hex && data.hex.length > 0) {
    color = tinycolor(data.hex)
  } else if (data && data.hsv) {
    color = tinycolor(data.hsv)
  } else if (data && data.rgba) {
    color = tinycolor(data.rgba)
  } else if (data && data.rgb) {
    color = tinycolor(data.rgb)
  } else {
    color = tinycolor(data)
  }

  if (color && (color._a === undefined || color._a === null)) {
    color.setAlpha(alpha || 1)
  }

  var hsl = color.toHsl()
  var hsv = color.toHsv()

  if (hsl.s === 0) {
    hsv.h = hsl.h = data.h || (data.hsl && data.hsl.h) || oldHue || 0
  }
  return {
    hsl: hsl,
    hex: color.toHexString().toUpperCase(),
    hex8: color.toHex8String().toUpperCase(),
    rgba: color.toRgb(),
    hsv: hsv,
    oldHue: data.h || oldHue || hsl.h,
    source: data.source,
    a: data.a || color.getAlpha()
  }
}

function transferDate(date) {
  // 年
  var year = date.getFullYear()
  // 月
  var month = date.getMonth() + 1
  // 日
  var day = date.getDate()

  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (day >= 0 && day <= 9) {
    day = '0' + day
  }

  var dateString = year + '/' + month + '/' + day

  return dateString
}

export function getWeek(date) {
  //按周日为一周的最后一天计算
  date = date ? new Date(date) : new Date()

  //今天是这周的第几天
  var today = date.getDay()

  //上周日距离今天的天数（负数表示）
  var stepSunDay = -today + 1

  // 如果今天是周日
  if (today == 0) {
    stepSunDay = -7
  }

  // 周一距离今天的天数（负数表示）
  var stepMonday = 7 - today

  var time = date.getTime()

  var monday = new Date(time + stepSunDay * 24 * 3600 * 1000)
  var sunday = new Date(time + stepMonday * 24 * 3600 * 1000)

  //本周一的日期 （起始日期）
  var startDate = transferDate(monday) // 日期变换
  //本周日的日期 （结束日期）
  var endDate = transferDate(sunday) // 日期变换

  return [startDate, endDate]
}

export function getMonth(date) {
  // 获取当前月的第一天
  date = date ? new Date(date) : new Date()
  var start = new Date(date)
  start.setDate(1)

  // 获取当前月的最后一天
  var date = new Date(date)
  var currentMonth = date.getMonth()
  var nextMonth = ++currentMonth
  var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
  var oneDay = 1000 * 60 * 60 * 24
  var end = new Date(nextMonthFirstDay - oneDay)

  var startDate = transferDate(start) // 日期变换
  var endDate = transferDate(end) // 日期变换

  return [startDate, endDate]
}

export function parseTime(time) {
  if (time) {
    var date = new Date(time)
    var year = date.getFullYear()
    /* 在日期格式中，月份是从0开始的，因此要加0
     * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
     * */
    var month =
      date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    var minutes =
      date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    var seconds =
      date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    // 拼接
    return (
      year +
      '年' +
      month +
      '月' +
      day +
      '日 ' +
      hours +
      ':' +
      minutes +
      ':' +
      seconds
    )
  } else {
    return ''
  }
}

export function parseChineseTime(time) {
  if (time) {
    var date1 = new Date(time)
    var date = date1.setHours(date1.getHours() + 8)
    date = new Date(date)
    var year = date.getFullYear()
    /* 在日期格式中，月份是从0开始的，因此要加0
     * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
     * */
    var month =
      date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    var minutes =
      date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    var seconds =
      date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    // 拼接
    return (
      year +
      '年' +
      month +
      '月' +
      day +
      '日 ' +
      hours +
      ':' +
      minutes +
      ':' +
      seconds
    )
  } else {
    return ''
  }
}

export function parseCharacterTime(time) {
  if (time) {
    var date = new Date(time)
    var year = date.getFullYear()
    /* 在日期格式中，月份是从0开始的，因此要加0
     * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
     * */
    var month =
      date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    var minutes =
      date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    var seconds =
      date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    // 拼接
    return (
      year +
      '-' +
      month +
      '-' +
      day +
      ' ' +
      hours +
      ':' +
      minutes +
      ':' +
      seconds
    )
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
          fileReader.onloadend = function (e) {
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

//创建随机id
export const createRandomNum = () => {
  return Date.now().toString(16) + Math.random().toString(16).slice(2, 8)
}

export function conversionTimeFmt(fmt, date) {
  date = date ? new Date(date) : new Date()
  var o = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds() //毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

export const timeRandomNum = () => {
  return (
    parseTime(Date.now()).replace(/[^\d]/g, '') +
    Math.random().toString(16).slice(2, 8)
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
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

export function debounce(func, wait = 200, immediate) {
  let timeout, args, context, timestamp, result

  const later = function (...args) {
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

  return function (...args) {
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
  if (!Array.isArray(data)) return []
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
  const maxNum =
    Math.max(
      ...shakingChildren(cloneRoutes, 'id').map((item) => item.split('-')[1])
    ) + 1
  console.log(maxNum)
}
getLastId()

export function compressFile(
  file,
  maxWidth = COMPRESS_MAX_NUM,
  maxHeight = COMPRESS_MAX_NUM
) {
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

//获取缩略图
export function getThumbnail(file, callback) {
  return new Promise((resolve, reject) => {
    if (file.type == 'image/jpeg' && file.size >= PICBIGSIZE) {
      var reader = new FileReader()
      reader.onload = function (e) {
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

//获取base64缩略图
export function getBase64Thumbnail(file, callback) {
  return new Promise((resolve, reject) => {
    if (file.type == 'image/jpeg' && file.size >= PICBIGSIZE) {
      var reader = new FileReader()
      reader.onload = function (e) {
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
          reader.onload = function (e) {
            resolve({
              url: this.result
            })
          }
          reader.readAsDataURL(new Blob([arr], { type: 'image/jpeg' }))
        } else {
          reader.onload = function (e) {
            resolve({
              url: this.result
            })
          }
          reader.readAsDataURL(file)
        }
      }
      reader.readAsArrayBuffer(file.slice(0, 50000))
    } else if (file.type.indexOf('image/') === 0) {
      var reader = new FileReader()
      reader.onload = function (e) {
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

export function getPrimShowImgs(data) {
  try {
    return data.map(({ prim_show_groups: [{ prim_show_img = [] }] }) => {
      return prim_show_img
    })
  } catch (err) {
    return []
  }
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

export function file2Content(file) {
  return new Promise((resolve) => {
    const fileReader = new FileReader()
    fileReader.onloadend = function (e) {
      const result = e.target.result
      resolve(result)
    }
    fileReader.onerror = function (e) {
      resolve(false)
    }
    fileReader.readAsText(file, 'utf-8')
  })
}

//获取img的dom
export function getImgDom(src) {
  const img = new Image()
  img.setAttribute('crossOrigin', 'Anonymous')
  return new Promise((resolve) => {
    img.onload = () => {
      setTimeout(() => {
        resolve(img)
      }, 500)
    }
    img.onerror = () => {
      resolve(null)
    }
    img.src = src + '?uid' + createRandomNum()
  })
}

//获取src是阿里云缩略图的img dom
export function getALiThumbnail(src) {
  const img = new Image()
  img.setAttribute('crossOrigin', 'Anonymous')
  return new Promise((resolve) => {
    img.onload = () => {
      resolve(img)
    }
    img.onerror = (err) => {
      console.log('err', err)
      resolve(null)
    }
    console.log('src', src)
    img.src = src
  })
}

export function getImgData(src) {
  let lock = false
  let img = new Image()
  img.setAttribute('crossOrigin', 'Anonymous')
  let c = document.createElement('canvas')
  const ctx = c.getContext('2d')
  return new Promise((resolve) => {
    img.onload = () => {
      const { width, height } = img
      c.width = width
      c.height = height
      c.setAttribute('id', 'img')
      ctx.drawImage(img, 0, 0)
      const imgData = ctx.getImageData(0, 0, width, height)
      imgData.cols = width
      imgData.rows = height
      img.onerror = null
      img.onload = null
      c = null
      img = null
      resolve(imgData)
    }
    //解决本地跨域
    img.onerror = () => {
      if (!lock) {
        lock = true
        if (src.length < 200) {
          img.src = src + '?uid' + createRandomNum()
        } else {
          img.src = src
        }
      }
    }
    img.src = src
  })
}

//获取画布dom
export function getCanvasDom(src) {
  let lock = false
  let img = new Image()
  img.setAttribute('crossOrigin', 'Anonymous')
  let c = document.createElement('canvas')
  const ctx = c.getContext('2d')
  // ctx.rotate(-Math.PI / 4)
  return new Promise((resolve) => {
    img.onload = () => {
      const { width, height } = img
      c.width = width
      c.height = height
      c.setAttribute('id', 'img')
      ctx.drawImage(img, 0, 0)
      resolve(c)
    }
    //解决本地跨域
    img.onerror = () => {
      if (!lock) {
        lock = true
        if (src.length < 200) {
          img.src = src + '?uid' + createRandomNum()
        } else {
          img.src = src
        }
      }
    }
    img.src = src
  })
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


//rx,ry 围绕oX, oY点 获取旋转之后的角度
export function getRotatePoint({ rX, rY, oX, oY, angle }) {
  const { PI, cos, sin } = Math
  const rotate = (PI / 180) * -angle
  let x = (rX - oX) * cos(rotate) - (rY - oY) * sin(rotate) + oX
  let y = (rY - oY) * cos(rotate) + (rX - oX) * sin(rotate) + oY
  console.log(x, y)
  const dirX = x - rX
  const dirY = y - rY
  console.log(dirX, dirY)
  return {
    dirX,
    dirY,
    x,
    y
  }
}

export const isUatOrPro =
  process.env.VUE_APP_BASE_URL === 'www.uat.zdcustom.com' ||
  process.env.VUE_APP_BASE_URL === 'www.zdcustom.com'
