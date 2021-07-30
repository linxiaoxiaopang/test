import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import { file } from 'jszip/lib/object'

export default {
  install: Vue => {
    const requireComponent = require.context(
      // 其组件目录的相对路径
      '../components/base',
      // 是否查询其子目录
      true,
      // 匹配基础组件文件名的正则表达式
      // /Base[A-Z]\w+\.(vue|js)$/
      /\w+\.(vue|js)$/
    )
    requireComponent.keys().forEach(fileName => {
      // 获取组件配置
      const componentConfig = requireComponent(fileName)
      //多层级
      if (fileName.split('/').length > 2 && !/index\.vue$/.test(fileName))
        return
      fileName = /^(\.\/\w+)/.exec(fileName)[1]
      // 获取组件的 PascalCase 命名
      const componentName = upperFirst(
        camelCase(
          // 获取和目录深度无关的文件名
          fileName
            .split('/')
            .pop()
            .replace(/\.\w+$/, '')
        )
      )

      Vue.component(
        componentName,
        // 如果这个组件选项是通过 `export default` 导出的，
        // 那么就会优先使用 `.default`，
        // 否则回退到使用模块的根。
        resolve => {
          resolve(componentConfig.default || componentConfig)
        }
      )
    })
  }
}
