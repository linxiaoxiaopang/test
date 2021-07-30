// show_image,
// eff_image,
// front_image,
// show_image_mapxy,
// kl_image
// const DESIGN_SHOW_LONG_NUM = 1000

//格式化showImageMapxy
export function initShowImageMapxy(info) {
  let { show_img: show_image, showMarks } = info
  const show_img_rows = parseInt(show_image.rows)
  const show_img_cols = parseInt(show_image.cols)

  // const scale = DESIGN_SHOW_LONG_NUM / Math.max(show_image.naturalWidth, show_image.naturalHeight)
  const scale = 1
  const scale_show_rows = show_img_rows
  const scale_show_cols = show_img_cols

  //   const show_map_mapxy = new ArrayBuffer(2 * scale_show_rows * scale_show_cols)

  //history
  // const show_map_mapxy = new Float32Array(2 * scale_show_rows * scale_show_cols)
  //diff
  const show_map_mapxy = new Float32Array(3 * scale_show_rows * scale_show_cols)

  //history
  // for (let i = 0; i < 2 * scale_show_cols * scale_show_rows; i++) {
  //   show_map_mapxy[i] = -1.0
  // }

  for (let i = 0; i < 3 * scale_show_cols * scale_show_rows; ++i) {
    show_map_mapxy[i] = -1.0
  }

  showMarks.map((mItem) => {
    const { root, show_mask } = mItem
    calcPartOfShowImageMapxy(root, show_map_mapxy, scale_show_rows, scale_show_cols, scale, fillColsAndRows(show_mask))
  })
  return show_map_mapxy
}

function calcPartOfShowImageMapxy(
  root,
  show_map_mapxy,
  scale_show_rows,
  scale_show_cols,
  scale,
  show_mask //json对应图图
) {
  const { upMaps, downMaps, modelPts, showMap } = initJsonData(root)
  runCalcShowImageMap(
    show_map_mapxy,
    scale_show_cols,
    scale_show_rows,
    show_mask,
    showMap,
    upMaps,
    downMaps,
    modelPts,
    scale
  )
  return true
}

onerror = function (e) {
  console.log(['ERROR: Line ', e.lineno, ' in ', e.filename, ': ', e.message].join(''))
}

function fillColsAndRows(data) {
  if (!data) return {}
  if (!data.cols && data.width) {
    data.cols = data.width
  }
  if (!data.rows && data.height) {
    data.rows = data.height
  }
  return data
}

function initJsonData(root) {
  const upMaps = []
  const downMaps = []
  const modelPts = []
  const showMap = []
  try {
    // upMaps.length = 0;
    // downMaps.length = 0;
    // modelPts.length = 0;
    const au_size = root['Au'].length
    const ad_size = root['Ad'].length

    showMap.show_mask_height = root['show_mask_height']
    showMap.show_mask_left = root['show_mask_left']
    showMap.show_mask_top = root['show_mask_top']
    showMap.show_mask_width = root['show_mask_width']

    for (let i = 0; i < au_size; ++i) {
      const tmapU = {}
      tmapU.id1 = root['Au'][i][0]
      tmapU.id2 = root['Au'][i][1]

      tmapU.id3 = root['Au'][i][2]
      tmapU['A'] = []
      for (let j = 0; j < 6; j++) {
        tmapU['A'][j] = root['Au'][i][3 + j]
      }
      upMaps.push(tmapU)

      // Ad 数据解析
      const tmapD = {}
      try {
        tmapD.id1 = root['Ad'][i][0]
      } catch (err) { }

      tmapD.id2 = root['Ad'][i][1]

      tmapD.id3 = root['Ad'][i][2]
      tmapD['A'] = []
      for (let j = 0; j < 6; ++j) {
        tmapD['A'][j] = root['Ad'][i][3 + j]
      }
      downMaps.push(tmapD)
    }
    let model_size = root['model_corners'].length
    for (let i = 0; i < model_size; ++i) {
      const tmp = {}
      tmp.x = root['model_corners'][i][0]
      tmp.y = root['model_corners'][i][1]
      modelPts.push(tmp)
    }
  } catch (err) { }
  return {
    upMaps,
    downMaps,
    modelPts,
    showMap
  }
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
    return channels[0] != 0 && channels[1] && channels[2] != 0 && channels[3] != 0
  } catch (err) {
    return false
  }
}

function maskAlphaValue(front_mask, x, y) {
  if (!front_mask) return -1
  if (x < 0 || y < 0) return -1

  if (x >= front_mask.cols || y >= front_mask.rows) return -1

  const channels = getPixelByCoord(front_mask, x, y)
  const nChannel = channels.length
  if (!(nChannel == 4 || nChannel == 1)) return -1

  if (nChannel == 4) {
    return front_mask.data[4 * y * front_mask.cols + 4 * x + 3]
  } else if (nChannel == 1) {
    return front_mask.data[y * front_mask.cols + x]
  }

  return -1
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

//新增
function calcShowImageMap(
  show_image_mapxy,
  show_image_width,
  show_image_height,
  show_mask,
  show_pos,
  tmap,
  modelPts,
  scale
) {
  if (!show_image_mapxy || !show_mask) return false
  if (show_image_height < 0 || show_image_width < 0) return false
  if (!modelPts) return false
  const w = parseInt(show_image_width / scale)
  const h = parseInt(show_image_height / scale)
  const { id1, id2, id3 } = tmap
  if (id1 < 0 || id1 >= modelPts.length) return false
  if (id2 < 0 || id2 >= modelPts.length) return false
  if (id3 < 0 || id3 >= modelPts.length) return false
  const pt1 = modelPts[id1]
  const pt2 = modelPts[id2]
  const pt3 = modelPts[id3]

  let x1 = pt1.x
  let y1 = pt1.y
  let x2 = pt2.x
  let y2 = pt2.y
  let x3 = pt3.x
  let y3 = pt3.y

  const rect = {}
  calcTriRect(rect, pt1, pt2, pt3)
  let a, b, c
  const c1 = (y1 - y2) * x3 + (x2 - x1) * y3 + x1 * y2 - x2 * y1
  const b1 = (y1 - y3) * x2 + (x3 - x1) * y2 + x1 * y3 - x3 * y1
  for (let y = rect.top; y < rect.top + rect.height; ++y) {
    if (y < 0 || y >= h) continue

    for (let x = rect.left; x < rect.left + rect.width; x++) {
      if (x < 0 || x >= w) continue

      //history
      // const has_v = hasMaskFlag(show_mask, x - show_pos.show_mask_left, y - show_pos.show_mask_top)
      // if (!has_v) continue

      //diff
      const show_mask_v = maskAlphaValue(show_mask, x - show_pos.show_mask_left, y - show_pos.show_mask_top)
      if (show_mask_v <= 0) continue

      c = ((y1 - y2) * x + (x2 - x1) * y + x1 * y2 - x2 * y1) / c1
      b = ((y1 - y3) * x + (x3 - x1) * y + x1 * y3 - x3 * y1) / b1
      a = 1 - b - c
      if (a >= -1e-5 && a <= 1 && b >= -1e-5 && b <= 1 && c >= -1e-5 && c <= 1) {
        const coord_pt = {}
        const show_pt = {}
        show_pt.x = x
        show_pt.y = y
        calcMapPoint(coord_pt, tmap.A, show_pt)

        if (coord_pt.x < 0 || coord_pt.y < 0) continue

        const scale_img_x = parseInt(scale * x)
        const scale_img_y = parseInt(scale * y)
        //history
        // show_image_mapxy[2 * scale_img_y * show_image_width + 2 * scale_img_x + 0] = coord_pt.x
        // show_image_mapxy[2 * scale_img_y * show_image_width + 2 * scale_img_x + 1] = coord_pt.y
        //diff
        if (show_image_mapxy[3 * scale_img_y * show_image_width + 3 * scale_img_x + 2] * 255.0 < show_mask_v) {
          show_image_mapxy[3 * scale_img_y * show_image_width + 3 * scale_img_x + 0] = coord_pt.x
          show_image_mapxy[3 * scale_img_y * show_image_width + 3 * scale_img_x + 1] = coord_pt.y
          show_image_mapxy[3 * scale_img_y * show_image_width + 3 * scale_img_x + 2] = show_mask_v / 255.0
        }
      }
    }
  }

  return true
}

//新增
function runCalcShowImageMap(
  show_image_mapxy,
  show_image_width,
  show_image_height,
  show_mask,
  show_pos,
  upMaps,
  downMaps,
  modelPts,
  scale
) {
  if (!show_image_mapxy || !show_mask) return false
  if (!upMaps || !downMaps || !modelPts) return false
  if (upMaps.length != downMaps.length) return false
  if (show_image_height < 0 || show_image_width < 0) return false

  for (let i = 0; i < upMaps.length; i++) {
    calcShowImageMap(
      show_image_mapxy,
      show_image_width,
      show_image_height,
      show_mask,
      show_pos,
      upMaps[i],
      modelPts,
      scale
    )
  }

  for (let i = 0; i < downMaps.length; i++) {
    calcShowImageMap(
      show_image_mapxy,
      show_image_width,
      show_image_height,
      show_mask,
      show_pos,
      downMaps[i],
      modelPts,
      scale
    )
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
