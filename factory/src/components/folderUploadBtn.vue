<template>
  <div tabindex="0" class="el-upload el-upload--text">
    <label
      type="button"
      :for="id"
      class="el-button el-button--primary el-button--small"
    >
      <slot>
        <span>点击上传</span>
      </slot>
    </label>
    <input
      webkitdirectory
      type="file"
      name="file"
      class="el-upload__input"
      :value="value"
      :id="id"
      @change.stop="$emit('changeHandler', $event)"
    />
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data () {
    return  {
      value: []
    }
  }
};
</script>

<style>
</style>