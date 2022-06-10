export default {
  render(h) {
    const slots = this.$scopedSlots;
    return (
      <el-table ref="table" data={this.infoData}>
        {Object.entries(slots).map((slotArr, index) =>{
        const key = slotArr[0]
        const {prop, lable} = this.cols[index]
        return (<el-table-column
          prop={prop}
          lable={lable}
          scopedSlots={{
            default: (props) => {
              return this.$scopedSlots[key] ? (
                h(
                  "div",
                 
                  {
                    attrs: { id: 1000 },
                  },
                  this.$scopedSlots[key]({scope: props.row})
                )
              ) : (
                <span slot="top" scope={props}>
                  {props.row.prop}
                </span>
              );
            },
          }}
        ></el-table-column>)
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
        porp: 'date',
        label: '日期'
      },{
        porp: 'name',
        label: '姓名'
      },{
        porp: 'address',
        label: '地址'
      }],
      name: "helllo roeld",
    };
  },
  methods: {},
};
