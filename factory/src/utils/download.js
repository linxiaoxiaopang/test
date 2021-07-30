/* eslint-disable */
export function downloadByPath(paths) {
  /*const alinks = [];
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const aLink = document.createElement("a");
    aLink.className = "thunder-link";
    aLink.setAttribute("href", path);
    document.body.append(aLink);
    alinks.push(aLink);
    setTimeout(() => {
      aLink.click();
    }, 50 * i + 1);
  }

  this.$nextTick(() => {
    thunderLink();

    this.$nextTick(() => {
      alinks.map((aLink, i) => {
        setTimeout(() => {
          document.body.removeChild(aLink);
        }, 50 * i + 1);
      });
    });
  });*/

  thunderLink.newTask({
    downloadDir: '', // 指定当前任务的下载目录，迅雷会在用户剩余空间最大的磁盘根目录中创建这个目录。若不填此项，会下载到用户默认下载目录
    tasks: paths.map(path => { return {url: path} })
  })
}

export function initCallBack() {
  this.$nextTick(() => {
    thunderLink()
  })
}