export default {
  methods: {
    hasRendering(img) {
      return (
        img.products &&
        img.products.every((item) => {
          return item.prod_show_images && item.prod_show_images.every((item2) => item2.clear_path)
        })
      )
    }
  }
}
