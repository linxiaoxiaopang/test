import { parseCharacterTime } from '@/utils'
export default {
  props: {
    query: {
      type: Object,
      required: true
    },
    sup_this: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      time: [],
      timeSortOptions: [
        {
          label: '过期时间递增',
          value: 'expiration_time'
        },
        {
          label: '过期时间递减',
          value: '-expiration_time'
        }
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 0)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  methods: {
    toQuery() {
      if (this.time && this.time.length) {
        this.query.startTime = parseCharacterTime(
          new Date(`${this.time[0]} 00:00:00`).toUTCString().replace(' GMT', '')
        )
        this.query.endTime = parseCharacterTime(
          new Date(`${this.time[1]} 23:59:59`).toUTCString().replace(' GMT', '')
        )
      } else {
        delete this.query.startTime
        delete this.query.endTime
      }
      for (let key in this.query) {
        if (this.query[key] === '' || this.query[key] === undefined) {
          delete this.query[key]
        }
      }
      if (this.sup_this) {
        this.sup_this.page = 1
        this.sup_this.init()
      } else {
        this.$parent.page = 1
        this.$parent.init()
      }
    }
  }
}
