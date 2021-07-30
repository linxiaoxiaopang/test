export default {
  computed: {
    domData() {
      return this.data.map(item => {
        const {
          id: itemId,
          count,
          isPrint,
          half_pass,
          whole_pass,
          fac_prods,
          package_pass,
          order: {
            id: orderId,
            batch_group,
            department,
            sale_date,
            salesman,
            export_time
          } = {},
          prod_spec: { SKU, factory_cate, kl_path } = {}
        } = item || {}
        return Object.assign(
          {},
          {
            itemId,
            orderId,
            isPrint,
            half_pass,
            whole_pass,
            package_pass,
            SKU,
            fac_prods,
            batch_group,
            factory_cate,
            kl_path,
            count,
            department,
            sale_date,
            export_time,
            salesman
          }
        )
      })
    }
  }
}
