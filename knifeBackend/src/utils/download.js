/* eslint-disable */
export function downloadByPath(paths) {
  thunderLink.newTask({
    downloadDir: '', // 指定当前任务的下载目录，迅雷会在用户剩余空间最大的磁盘根目录中创建这个目录。若不填此项，会下载到用户默认下载目录
    tasks: paths.map((path) => {
      return { url: path }
    })
  })
}

export function initCallBack() {
  this.$nextTick(() => {
    thunderLink()
  })
}
