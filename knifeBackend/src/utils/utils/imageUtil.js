import { createRandomNum } from '../index'
//图片处理
export function getImgData(src) {
  let lock = false
  let img = new Image()
  img.setAttribute('crossOrigin', 'Anonymous')
  let c = document.createElement('canvas')
  const ctx = c.getContext('2d')
  return new Promise((resolve, reject) => {
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
      try {
        if (!lock) {
          lock = true
          if (src.length < 200) {
            img.src = src + '?uid' + createRandomNum()
          } else {
            img.src = src
          }
        }
      } catch (err) {
        reject(false)
      }
    }
    img.src = src
  })
}

export function getTileCanvasImgData(src, cW, cH) {
  let lock = false
  let img = new Image()
  img.setAttribute('crossOrigin', 'Anonymous')
  let c = document.createElement('canvas')
  const ctx = c.getContext('2d')
  return new Promise((resolve, reject) => {
    img.onload = () => {
      const { width, height } = img
      c.width = cW || width
      c.height = cH || height
      c.setAttribute('id', 'img')

      // ctx.drawImage(img, 0, 0)
      const pat = ctx.createPattern(img, 'repeat')
      ctx.rect(0, 0, c.width, c.height)
      ctx.fillStyle = pat
      ctx.fill()
      const imgData = ctx.getImageData(0, 0, cW || width, cH || height)

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
      try {
        if (!lock) {
          lock = true
          if (src.length < 200) {
            img.src = src + '?uid' + createRandomNum()
          } else {
            img.src = src
          }
        }
      } catch (err) {
        reject(false)
      }
    }
    img.src = src
  })
}

export function getRedImgData(src) {
  let lock = false
  const img = new Image()
  const c = document.createElement('canvas')
  const ctx = c.getContext('2d')
  return new Promise((resolve) => {
    img.onload = () => {
      const { width, height } = img
      img.setAttribute('crossOrigin', 'Anonymous')
      c.width = width
      c.height = height
      // c.setAttribute("id", "img");
      ctx.drawImage(img, 0, 0)
      const imgData = ctx.getImageData(0, 0, width, height)
      imgData.cols = width
      imgData.rows = height
      const widthRows = width * 4
      const data = imgData.data
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] !== 0) {
          data[i] = 123 // red
          data[i + 1] = 175 // green
          data[i + 2] = 232 // blu
        }
      }

      ctx.putImageData(imgData, 0, 0)
      resolve(c)
      // const rand = parseInt(Math.random(0, width * height))
      // if (imgData.data[rand] > 0) {
      //   clearInterval(timer)
      //   resolve(imgData)
      // }
    }
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

export function getPixelByCoord({ data, cols }, coordX, coordY) {
  const num = parseInt(coordX * 4 + coordY * cols * 4)
  return [data[num], data[num + 1], data[num + 2], data[num + 3]]
}

export function getImgDom(src) {
  const img = new Image()
  return new Promise((resolve) => {
    img.onload = () => {
      setTimeout(() => {
        resolve(img)
      }, 500)
    }
    img.onerror = () => {
      resolve(null)
    }
    img.src = src
  })
}

export function getFileNameWithoutExpand(name) {
  name = name || ''
  return name.split('.')[0]
}
