import { validatenull } from '@/components/avue/utils/validate'
import {findByvalue, getDiffData, getLabel, getObjType, vaildData} from '@/components/avue/utils/util'
import { parseCharacterTime } from '@/utils'

export default function (option) {
  let { getList, tableOption, isInit = true, request = 'java' } = option
  const { page: hasPage } = tableOption || {}
  return {
    data() {
      tableOption && this.$store.dispatch('HandleOption', tableOption)
      return {
        tableOption,
        tableData: [],
        tablePage: {
          pageIndex: 1,
          pageSize: 10,
          total: 0
        },
        tableLoading: false,
        searchForm: {},
        postData: {}
      }
    },
    computed: {
      page({ tablePage: { pageIndex, pageSize } }) {
        if (hasPage === false) return {}
        if (request === 'python') return {
          page: pageIndex,
          size: pageSize
        }
        return {
          page: {
            pageIndex,
            pageSize
          }
        }
      }
    },
    created() {
      isInit && this.init()
    },
    updated() {
      this.$refs.crud && (this.searchForm = this.$refs.crud.searchForm)
      // console.log('child mounted');
    },
    methods: {
      getLabel,
      findByvalue,
      vaildData(val, defaultVal = '暂无') {
        return vaildData(val, defaultVal)
      },
      beforeInit() {},
      async init() {
        if (getList) {
          this.getPostData()
          this.beforeInit()
          this.tableLoading = true
          let res
          let detail
          try {
            res = await getList(this.postData)
            detail = res.detail || []
            if (request === 'python' || getObjType(detail) === 'object') {
              this.tableData = detail.results || []
              this.tablePage.total = detail.count
            } else {
              this.tableData = detail
              this.tablePage.total = res.page.total
            }
          } catch (e) {
            console.log(e)
          }
          this.afterInit()
          this.tableLoading = false
          return res
        }
      },
      afterInit() {},
      refreshPage() {
        this.init()
      },
      searchChange() {
        this.tablePage.pageIndex = 1
        this.init()
      },
      pageChange(e) {
        this.tablePage.pageIndex = e
        this.init()
      },
      sizeChange(e) {
        this.tablePage.pageIndex = 1
        this.tablePage.pageSize = e
        this.init()
      },
      handleSelectionChange(selection) {
        this.selectedData = selection
      },
      getJavaDirTime(key, fill) {
        return key.replace(/(?=Time)/, fill)
      },
      handleSearchTime(key, value) {
        if (!Array.isArray(value)) return {[key]: value}
        let searchTime
        if (key.includes('Time')) {
          searchTime = {
            [this.getJavaDirTime(key, 'Start')]: value[0] + ' 00:00:00',
            [this.getJavaDirTime(key, 'End')]: value[1] + ' 23:59:59'
          }
        }
        if (key.includes('_time')) {
          searchTime = {
            [key + '_after']: parseCharacterTime(
              new Date(`${value[0]} 00:00:00`).toUTCString().replace(' GMT', '')
            ),
            [key + '_before']: parseCharacterTime(
              new Date(`${value[1]} 23:59:59`).toUTCString().replace(' GMT', '')
            )
          }
        }
        return searchTime
      },
      handleSearchForm() {
        let form = {}
        let { searchForm, handleSearchTime } = this
        for (const key in searchForm) {
          let value = searchForm[key]
          if (!validatenull(value) && value !== 'all') {
            if (key.includes('Time') || key.includes('_time')) {
              Object.assign(form, handleSearchTime(key, value))
              continue
            }
            
            form[key] = value
          }
        }
        return form
      },
      getPostData() {
        let searchForm = this.handleSearchForm()
        
        let queryDiffData = getDiffData(searchForm, this.postData)
        if (Object.keys(queryDiffData).length) {
          this.tablePage.pageIndex = 1
        }
        
        this.postData = {
          ...this.page,
          ...searchForm,
          ...this.resetMergeData
        }
      }
    }
  }
}
