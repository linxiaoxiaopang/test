export default {
  computed: {
    expireDirTime() {
      return (row) => {
        const { prop } = row || {}
        const dirTime = (prop && new Date(prop) - new Date()) || 0
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
  }
}
