export default {
  render(h) {
    return (
      <el-table
      data={this.infoData}
      props={this.$attrs}
      attrs={this.$attrs}
      on={this.$listeners}
      style="width: 100%">
        {this.cols.map((col, index) => {
          const {prop, label, slotName, slotHeaderName} = col
          return (<el-table-column
            prop={prop}
            label={label}
            scopedSlots={{
              default: props => {
                if(slotName &&this.$scopedSlots[slotName]) {
                  return  this.$scopedSlots[slotName]({scope: props.row})
                }
                return <div>{props.row[prop]}</div>
              }
            }}
            scopedSlots={{
              header: props => {
                if(slotHeaderName &&this.$scopedSlots[slotHeaderName]) {
                  return  this.$scopedSlots[slotName]({scope: props})
                }
                return <div>{label}</div>
              }
            }}
        >
          </el-table-column>)
        })}
    </el-table>
    );
  },
  props: {
    infoData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      cols: [{
        prop: 'date',
        label: '日期',
        slotName: 'dateSlot',
        slotHeaderName: 'dateHeaderSlot'
      },{
        prop: 'name',
        label: '姓名'
      },{
        prop: 'address',
        label: '地址'
      }],
      name: "helllo roeld",
    };
  },
  methods: {},
};
