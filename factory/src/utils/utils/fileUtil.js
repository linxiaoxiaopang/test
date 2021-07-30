export function file2Base64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(null)
  })
}

export function isFile(file) {
  return file instanceof File
}

export function getFileName(path = '') {
  path = path || ''
  const pointLastIndex = path.lastIndexOf('.')
  const chaLastIndex = path.lastIndexOf('/')
  return path.slice(chaLastIndex + 1, pointLastIndex)
}

export function getFileSuffix(path = '') {
  path = path || ''
  const chaLastIndex = path.lastIndexOf('/')
  const name = path.slice(chaLastIndex + 1)
  return name.split('.')[1]
}
