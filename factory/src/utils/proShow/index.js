import { goCalcShowImage } from './calc_show_new'

export function initJsonData(upMaps, downMaps, modelPts, showMap, root) {
  upMaps.length = 0
  downMaps.length = 0
  modelPts.length = 0
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
    tmapD.id1 = root['Ad'][i][0]

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
}


export async function runCalcShowImage(...rest) {
  var t0 = performance.now()
  const [upMaps, downMaps, modelPts, showMap, root, front_design_path, show_path, show_mask_path ] = rest
  initJsonData(upMaps, downMaps, modelPts, showMap, root)
  const kl_mask = {
    left: 20,
    top: 45,
    width: 1708,
    height: 1563
  }
  const front_design = await getImgData(front_design_path)
  const show_img = await getImgData(show_path)
  const show_mask = await getImgData(show_mask_path)
  const base64Url = goCalcShowImage(
    show_img,
    show_mask,
    front_design,
    kl_mask,
    showMap,
    upMaps,
    downMaps,
    modelPts
  )
  var t1 = performance.now()
  console.log('Call to doSomething took ' + (t1 - t0) + ' milliseconds.')
  return base64Url
}

export function getImgData(src) {
  const img = new Image()
  const c = document.createElement('canvas')
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
      resolve(imgData)
    }
    img.src = src
  })
}