module.exports = {
  lintOnSave: false,
  chainWebpack: (config) => {
    config.module
      .rule("worker")
      .test(/\.worker\.js$/)
      .use("worker-loader")
      .loader("worker-loader")
      .options({
        filename: "[name].[contenthash].worker.js",
        publicPath: './'
      });
  },
};
