require('dotenv').config({ path: `.env.${process.env.ENV_STAGE}` })
const path = require('path')
const ENV = process.env.NODE_ENV

const CONFIG = {
  TITLE: '正丁云商工厂管理系统',
  DEVSERVER:
    process.env.ENV_STAGE === 'serve'
      ? {
        //端口号
        port: 8081,
        proxy: {
          '/order': {
            target: 'http://192.168.10.100:1101/', //代理地址，这里设置的地址会代替axios中设置的baseURL
            changeOrigin: true // 如果接口跨域，需要进行这个参数配置
          },
          '/system': {
            target: 'http://192.168.10.100:1101/', //代理地址，这里设置的地址会代替axios中设置的baseURL
            changeOrigin: true // 如果接口跨域，需要进行这个参数配置
          },
          '/': {
            target: process.env.VUE_APP_BASE_URL,
            changeOrigin: true
          }
        }
      }
      : {}
}

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = {
  lintOnSave: false,
  publicPath: './',
  outputDir: 'dist',
  productionSourceMap: false,
  configureWebpack: (config) => {
    //生产环境去除log
    if (ENV === 'production') {
      const compress = config.optimization.minimizer[0].options.terserOptions.compress
      compress.warnings = false
      compress.drop_console = true
      compress.drop_debugger = true
      compress.pure_funcs = ['console.log']
    }
  },
  devServer: CONFIG.DEVSERVER,

  chainWebpack: (config) => {
    config.module.rule('svg').exclude.add(resolve('src/icons')).end()

    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })

    config.plugin('html').tap((args) => {
      args[0].title = CONFIG.TITLE
      return args
    })
  },
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.scss` 这个文件
        additionalData: `
            @import "~@/styles/index.scss";
        `
      }
    }
  }
}
