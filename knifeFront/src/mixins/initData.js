import { initData } from '@/api/data'
import fa from 'element-ui/src/locale/lang/fa'
import {deepClone, getDiffData} from '@/components/avue/utils/util'

const J_TIME_PROPS = ['importTime']

export default {
  data() {
    return {
      tableLoading: true,
      selectedData: [],
      data: [],
      page: 1,
      size: 10,
      total: 0,
      url: '',
      params: {},
      mergeData: this.resetMergeData || {},
      query: {},
      time: 170,
      initBool: true,
      method: 'get',
      infiniteScroll: false
    }
  },
  mounted() {
    if (this.$refs.paginationBar) {
      this.$refs.paginationBar.pagingInfo.size = this.size
    }
    if (this.initBool) {
      this.init()
    }
  },
  activated() {
    // 第一次加载时会执行activated生命周期
    // deactivated为true时，表示组件已缓存，此时可以执行init更新数据
    if (this.deactivated) {
      this.refreshPage()
    }
  },
  deactivated() {
    this.deactivated = true
  },
  methods: {
    handleSelectionChange(selection) {
      this.selectedData = selection
    },
    async beforeInit() {
      // 在请求之前执行
      if (this.beforeInitCallback) {
        await this.beforeInitCallback()
      }
      if (!this.url) {
        throw new Error('需要重置url')
      }
      const sort = 'sort'
      const query = this.query
      this.params = { page: this.page, size: this.size, ordering: sort }
      const tmpObj = {}
      for (let key in query) {
        if (query[key] !== undefined && !J_TIME_PROPS.includes(key)) {
          tmpObj[key] = query[key]
        }
      }
      //排序的空字符串处理
      if (!tmpObj.ordering) {
        tmpObj.ordering = sort
      }
      if (Object.keys(tmpObj).length) {
        const _this = this.$refs.paginationBar
        for (let key in tmpObj) {
          this.params[key] = tmpObj[key]
        }
        _this && _this.reFreshpage && _this.reFreshpage(this.page)
      }
  
      const {mergeData} = this
      for (let key in mergeData) {
        let value = mergeData[key]
        if (value || value === 0 || value === false) {
          this.params[key] = value
        }
      }
      
      this.toPostParams()
      return true
    },
    toPostParams() {
      if (this.method.toUpperCase() === 'POST') {
        const { page, size, ...rest } = this.params
        const data = {
          page: {
            pageIndex: page,
            pageSize: size
          }
        }
        const params = {}
        Object.assign(params, data, rest)
        let tempObj = {}
        for (const key in params) {
          let value = params[key]
          if (value || value === 0 || value === false) {
            tempObj[key] = value
          }
        }
        this.params = tempObj
      }
    },
    async init() {
      // 搜索表单修改后，页码重置为1
      let queryDiffData = getDiffData(this.query, this.prevParams || {})
      this.prevParams = deepClone(this.query)
      if (Object.keys(queryDiffData).length) {
        this.page = 1
      }

      if (!(await this.beforeInit())) return
      
      return new Promise((resolve, reject) => {
        this.tableLoading = true
        this.selectedData = []
        //无限滚动
        if (!this.infiniteScroll) {
          this.data = []
        }
        initData(this.url, this.method, this.params)
          .then((res) => {
            this.total =
              (res.detail && res.detail.count) ||
              (res.page && res.page.total) ||
              0
            if (this.page == 1) {
              this.data = []
            }
            const resData =
              (res.detail && res.detail.results) ||
              (Array.isArray(res.detail) ? res.detail : [])
            if (!this.infiniteScroll) {
              this.data = resData
            } else {
              //无限滚动 data叠加
              this.data = this.data.concat(resData)
            }
            setTimeout(() => {
              this.tableLoading = false
            }, this.time)
            this.initCallBack && this.initCallBack(res)
            resolve(res)
          })
          .catch((err) => {
            this.tableLoading = false
            this.initCallBack && this.initCallBack()
            reject(err)
          })
      })
    },
    refreshPage() {
      this.init()
    },
    searchChange() {
      this.page = 1
      this.init()
    },
    pageChange(e) {
      this.isPageChange = true
      this.page = e
      this.init()
    },
    sizeChange(e) {
      this.isPageChange = true
      this.page = 1
      this.size = e
      this.init()
    },
    refreshTableEventFun({ page, size }) {
      this.isPageChange = true
      this.page = page
      this.size = size
      this.init()
    }
  }
}
