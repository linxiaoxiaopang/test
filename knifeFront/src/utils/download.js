import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { getURLBase64, createRandomNum } from '@/utils'

export function downloadByPath(paths, name) {
  thunderLink.newTask({
    downloadDir: '', // 指定当前任务的下载目录，迅雷会在用户剩余空间最大的磁盘根目录中创建这个目录。若不填此项，会下载到用户默认下载目录
    tasks: paths.map((path, index) => {
      if (Array.isArray(name)) {
        return {
          name: name[index],
          url: path
        }
      }
      return {
        name,
        url: path
      }
    })
  })
}

export async function downloadByZip(paths, folderName) {
  if (!folderName) {
    folderName = createFolderPic()
  }
  var zip = new JSZip()
  var folder = zip.folder(folderName)
  console.log(paths)
  const p = paths.map(async (image, index) => {
    const imgUrl = image.url
    const name = image.name
    return await getURLBase64(imgUrl + '?uid' + createRandomNum()).then(
      (img) => {
        const file = imgUrl.split('/')
        const fileName = file[file.length - 1]
        const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1)
        folder.file(
          `${name}.${fileExtension}`,
          img.replace('data:image/png;base64,', ''),
          {
            base64: true
          }
        )
      }
    )
  })
  await Promise.all(p)
  zip.generateAsync({ type: 'blob' }).then(function (content) {
    // see FileSaver.js
    saveAs(content, folderName)
  })
}

//产生随机图片名称
function createFolderPic() {
  var now = new Date()
  var year = now.getFullYear() //得到年份
  var month = now.getMonth() //得到月份
  var date = now.getDate() //得到日期
  var hour = now.getHours() //得到小时
  var minu = now.getMinutes() //得到分钟
  month = month + 1
  if (month < 10) month = '0' + month
  if (date < 10) date = '0' + date
  var number = now.getSeconds() % 43 //这将产生一个基于目前时间的0到42的整数。
  var time = year + month + date + hour + minu
  return time + '_' + number
}

export function initCallBack() {
  this.$nextTick(() => {
    thunderLink()
  })
}
