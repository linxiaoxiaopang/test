module.exports = {
  lintOnSave: false,
  chainWebpack: (config) => {
    // config.set("externals", {
    //   html2canvas: "html2canvas"
    // });
    config.module
      .rule("worker")
      .test(/\.worker\.js$/)
      .use("worker-loader")
      .loader("worker-loader")
      .options({
        filename: "[name].[contenthash].worker.js",
        publicPath: "./",
      });
  },
};
