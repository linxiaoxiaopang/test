// const { upperFirst } = require("lodash");
// function exportsDirComponents(cb) {
//   const reg = /^\.\/\w+\/?\w+\.(vue)$/;
//   console.log("reg", reg.toString());
//   const modulesFiles = cb();
//   // const modulesFiles = require.context('./', true, reg);
//   const tmpObj = {};
//   modulesFiles.keys().map((fileName) => {
//     const component = modulesFiles(fileName);
//     const componentName = fileName.replace(/^\.\/(\w+)\/?\w*\.(vue)$/, "$1");
//     tmpObj[upperFirst(componentName)] = component.default || component;
//   });
//   return tmpObj;
// }

const { exportsDirComponents } = require("@/utils");

module.exports = exportsDirComponents(() =>
  require.context("./", true, /^\.\/\w+\/?\w+\.(vue)$/)
);
