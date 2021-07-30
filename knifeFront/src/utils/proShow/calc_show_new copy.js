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
  // console.log('x', x)
  // console.log('y', y)
  // console.log('channels', channels)
  try {
    return channels[3] == 255
  } catch (err) {}
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

function calcShowImage(show_image, show_mask, front_image, kl_image, show_pos, tmap, modelPts) {
  if (!show_image || !show_mask || !front_image) return false
  if (!modelPts) return false
  // console.log(2)

  const { id1, id2, id3 } = tmap
  if (id1 < 0 || id1 >= modelPts.length) return false
  if (id2 < 0 || id2 >= modelPts.length) return false
  if (id3 < 0 || id3 >= modelPts.length) return false
  const pt1 = modelPts[id1]
  const pt2 = modelPts[id2]
  const pt3 = modelPts[id3]
  const x1 = pt1.x
  const y1 = pt1.y
  const x2 = pt2.x
  const y2 = pt2.y
  const x3 = pt3.x
  const y3 = pt3.y
  // console.log('modelPts', modelPts)
  const rect = {}
  calcTriRect(rect, pt1, pt2, pt3)
  // console.log(pt1, pt2, pt3)
  // console.log('rect', rect)
  // console.log('show_image.rows', show_image.rows)
  // console.log('show_image.cols', show_image.cols)
  let a, b, c
  const c1 = (y1 - y2) * x3 + (x2 - x1) * y3 + x1 * y2 - x2 * y1
  const b1 = (y1 - y3) * x2 + (x3 - x1) * y2 + x1 * y3 - x3 * y1
  // console.log(3)
  for (let y = rect.top; y < rect.top + rect.height; y++) {
    y = parseInt(y)
    // console.log(4)
    // y坐标是否在图像有效区域
    if (y < 0 || y >= show_image.rows) continue
    for (let x = rect.left; x < rect.left + rect.width; x++) {
      x = parseInt(x)
      // console.log('y', y)
      // console.log('x', x)
      // console.log(5)
      // console.log('x >= show_image.cols', x >= show_image.cols)
      // x坐标是否在图像有效区域
      if (x < 0 || x >= show_image.cols) continue
      // console.log(6)
      // 对应的mask是否有值
      const has_v = hasMaskFlag(show_mask, x - show_pos.show_mask_left, y - show_pos.show_mask_top)
      //console.log('x - show_pos.show_mask_left,', x - show_pos.show_mask_left,)
      //console.log('y - show_pos.show_mask_top,', y - show_pos.show_mask_top,)
      // console.log('has_v', has_v)
      if (!has_v) continue
      // console.log('6666')
      // 计算是否在三角形上或者内部
      c = ((y1 - y2) * x + (x2 - x1) * y + x1 * y2 - x2 * y1) / c1
      b = ((y1 - y3) * x + (x3 - x1) * y + x1 * y3 - x3 * y1) / b1
      a = 1 - b - c

      // console.log('c', c)
      // console.log('b ', b )
      // console.log('a', a)
      // console.log(6)
      if (a >= 0 && a <= 1 && b >= 0 && b <= 1 && c >= 0 && c <= 1) {
        // console.log(7)
        const coord_pt = {}
        const show_pt = {}
        show_pt.x = x
        show_pt.y = y
        calcMapPoint(coord_pt, tmap.A, show_pt)
        // 坐标图的坐标在 设计模上的坐标
        const kl_x = coord_pt.x - kl_image.left
        const kl_y = coord_pt.y - kl_image.top
        // console.log('kl_x', kl_x)
        // console.log('kl_y', kl_y)
        // 计算反向插值像素
        // front_image 是前端已经设计好的图片，与模大小一致
        const color = []
        // console.log('front_image', front_image)
        const res = calc_img_cell_pixel(color, front_image, kl_x, kl_y)
        // console.log("color1", color);
        if (res == -1) continue
        const redChannelNum = getRedChannelNum(show_image.cols, x, y)
        show_image.data[redChannelNum] = (show_image.data[redChannelNum] * color[0]) / 255.0
        show_image.data[redChannelNum + 1] = (show_image.data[redChannelNum + 1] * color[1]) / 255.0
        show_image.data[redChannelNum + 2] = (show_image.data[redChannelNum + 2] * color[2]) / 255.0
      }
    }
  }
}

/*
  show_image: 拍摄效果图，计算结果也保存在该图
  show_mask: 效果图制作的模，表示需要计算的区域
  front_image: 前端设计的图片
  kl_image: 保存的是，前端设计图与坐标图坐标的转换关系
  show_pos:  效果图的mask与效果图坐标转换关系
  upMaps存储的是映射矩阵
  downMaps存储的是映射矩阵
  modelPts存储的效果图上设计的点的坐标
*/

export async function goCalcShowImage(
  show_image,
  show_mask,
  front_image,
  kl_image,
  show_pos,
  upMaps,
  downMaps,
  modelPts
) {
  if (!show_image || !show_mask || !front_image) return false
  if (!upMaps || !downMaps || !modelPts) return false
  if (upMaps.length != downMaps.length) return false
  for (let i = 0; i < upMaps.length; ++i) {
    calcShowImage(show_image, show_mask, front_image, kl_image, show_pos, upMaps[i], modelPts)
    calcShowImage(show_image, show_mask, front_image, kl_image, show_pos, downMaps[i], modelPts)
  }
  return true
  const { rows: width, cols: height } = show_image
  const c = document.createElement('canvas')
  const ctx = c.getContext('2d')
  c.width = width
  c.height = height
  c.setAttribute('id', 'img')
  ctx.putImageData(show_image, 0, 0)
  // return c.toDataURL()
  console.log(c.toDataURL())
  return true
}

export function getPixelByCoord({ data, cols }, coordX, coordY) {
  // console.log('data', data)
  const num = parseInt(coordX * 4 + coordY * cols * 4)
  // console.log('num', num)
  // console.log('[data[num], data[num + 1], data[num + 2], data[num + 3]]', [data[num], data[num + 1], data[num + 2], data[num + 3]])
  return [data[num], data[num + 1], data[num + 2], data[num + 3]]
}

export function getRedChannelNum(cols, coordX, coordY) {
  return parseInt(coordX * 4 + coordY * cols * 4)
}
