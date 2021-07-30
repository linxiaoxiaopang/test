/* eslint-disable */
import {
  findByvalue,
  getComponent,
  getSearchType,
  setDic,
  setPx,
  deepClone
} from '../utils/util.js'
import { validatenull } from '../utils/validate.js'
import crudInput from '../crud/src/crud-input'
import crudSelect from '../crud/src/crud-select'
import crudRadio from '../crud/src/crud-radio'
import crudCheckbox from '../crud/src/crud-checkbox'
import crudCascader from '../crud/src/crud-cascader'
import crudDate from '../crud/src/crud-date'
import crudTime from '../crud/src/crud-time'
import crudInputNumber from '../crud/src/crud-input-number'
import crudUeditor from '../crud/src/crud-ueditor'
import crudUpload from '../crud/src/crud-upload'

export default function () {
  return {
    data() {
      return {
        column: {},
        unwatch: {}
      }
    },
    props: {
      option: {
        type: Object,
        required: true,
        default: {}
      }
    },
    components: {
      crudInput,
      crudSelect,
      crudRadio,
      crudCheckbox,
      crudDate,
      crudTime,
      crudCascader,
      crudInputNumber,
      crudUeditor,
      crudUpload
    },
    methods: {
      GetDic: function (list) {
        return new Promise((resolve, reject) => {
          let result = []
          if (validatenull(list)) {
            return
          }
          list.forEach((ele) => {
            result.push(
              new Promise((resolve, reject) => {
                this.getDicts(ele).then(function (response) {
                  resolve(validatenull(response.data) ? [] : response.data)
                })
              })
            )
          })
          let value = {}
          Promise.all(result).then((data) => {
            list.forEach((ele, index) => {
              value[ele] = data[index]
            })
            resolve(value)
          })
        })
      },
      getDicData(ele) {
        // 处理字典
        if (validatenull(ele.dicData) || ele.dicData === ele.prop) {
          // ele.dicData为空，或者ele.dicData等于ele.prop（为了重新请求字典）
          ele.dicData = null
          if (!validatenull(ele.dicUrl)) {
            // ele.dicUrl不为空
            if (ele.dicUrl.indexOf('/admin/dict/type/') > -1) {
              // ele.dicUrl包含/admin/dict/type/时，将字典名赋值给ele.dicData
              ele.dicData = ele.dicUrl.replace('/admin/dict/type/', '')
            } else if (ele.dicUrl.indexOf('{{key}}') === -1) {
              // 非多级联动子节点
              dic.js(ele.dicUrl).then((res) => {
                ele.dicData = ele.prop
                this.$set(this.DIC, ele.dicData, res.data)
                // console.log(ele.dicUrl, res.data);
              })
            }
          }
        }
        if (typeof ele.dicData == 'string') {
          validatenull(this.option.dic) && (this.option.dic = [])
          this.option.dic.push(ele.dicData)
        }
        return this.getTableType(ele)
      },
      getTableType(ele) {
        // ele.type为空时，设置type为select
        if (validatenull(ele.type) && (!validatenull(ele.dicData) || !validatenull(ele.dicUrl))) {
          this.$set(ele, 'type', 'select')
        }
        return ele
      },
      setCascaderItem(formName, ele) {
        // 设置响应式后，二次调用时，watch里取到的this.column[nextProp]才是最新的。
        this.$set(this.column, ele.prop, ele)
        // this.column[ele.prop] = ele;
        if (!validatenull(ele.cascaderItem)) {
          let cascaderItem = [ele.prop, ...ele.cascaderItem]
          cascaderItem.forEach((prop, index) => {
            let nextProp = cascaderItem[index + 1]
            if (validatenull(nextProp)) return

            let watchName = `${formName}.${prop}`
            if (this.unwatch[watchName]) {
              this.unwatch[watchName]()
              this.unwatch[watchName] = undefined
            }
            this.unwatch[watchName] = this.$watch(
              watchName,
              (val) => {
                // console.log(watchName, val);
                if (!validatenull(val)) {
                  // nextColumn在$watch创建的时候并不存在，所以放到这里获取
                  let nextColumn = this.column[nextProp]
                  this.$set(nextColumn, 'dicData', '')
                  this.$httpGet(nextColumn.dicUrl.replace('{{key}}', val)).then((dict) => {
                    nextColumn.dicData = nextProp
                    this.$set(this.DIC, nextProp, dict)
                    // console.log(JSON.parse(JSON.stringify(this.unwatch)));
                    // 选择上级后，下级值清空
                    // cascaderItem.slice(index + 1).forEach(innerProp => {
                    //   // console.log(prop, innerProp);
                    //   this.$set(this[formName], innerProp, this[formName][innerProp] || '');
                    // })
                  })
                }
              },
              {
                immediate: true
              }
            )
          })
        }
        return ele
      },
      vaildData(val, dafult) {
        if (typeof val == 'boolean') {
          return val
        }
        return !validatenull(val) ? val : dafult
      },
      getComponent,
      getSearchType,
      findByvalue,
      setDic,
      setPx,
      deepClone
    }
  }
}
