import { parseCharacterTime } from '@/utils'

const P_TIME_PROPS = ['create_time', 'put_on_time', 'off_time']
const J_TIME_PROPS = ['importTime']

export default {
  props: {
    query: {
      type: Object,
      default: () => ({})
    },
    sup_this: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  watch: {
    query: {
      handler(n) {
        Object.keys(this.query).forEach((key) => {
          if (typeof this.query[key] === 'number') {
            // delete this.query[key]
          } else {
            if (!this.query[key].trim()) delete this.query[key]
          }
        })
      },
      deep: true
    }
  },
  methods: {
    showDialog() {
      this.dialogVisible = true
    },
    toQuery() {
      const timeProp = this.timeProp
      if (timeProp) {
        let time = this.time
        const timeVal = this.query[timeProp]
        if (timeVal) {
          time = timeVal.split(/[^\d-/]+/)
        }
        if (time && time.length) {
          const fIndex = J_TIME_PROPS.findIndex((prop) => prop === timeProp)
          if (fIndex >= 0) {
            const startTime = this.getJavaDirTime(
              J_TIME_PROPS[fIndex],
              'Start'
            )
            const endTime = this.getJavaDirTime(J_TIME_PROPS[fIndex], 'End')
            this.query[startTime] = parseCharacterTime(
              new Date(`${time[0]} 00:00:00`).toString().replace(' GMT', '')
            )

            this.query[endTime] = parseCharacterTime(
              new Date(`${time[1]} 23:59:59`).toString().replace(' GMT', '')
            )
          } else {
            this.query[`${timeProp}_after`] = parseCharacterTime(
              new Date(`${this.time[0]} 00:00:00`)
                .toString()
                .replace(' GMT', '')
            )
            this.query[`${timeProp}_before`] = parseCharacterTime(
              new Date(`${this.time[1]} 23:59:59`)
                .toString()
                .replace(' GMT', '')
            )
          }
        } else {
          delete this.query[`${timeProp}_after`]
          delete this.query[`${timeProp}_before`]
          this.deleteJavaTime(this.query)
        }
      }
      this.sup_this.page = 1
      this.sup_this.init()
    },
    deleteJavaTime(query) {
      J_TIME_PROPS.map((key) => {
        const formatStartKey = this.getJavaDirTime(key, 'Start')
        const formatEndtKey = this.getJavaDirTime(key, 'End')
        this.$delete(query, formatStartKey)
        this.$delete(query, formatEndtKey)
      })
    },
    getJavaDirTime(key, fill) {
      return key.replace(/(?=Time)/, fill)
    }
  }
}
