import { parseCharacterTime } from '@/utils'
const TIME_PROPS = ['create_time', 'put_on_time', 'off_time', 'importTime']

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
  computed: {
    timeProp() {
      try {
        const timeData = this.formField.filter(({ prop }) => TIME_PROPS.includes(prop))
        return timeData[0].prop
      } catch (err) {
        return ''
      }
    }
  },
  methods: {
    showDialog() {
      this.dialogVisible = true
    },
    toQuery() {
      const timeProp = this.timeProp
      // console.log('timeProp', timeProp)
      if (timeProp) {
        const time = this.time
        if (time && time.length) {
          if (timeProp === 'importTime') {
            this.query['importStartTime'] = parseCharacterTime(
              new Date(`${this.time[0]} 00:00:00`).toString().replace(' GMT', '')
            )
            this.query['importEndTime'] = parseCharacterTime(
              new Date(`${this.time[1]} 23:59:59`).toString().replace(' GMT', '')
            )
          } else {
            this.query[`${timeProp}_after`] = parseCharacterTime(
              new Date(`${this.time[0]} 00:00:00`).toString().replace(' GMT', '')
            )
            this.query[`${timeProp}_before`] = parseCharacterTime(
              new Date(`${this.time[1]} 23:59:59`).toString().replace(' GMT', '')
            )
          }
        } else {
          delete this.query[`${timeProp}_after`]
          delete this.query[`${timeProp}_before`]
          delete this.query['importStartTime']
          delete this.query['importEndTime']
        }
      }
      console.log(JSON.stringify(this.query))
      // this.sup_this.page = 1
      this.sup_this.init()
      this.$emit('searchChange', this.query)
    }
  }
}
