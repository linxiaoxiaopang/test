//获取坐标效果图

export function getPrimShowImgs(data) {
  try {
    return data.map(({ prim_show_groups }) => {
      prim_show_groups = Array.isArray(prim_show_groups) ? prim_show_groups : []
      if(!prim_show_groups.length) {
        return false
      }
      const {prim_show_img = []} = prim_show_groups[0] || {}
      console.log('prim_show_img', prim_show_img)
      return prim_show_img || []
    })
  } catch (err) {
    return false
  }
}

export function formDataAppendArray(formData, data, key) {
  for (let i = 0; i < data.length; i++) {
    const val = data[i]
    if (Array.isArray(val)) {
      for (let j = 0; j < val.length; j++) {
        const sVal = val[j]
        formData.append(key, sVal)
      }
    } else {
      formData.append(key, val)
    }
  }
}

export function formatPutOnAndOffData(data) {
  return data.map((item) => {
    const { id, prim_struct, name, detail, sizes } = item
    prim_struct.map((struct) => (struct.status = false))
    sizes.map((size) => (size.status = false))
    return {
      prim_struct,
      name,
      detail,
      sizes,
      status: false,
      id,
      message: {
        status: true,
        text: ''
      }
    }
  })
}
