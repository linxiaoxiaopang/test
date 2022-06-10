// const { upperFirst } = require("lodash");
export  *  from './classUtil'
export  *  from './proxyUtils'

import { upperFirst } from "lodash";
export function exportsDirComponents(cb) {
  const modulesFiles = cb();
  const tmpObj = {};
  modulesFiles.keys().map((fileName) => {
    const component = modulesFiles(fileName);
    const componentName = fileName.replace(/^\.\/(\w+)\/?\w*\.(vue)$/, "$1");
    tmpObj[upperFirst(componentName)] = component.default || component;
  });
  return tmpObj;
}

export default {
  a: 100,
};


export const a = 1000