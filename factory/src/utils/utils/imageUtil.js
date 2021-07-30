//图片处理
export function getImgData(src) {
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
      let timer = setInterval(() => {
        const imgData = ctx.getImageData(0, 0, width, height)
        imgData.cols = width
        imgData.rows = height
        const rand = parseInt(Math.random(0, width * height))
        if (imgData.data[rand] > 0) {
          clearInterval(timer)
          resolve(imgData)
        }
      }, 30)
    }
    img.src = src
  })
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
