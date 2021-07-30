export const PICSIZE = {
  min: '?x-oss-process=image/format,webp/resize,l_80,h_80',
  small: '?x-oss-process=image/format,webp/resize,l_150,h_150',
  mid: '?x-oss-process=image/format,webp/resize,l_350,h_350',
  large: '?x-oss-process=image/format,webp/resize,l_750,h_750'
}
export const DESIGN_SHOW_LONG_NUM = 1000

export const COMPRESS_MAX_LONG_STR = `?x-oss-process=image/resize,l_${DESIGN_SHOW_LONG_NUM},limit_0`

export const COMPRESS_ORIGIN_MAX_LONG_STR = `?x-oss-process=image/resize,l_${2000},limit_0/format,webp`

export const PICBIGSIZE = 3 * 1024 * 1024

//压缩图片最大宽度
export const COMPRESS_MAX_NUM = 800
