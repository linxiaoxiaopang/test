import { parseDay, parseTime } from '@/utils'
import { STATUS_LIST, STATUS_COLOR } from '@/utils/constant'

export default {
  data() {
    return {
      sup_this: this,
      query: {
        // ordering: "expiration_time"
      },
      options: STATUS_LIST
    }
  },
  computed: {
    status() {
      return row => {
        const index = STATUS_LIST.findIndex(({ value }) => {
          return value == row[row.prop]
        })
        return this.options[index] && this.options[index].label
      }
    },
    tagType() {
      return row => {
        const index = STATUS_LIST.findIndex(({ value }) => {
          return value == row[row.prop]
        })
        return STATUS_COLOR[index] && STATUS_COLOR[index].label
      }
    },
    expireDirTime() {
      return row => {
        const { expiration_time } = row || {}
        const dirTime =
          (expiration_time && new Date(expiration_time) - new Date()) || 0
        const oneDay = 1000 * 60 * 60 * 24
        const oneHour = 1000 * 60 * 60
        if (dirTime <= 0) {
          return {
            color: '#ff4949'
          }
        }
        if (dirTime < oneHour) {
          return {
            color: '#ffba00'
          }
        }
        if (dirTime < oneDay) {
          return {
            color: '#1890ff'
          }
        }
        return {
          color: '#13ce66'
        }
      }
    }
  },
  methods: {
    parseDay,
    parseTime
  }
}
