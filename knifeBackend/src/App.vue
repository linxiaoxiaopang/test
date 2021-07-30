<template>
  <div id="app">
    <router-view />
    <Mission />
  </div>
</template>

<script>
import Mission from '@/components/mission'
export default {
  name: 'App',
  components: {
    Mission
  }
}
</script>
