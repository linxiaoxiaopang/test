// const a = {
//   a: 1000
// }

// exports.a = a


// setTimeout(() => {
//   exports.a = null
// }, 200);
module.exports = 123
setTimeout(() => {
  module.exports = null
}, 0);