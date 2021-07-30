import { initJsonData } from './io'
import { goCalcShowImage } from './calc_show_new'

let upMaps = []
let downMaps = []
let modelPts = []
let showMap = {}
initJsonData(upMaps, downMaps, modelPts, showMap)
const front_design_path = require('./4_1708_1563.jpg')
const show_path = require('./6_1000.jpg')
const show_mask_path = require('./chess-coord_6_1000_0_2.png')

async function runCalcShowImage(
  front_design_path = front_design_path,
  show_path = show_path,
  show_mask_path = show_mask_path
) {
  var t0 = performance.now()
  const kl_mask = {
    left: 20,
    top: 45,
    width: 1708,
    height: 1563
  }
  const front_design = await getImgData(front_design_path)
  const show_img = await getImgData(show_path)
  const show_mask = await getImgData(show_mask_path)
  goCalcShowImage(
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
}

runCalcShowImage()

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

export function imageDataBe2Array({ data, width, height }) {
  const tmpArr = []
  let num = -1
  for (let j = 0; j < height; j++) {
    tmpArr.push([])
    num++
    for (let i = 0; i < width * 4; i += 4) {
      const index = j * width * 4 + i
      tmpArr[num].push([
        data[index],
        data[index + 1],
        data[index + 2],
        data[index + 3]
      ])
    }
  }
  return {
    data: tmpArr,
    cols: width,
    rows: height
  }
}

export function getPointByCoord({ data, coordX, coordY, cols, rows }) {
  const num = coordX * 4 + coordY * cols * 4
  return [data[num], data[num + 1], data[num + 2], data[num + 3]]
}

export function twoArrayBeimageData({ data, rows, cols }) {
  const tmpArr = []
  data.map((item) => {
    item.map((sItem) => {
      sItem.map((point) => {
        tmpArr.push(point)
      })
    })
  })
  //   let unit8TmpArr = new Uint8ClampedArray(tmpArr);
  return {
    data: tmpArr,
    width: cols,
    height: rows
  }
}
