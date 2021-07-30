import ReconnectingWebSocket from 'reconnecting-websocket'

export default {
  mounted() {
    // 创建 websocket 链接
    this.createWebsocket()
  },

  destroyed() {
    this.closeWebSocket()
  },
  methods: {
    // 创建 websocket 链接
    createWebsocket() {
      this.websocket = new ReconnectingWebSocket(
        `wss://${this.$serverRootPath}custom_api/websocket/queue/${this.coding}`
      )
      // 连接发生错误的回调方法
      this.websocket.onerror = this.websocketOnerror
      // 连接成功建立的回调方法
      this.websocket.onopen = this.websocketOnopen
      // 接收到消息的回调方法
      this.websocket.onmessage = this.websocketOnmessage
      // 连接关闭的回调方法
      this.websocket.onclose = this.websocketOnclose
      // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      this.websocket.onbeforeunload = this.websocketOnbeforeunload
    },
    // 连接发生错误的回调方法
    websocketOnerror() {
      console.log('连接发生错误的回调方法')
    },
    // 连接成功建立的回调方法
    websocketOnopen() {
      console.log('连接成功建立的回调方法')
    },
    // 接收到消息的回调方法
    websocketOnmessage(event) {
      const data = JSON.parse(event.data)
      console.log('接收到消息的回调方法', data)
    },
    // 连接关闭的回调方法
    websocketOnclose() {
      console.log('连接关闭的回调方法')
    },
    // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常
    websocketOnbeforeunload() {
      this.closeWebSocket()
      console.log(
        '监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常'
      )
    },
    // 关闭WebSocket连接
    closeWebSocket() {
      this.websocket.close()
    }
  }
}
