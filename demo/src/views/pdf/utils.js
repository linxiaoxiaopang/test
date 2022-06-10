import { jsPDF } from "jspdf";
import axios from "axios";
import { isArray, isString } from "lodash";
import { Loading } from "element-ui";
/**
 * @description: 文件转换成二进制字符串
 * @param {String} url
 * @param {Object} config  axios配置项
 * @return {Promise}
 */
export function getBinaryString(url, config = {}) {
  config.fileReaderFuncName = "readAsBinaryString";
  return analysisFileByAxios(url, config);
}

/**
 * @description: 通过url，解析转化文件
 * @param {String} url
 * @param {Object} config 配置项
 * config.fileReaderFuncName fileReader 名称 默认 readAsDataURL
 * config.responseType responseType axios返回的数据类型 默认blob
 * ...restConfig 其他配置项
 * @return {Promise}
 */
export function analysisFileByAxios(url, config = {}) {
  if (!config.responseType) {
    config.responseType = "blob";
  }
  //fileReader 的方法
  if (!config.fileReaderFuncName) {
    config.fileReaderFuncName = "readAsDataURL";
  }
  const { fileReaderFuncName, ...restConfig } = config;
  return axios
    .get(url, {
      ...restConfig,
    })
    .then((res) => {
      const { status, data } = res || {};
      if (status >= 200 && status < 300) {
        const fileReader = new FileReader();
        const p = new Promise((resolve) => {
          fileReader.onloadend = function (e) {
            resolve(e.target.result);
          };
        });
        fileReader[fileReaderFuncName](data);
        return p;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

// Size in pt of various paper formats
export const PT_PAPER_FORMATS = {
  a0: [2383.94, 3370.39],
  a1: [1683.78, 2383.94],
  a2: [1190.55, 1683.78],
  a3: [841.89, 1190.55],
  a4: [595.28, 841.89],
  a5: [419.53, 595.28],
  a6: [297.64, 419.53],
  a7: [209.76, 297.64],
  a8: [147.4, 209.76],
  a9: [104.88, 147.4],
  a10: [73.7, 104.88],
  b0: [2834.65, 4008.19],
  b1: [2004.09, 2834.65],
  b2: [1417.32, 2004.09],
  b3: [1000.63, 1417.32],
  b4: [708.66, 1000.63],
  b5: [498.9, 708.66],
  b6: [354.33, 498.9],
  b7: [249.45, 354.33],
  b8: [175.75, 249.45],
  b9: [124.72, 175.75],
  b10: [87.87, 124.72],
  c0: [2599.37, 3676.54],
  c1: [1836.85, 2599.37],
  c2: [1298.27, 1836.85],
  c3: [918.43, 1298.27],
  c4: [649.13, 918.43],
  c5: [459.21, 649.13],
  c6: [323.15, 459.21],
  c7: [229.61, 323.15],
  c8: [161.57, 229.61],
  c9: [113.39, 161.57],
  c10: [79.37, 113.39],
  dl: [311.81, 623.62],
  letter: [612, 792],
  "government-letter": [576, 756],
  legal: [612, 1008],
  "junior-legal": [576, 360],
  ledger: [1224, 792],
  tabloid: [792, 1224],
  "credit-card": [153, 243],
};

/**
 * @description: 根据dom获取pdf
 * @param {*} dom
 * @param {*} name
 * @return {*}
 */
export async function getPdfUrlByDom(dom, name, option = {}) {
  try {
    const doc = await getJsPdfDoc(dom, name, option);
    const bloburl = doc.output("bloburl");
    return bloburl;
  } catch (err) {
    console.log("err", err);
  }
}

/**
 * @description: 创建一个jspdf实例
 * @param {*} dom
 * @param {*} name
 * @return {*}
 */
async function getJsPdfDoc(dom, name, option = {}) {
  console.log("dom", dom);

  const { ceil } = Math;
  if (!dom) {
    throw Error("请输入dom元素");
  }
  if (!name) {
    throw Error("请输入名称");
  }
  const defaultOption = {
    orientation: "p",
    unit: "pt",
    format: "a4", //a4纸张尺寸
  };
  option = Object.assign({}, defaultOption, option);

  const { format } = option;
  const w = Math.max(dom.clientWidth, dom.scrollWidth, dom.offsetWidth);
  const h = Math.max(dom.clientHeight, dom.scrollHeight, dom.offsetHeight);
  let [wPt, hPt] = PT_PAPER_FORMATS.a5;
  if (isArray(format)) {
    wPt = format[0];
    hPt = format[1];
  }
  if (isString(format) && PT_PAPER_FORMATS[format]) {
    wPt = PT_PAPER_FORMATS[format][0];
    hPt = PT_PAPER_FORMATS[format][1];
  }
  wPt = (w / 96) * 72;
  hPt = (h / 2 / 96) * 72;
  option.format = [wPt, hPt]
  //宽大于长
  if (hPt < wPt) {
    option.orientation = "l";
  }
  const doc = new jsPDF(option);
  console.log("API", jsPDF.API.events);
  const myFont = await getBinaryString("/fonts/simhei.ttf");
  doc.addFileToVFS("simhei.ttf", myFont);
  doc.addFont("simhei.ttf", "simhei", "normal");
  doc.setFont("simhei");
  const scale = wPt / w;
  const scaleH = hPt / scale;
  const pageNum = ceil(h / scaleH);

  console.log("w, h", w, h);
  console.log("hPt, wPt", wPt / scale, hPt / scale);
  console.log("scale", scale);
  // const h = Math.max(dom.clientHeight, dom.scrollHeight, dom.offsetHeight)

  //一页pdf显示html页面生成的canvas高度;
  //未生成pdf的html页面高度

  return await new Promise((resolve, reject) => {
    try {
      doc.html(dom, {
        html2canvas: {
          allowTaint: true,
          useCORS: true,
          scale,
          x: 0,
          y: 0,
          //   width: 72,
        },
        callback: (doc1) => {
          //pdf页面数量
          const docPageNum = doc.internal.getNumberOfPages();
          //所有页面大于应该生成的页码
          if (docPageNum > pageNum) {
            //删除最后的空白页面
            doc.deletePage(docPageNum);
          }
          // console.log('doc', doc)
          // console.log('doc', doc.context2d)
          // console.log('doc', doc.API)
          // console.log('doc', doc.getPageHeight())
          // console.log('doc', doc.getPageWidth())
          // doc.setPage(0)
          // console.log('doc', doc.text(10, 10, 'hello world'))
          resolve(doc1);
        },
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}

/**
 * @description: 创建打印的后掉列表
 * @param {Object} printData
 * @param {Function} callback 关闭打印发射事件
 * @return {Object} 回调列表
 */
export function createPrintCallbackParams(
  printData,
  startCallback,
  afterCallback
) {
  const { documentTitle, name = "" } = printData;
  let loadingInstance = null;
  let historyDocumentTitle = null;
  const defaultPrintData = {
    documentTitle,
    name,
    type: "pdf",
    scanStyles: false,
    onLoadingStart: () => {
      loadingInstance = Loading.service({
        lock: true,
        text: `生成${documentTitle}中`,
      });
      startCallback && startCallback();
      //存储历史的网页标题
      //通过更改网页标题来更改保存时打印标题文件的标题
      historyDocumentTitle = document.title;
      document.title = name;
    },
    onLoadingEnd: () => {
      loadingInstance.close();
    },
    onError: (err) => {
      loadingInstance.close();
    },
    onPrintDialogClose: () => {
      //发射关闭打印事件
      afterCallback && afterCallback();
      loadingInstance.close();
      document.title = historyDocumentTitle;
    },
  };
  return {
    ...defaultPrintData,
    ...printData,
    documentTitle,
    name,
  };
}

//打印时候加载所有图片
export function loadAllImages(images) {
  const promises = Array.from(images).map((image) => {
    if (image.src && image.src !== window.location.href) {
      return loadImage(image);
    }
  });
  return Promise.all(promises);
}

export function loadImage(image) {
  return new Promise((resolve) => {
    const pollImage = () => {
      !image ||
      typeof image.naturalWidth === "undefined" ||
      image.naturalWidth === 0 ||
      !image.complete
        ? setTimeout(pollImage, 500)
        : resolve();
    };
    pollImage();
  });
}
