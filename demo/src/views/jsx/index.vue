<script>
export default {
  props: {
    level: {
      type: Number,
      default: 1,
    },
  },
  render(h) {
    let a = '<div>111</div>'
    return h('h' + this.level, [1, 2, 3].map(level => {
      return h('h' + level, {style: {color: 'red'}}, level)
    }))
    // return (
    //   <div>
    //     <h1 is={a}> {this.level}</h1>
    //     {[1, 2, 3].map((item) => <h2>{`${this.level}`}</h2>)}
    //   </div>
    // )
  },
};
</script>

<style>
</style>