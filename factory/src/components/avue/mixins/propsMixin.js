
export default {
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'mini'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    dic: {
      type: Array,
      default: () => {
        return []
      }
    },
    props: {
      default: () => {
        return {
          label: 'label',
          value: 'value'
        }
      }
    }
  },
  data() {
    return {
      text: ''
    }
  },
  computed: {
    dictLabel() {
      return this.props.label || 'label'
    },
    dictValue() {
      return this.props.value || 'value'
    }
  },
  watch: {
    value: {
      handler() {
        this.text = this.value
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    handleChange(value) {
      this.$emit('input', value)
      this.$emit('change', value)
    }
  }
}
