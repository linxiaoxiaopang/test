export function worker(
  kl_mask,
  upMaps,
  downMaps,
  modelPts,
  showMap,
  root,
  front_design,
  show_img,
  shadow_img,
  show_mask
) {
  const img = runCalcShowImage(
    kl_mask,
    upMaps,
    downMaps,
    modelPts,
    showMap,
    root,
    front_design,
    show_img,
    shadow_img,
    show_mask
  )
  console.log('img', img)
  console.log(3)
  return img
  function runCalcShowImage(
    kl_mask,
    upMaps,
    downMaps,
    modelPts,
    showMap,
    root,
    front_design,
    show_img,
    shadow_img,
    show_mask
  ) {
    show_img.rows = show_img.width
    show_img.cols = show_img.height
    initJsonData(upMaps, downMaps, modelPts, showMap, root)
    const i =  goCalcShowImage(
      show_img,
      shadow_img,
      show_mask,
      front_design,
      kl_mask,
      showMap,
      upMaps,
      downMaps,
      modelPts
    )
    console.log('i', i)
    return i
  }

  function initJsonData(upMaps, downMaps, modelPts, showMap, root) {
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
        } catch (err) {}

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
      return true
    } catch (err) {}
  }

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

  function calcShowImage(
    show_image,
    eff_image,
    show_mask,
    front_image,
    kl_image,
    show_pos,
    tmap,
    modelPts
  ) {
    if (!show_image || !eff_image || !show_mask || !front_image) return false
    if (show_image.cols != eff_image.cols || show_image.rows != eff_image.rows)
      return false
    if (!modelPts) return false
    const w = parseInt(show_image.cols)
    const h = parseInt(show_image.rows)

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
    const rect = {}
    calcTriRect(rect, pt1, pt2, pt3)

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

        // x坐标是否在图像有效区域
        if (x < 0 || x >= show_image.cols) continue
        // console.log(6)
        // 对应的mask是否有值
        const has_v = hasMaskFlag(
          show_mask,
          x - show_pos.show_mask_left,
          y - show_pos.show_mask_top
        )

        if (!has_v) continue
        // console.log('6666')
        // 计算是否在三角形上或者内部
        c = ((y1 - y2) * x + (x2 - x1) * y + x1 * y2 - x2 * y1) / c1
        b = ((y1 - y3) * x + (x3 - x1) * y + x1 * y3 - x3 * y1) / b1
        a = 1 - b - c
        if (a >= 0 && a <= 1 && b >= 0 && b <= 1 && c >= 0 && c <= 1) {
          const coord_pt = {}
          const show_pt = {}
          show_pt.x = x
          show_pt.y = y
          calcMapPoint(coord_pt, tmap.A, show_pt)
          // 坐标图的坐标在 设计模上的坐标
          const kl_x = coord_pt.x - kl_image.left
          const kl_y = coord_pt.y - kl_image.top

          // 计算反向插值像素
          // front_image 是前端已经设计好的图片，与模大小一致
          const color = []
          const res = calc_img_cell_pixel(color, front_image, kl_x, kl_y)
          if (res == -1) continue

          const alpha = parseFloat(
            eff_image.data[getRedChannelNum(eff_image.cols, x, y) + 3] / 255.0
          )
          const redChannelNum = getRedChannelNum(show_image.cols, x, y)
          //   show_image.data[redChannelNum] =
          //     eff_image.data[redChannelNum] * alpha + (1.0 - alpha) * color[0];
          //   show_image.data[redChannelNum + 1] =
          //     eff_image.data[redChannelNum + 1] * alpha +
          //     (1.0 - alpha) * color[1];
          //   show_image.data[redChannelNum + 2] =
          //     eff_image.data[redChannelNum + 2] * alpha +
          //     (1.0 - alpha) * color[2];

          show_image.data[redChannelNum] = 0
          show_image.data[redChannelNum + 1] = 0
          show_image.data[redChannelNum + 2] = 0
          console.log(' show_image.data[redChannelNum]',  show_image.data[redChannelNum])
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

  function goCalcShowImage(
    show_image,
    eff_image,
    show_mask,
    front_image,
    kl_image,
    show_pos,
    upMaps,
    downMaps,
    modelPts
  ) {
    if (!show_image || !eff_image || !show_mask || !front_image) return false

    if (!upMaps || !downMaps || !modelPts) return false
    if (upMaps.length != downMaps.length) return false

    if (show_image.cols != eff_image.cols || show_image.rows != eff_image.rows)
      return false
    for (let i = 0; i < upMaps.length; ++i) {
      calcShowImage(
        show_image,
        eff_image,
        show_mask,
        front_image,
        kl_image,
        show_pos,
        upMaps[i],
        modelPts
      )
    }

    for (let i = 0; i < downMaps.length; ++i) {
      calcShowImage(
        show_image,
        eff_image,
        show_mask,
        front_image,
        kl_image,
        show_pos,
        downMaps[i],
        modelPts
      )
    }
    console.log('show_image',show_image)
    console.log(1)
    return show_image
  }

  function getPixelByCoord({ data, cols }, coordX, coordY) {
    const num = parseInt(coordX * 4 + coordY * cols * 4)
    return [data[num], data[num + 1], data[num + 2], data[num + 3]]
  }

  function getRedChannelNum(cols, coordX, coordY) {
    return parseInt(coordX * 4 + coordY * cols * 4)
  }
}
