// eslint-disable-next-line no-undef
importScripts('js/UZIP.js', 'js/pako.js', 'js/URNG.js')
onmessage = async function (evt) {
  console.log(1)
  let { white_show, shadow_show, data, show_image_mapxy } = evt.data
  data.map((item) => {
    let { kl_mask, front_design, klMaskImg } = item
    fillColsAndRows(klMaskImg)
    kl_mask.klMaskImg = klMaskImg
    calcShowImage({
      show_image: fillColsAndRows(white_show),
      front_image: fillColsAndRows(front_design),
      show_image_mapxy: show_image_mapxy,
      kl_image: kl_mask
    })
  })

  addEffOnShow(white_show, fillColsAndRows(shadow_show))
  // eslint-disable-next-line
  const showData = UPNG.encode([white_show.data], white_show.width, white_show.height, 0)
  const blob = new Blob([showData], { type: 'image/jpg' })
  blobToDataURL(blob).then((imageURL) => {
    postMessage(imageURL)
  })
}

function blobToDataURL(blob) {
  return new Promise((fulfill, reject) => {
    let reader = new FileReader()
    reader.onerror = reject
    reader.onload = (e) => fulfill(reader.result)
    reader.readAsDataURL(blob)
  })
}

onerror = function (e) {
  console.log(['ERROR: Line ', e.lineno, ' in ', e.filename, ': ', e.message].join(''))
}

function fillColsAndRows(data) {
  if (!data) {
    return {}
  }
  if (!data.cols && data.width) {
    data.cols = data.width
  }
  if (!data.rows && data.height) {
    data.rows = data.height
  }
  return data
}

/* eslint-disable */

// 坐标（x，y）查找mask是否为零
// 0， 返回false
// 非零， 返回true
function hasMaskFlag(front_mask, x, y) {
  if (!front_mask) return false
  const { data, cols, rows } = front_mask
  if (x < 0 || y < 0) return false
  if (x >= cols || y >= rows) return false
  const channels = getPixelByCoord(front_mask, x, y)

  try {
    return channels[3] != 0
  } catch (err) {
    return false
  }
}

// 计算三角形，外接矩形区域
function calcTriRect(rect, pt1, pt2, pt3) {
  const { min, max } = Math
  const xl = min(min(pt1.x, pt2.x), pt3.x)
  const yl = min(min(pt1.y, pt2.y), pt3.y)
  const xr = max(max(pt1.x, pt2.x), pt3.x)
  const yr = max(max(pt1.y, pt2.y), pt3.y)

  rect.left = xl
  rect.top = yl
  rect.width = xr - xl
  rect.height = yr - yl
  return true
}

function calcMapPoint(mapPt, A, pt) {
  if (!A) return false
  mapPt.x = A[0] * pt.x + A[1] * pt.y + A[2]
  mapPt.y = A[3] * pt.x + A[4] * pt.y + A[5]

  return true
}

function calc_img_cell_pixel(color, front_image, x, y) {
  const { min, max } = Math
  if (!front_image) return -1
  if (x < 0 || y < 0) return -1

  if (x >= front_image.cols || y >= front_image.rows) return -1
  const nchannels = 4

  // 计算权重
  let nx = parseInt(x)
  let ny = parseInt(y)
  const wx = x - nx
  const wy = y - ny

  // 处理边界
  nx = min(nx, front_image.cols - 2)
  nx = max(0, nx)

  ny = min(ny, front_image.rows - 2)
  ny = max(0, ny)
  // 插值
  for (let i = 0; i < nchannels; ++i) {
    color[i] =
      (1 - wx) * (1 - wy) * getPixelByCoord(front_image, nx, ny)[i] +
      wx * (1 - wy) * getPixelByCoord(front_image, nx + 1, ny)[i] +
      (1 - wx) * wy * getPixelByCoord(front_image, nx, ny + 1)[i] +
      wx * wy * getPixelByCoord(front_image, nx + 1, ny + 1)[i]
  }

  return 0
}

export function calcShowImage({ show_image, front_image, show_image_mapxy, kl_image }) {
  if (!show_image || !front_image) return false
  if (!show_image_mapxy) return false
  const h = show_image.rows
  const w = show_image.cols
  for (let y = 0; y < h; ++y) {
    for (let x = 0; x < w; ++x) {
      //history
      // const mx = parseFloat(show_image_mapxy[2 * y * w + 2 * x + 0])
      // const my = parseFloat(show_image_mapxy[2 * y * w + 2 * x + 1])
      //diff diff
      const mx = parseFloat(show_image_mapxy[3 * y * w + 3 * x + 0])
      const my = parseFloat(show_image_mapxy[3 * y * w + 3 * x + 1])
      const alpha = parseFloat(show_image_mapxy[3 * y * w + 3 * x + 2])

      //history
      // const kl_x = parseFloat(mx - kl_image.left)
      // const kl_y = parseFloat(my - kl_image.top)

      if (mx < 0 || my < 0) {
        continue
      }

      //diff diff
      const kl_x = parseFloat(mx - kl_image.left)
      const kl_y = parseFloat(my - kl_image.top)

      try {
        const has_mark_v = hasMaskFlag(kl_image.klMaskImg, parseInt(kl_x), parseInt(kl_y))
        if (!has_mark_v) continue
      } catch (err) {
        continue
      }

      const color = []
      const res = calc_img_cell_pixel(color, front_image, kl_x / kl_image.wRadio, kl_y / kl_image.hRadio)

      if (res == -1) continue

      //history
      // const alpha = parseFloat(eff_image.data[getRedChannelNum(eff_image.cols, x, y) + 3] / 255.0)
      // const redChannelNum = getRedChannelNum(show_image.cols, x, y)
      // show_image.data[redChannelNum] = eff_image.data[redChannelNum] * alpha + (1.0 - alpha) * color[0]
      // show_image.data[redChannelNum + 1] = eff_image.data[redChannelNum + 1] * alpha + (1.0 - alpha) * color[1]
      // show_image.data[redChannelNum + 2] = eff_image.data[redChannelNum + 2] * alpha + (1.0 - alpha) * color[2]
      //diff
      //颜色通道
      const nchannels = 4
      color[0] = alpha * color[0] + (1 - alpha) * show_image.data[y * show_image.cols * nchannels + x * nchannels + 0]
      color[1] = alpha * color[1] + (1 - alpha) * show_image.data[y * show_image.cols * nchannels + x * nchannels + 1]
      color[2] = alpha * color[2] + (1 - alpha) * show_image.data[y * show_image.cols * nchannels + x * nchannels + 2]
      //diff
      show_image.data[y * show_image.cols * nchannels + x * nchannels + 0] = color[0]
      show_image.data[y * show_image.cols * nchannels + x * nchannels + 1] = color[1]
      show_image.data[y * show_image.cols * nchannels + x * nchannels + 2] = color[2]
    }
  }

  return true
}

//diff
function addEffOnShow(show_image, eff_image) {
  const nchannels = 4
  if (!show_image || !eff_image) return false
  if (show_image.cols != eff_image.cols || show_image.rows != eff_image.rows) return false
  if (nchannels != 4) return false

  for (let j = 0; j < show_image.rows; ++j) {
    for (let i = 0; i < show_image.cols; ++i) {
      const alpha = parseInt(eff_image.data[4 * j * show_image.cols + 4 * i + 3])
      if (alpha != 0) {
        const alpha_f = parseFloat(alpha / 255.0)

        const tmp_show_color = []
        tmp_show_color[0] = show_image.data[j * show_image.cols * nchannels + i * nchannels + 0]
        tmp_show_color[1] = show_image.data[j * show_image.cols * nchannels + i * nchannels + 1]
        tmp_show_color[2] = show_image.data[j * show_image.cols * nchannels + i * nchannels + 2]

        const tmp_eff_color = []
        tmp_eff_color[0] = eff_image.data[4 * j * eff_image.cols + 4 * i + 0]
        tmp_eff_color[1] = eff_image.data[4 * j * eff_image.cols + 4 * i + 1]
        tmp_eff_color[2] = eff_image.data[4 * j * eff_image.cols + 4 * i + 2]

        show_image.data[j * show_image.cols * nchannels + i * nchannels + 0] =
          alpha_f * tmp_eff_color[0] + (1.0 - alpha_f) * tmp_show_color[0]
        show_image.data[j * show_image.cols * nchannels + i * nchannels + 1] =
          alpha_f * tmp_eff_color[1] + (1.0 - alpha_f) * tmp_show_color[1]
        show_image.data[j * show_image.cols * nchannels + i * nchannels + 2] =
          alpha_f * tmp_eff_color[2] + (1.0 - alpha_f) * tmp_show_color[2]
      }
    }
  }

  return true
}

export function getPixelByCoord({ data, cols }, coordX, coordY) {
  const num = parseInt(coordX * 4 + coordY * cols * 4)
  return [data[num], data[num + 1], data[num + 2], data[num + 3]]
}

export function getRedChannelNum(cols, coordX, coordY) {
  return parseInt(coordX * 4 + coordY * cols * 4)
}
