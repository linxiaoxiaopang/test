export const TAB_UPLOAD_IMG_ID = 2
export const TAB_SHAME_IMMG_ID = 3
export const TAB_FONT_ADD_ID = 5
export const TAB_COMPONENT_NAMES = [
  {
    id: 1,
    name: 'Collection',
    info: {}
  },
  {
    id: 2,
    name: 'UploadDesignPic',
    info: {}
  },
  {
    id: TAB_SHAME_IMMG_ID,
    name: 'SharedPicLibrary',
    info: {}
  },
  {
    id: 4,
    name: 'DesignBgColor',
    info: {}
  },
  {
    id: TAB_FONT_ADD_ID,
    name: 'FontSetting',
    info: {}
  }
]

export const FONT_INIT_FORM = {
  fontSize: '20',
  fill: '#000000'
}

export const FONST_FAMILY_LIST = [
  {
    value: 'Academic M54',
    label: 'Academic M54'
  },
  {
    value: 'aguzlo',
    label: 'aguzlo'
  },
  {
    value: 'BrushScriptStd',
    label: 'BrushScriptStd'
  },
  {
    value: 'chiller',
    label: 'chiller'
  },
  {
    value: 'Clarendon Condensed',
    label: 'Clarendon Condensed'
  },
  {
    value: 'EccentricStd',
    label: 'EccentricStd'
  },
  {
    value: 'forte',
    label: 'forte'
  },
  {
    value: 'varsity',
    label: 'varsity'
  },
  {
    value: 'FZHei-B01S',
    label: 'FZHei-B01S'
  },
  {
    value: 'Butter',
    label: 'Butter'
  },
  {
    value: 'Happy',
    label: 'Happy'
  },
  {
    value: 'HightHei',
    label: 'HightHei'
  },
  {
    value: 'Seaside',
    label: 'Seaside'
  },
  {
    value: 'Spaghettica',
    label: 'Spaghettica'
  },
  {
    value: 'FridayNight',
    label: 'FridayNight'
  },
  {
    value: 'Vermin',
    label: 'Vermin'
  },
  {
    value: 'Comeback',
    label: 'Comeback'
  },
  {
    value: 'Distort',
    label: 'Distort'
  },
  {
    value: 'Digital',
    label: 'Digital'
  },
  {
    value: 'Agra',
    label: 'Agra'
  }
]

export const FONST_SIZE_LIST = [
  {
    value: '12',
    label: '12'
  },
  {
    value: '14',
    label: '14'
  },
  {
    value: '16',
    label: '16'
  },
  {
    value: '18',
    label: '18'
  },
  {
    value: '20',
    label: '20'
  },
  {
    value: '22',
    label: '22'
  },
  {
    value: '30',
    label: '30'
  }
]

export function findComponentNamsIndex(fId) {
  return TAB_COMPONENT_NAMES.findIndex(({ id }) => id == fId).toString()
}
