import XLSX from 'xlsx'

function createWs(data, option) {
  var cols = []

  var arr = data.map(row => option.map(column => row[column.prop]))
  arr.unshift([])

  option.forEach(column => {
    // 表格标题 第一行
    arr[0].push(column.label)

    cols.push({
      ...column
    })
  })
  var ws = XLSX.utils.aoa_to_sheet(arr)
  ws['!cols'] = cols
  ws['!rows'] = [{ hpx: 30 }]

  return ws
}

function sheet2blob(sheet, sheetName) {
  sheetName = sheetName || 'sheet1'
  var workbook = {
    SheetNames: [sheetName],
    Sheets: {}
  }
  workbook.Sheets[sheetName] = sheet
  // 生成excel的配置项
  var wopts = {
    bookType: 'xlsx', // 要生成的文件类型
    bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    type: 'binary'
  }
  var wbout = XLSX.write(workbook, wopts)
  var blob = new Blob([s2ab(wbout)], {type:'application/octet-stream'})
  // 字符串转ArrayBuffer
  function s2ab(s) {
    var buf = new ArrayBuffer(s.length)
    var view = new Uint8Array(buf)
    for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
    return buf
  }
  return blob
}

function openDownloadXLSXDialog(url, saveName){
  if(typeof url == 'object' && url instanceof Blob){
    url = URL.createObjectURL(url) // 创建blob地址
  }
  var aLink = document.createElement('a')
  aLink.href = url
  aLink.download = saveName || '' // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
  var event
  if(window.MouseEvent) event = new MouseEvent('click')
  else{
    event = document.createEvent('MouseEvents')
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
  }
  aLink.dispatchEvent(event)
}

export function createExcel(data, option, sheetName = '表格') {
  var ws = createWs(data, option)
  var blob = sheet2blob(ws, sheetName)
  openDownloadXLSXDialog(blob, `${sheetName}.xlsx`)
}