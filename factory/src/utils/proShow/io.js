/* eslint-disable */
import root from './chess-coord_6_1000_0_2.json'
import cloneDeep from 'lodash/cloneDeep'

export function initJsonData(upMaps, downMaps, modelPts, showMap, root = root) {
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
    const fx = root['Au'][i][0]
    tmapU.id1 = fx
    fx = root['Au'][i][1]
    tmapU.id2 = fx

    fx = root['Au'][i][2]
    tmapU.id3 = fx
    tmapU['A'] = []
    for (let j = 0; j < 6; j++) {
      fx = root['Au'][i][3 + j]
      tmapU['A'][j] = fx
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
