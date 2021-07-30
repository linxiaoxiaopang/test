export default {
  props: {
    value: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      form: {}
    }
  },
  watch: {
    value: {
      handler(n) {
        // console.log('value', n);
        this.formVal()
      },
      immediate: true
    }
    /*form: {
      handler(n) {
        console.log('form', n);
      },
      deep: true
    },*/
  },
  methods: {
    formVal() {
      this.form = this.value
      this.$emit('input', this.form)
    }
  }
}
