<template>
  <el-upload
    :http-request="requestHandler"
    :show-file-list="false"
    :action="$attrs.action || '#'"
    :list-type="$attrs['list-type'] || 'text'"
    :before-upload="$attrs['before-upload'] || beforeUpload"
    :multiple="$attrs.multiple === undefined ? true : false"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot>
      <i slot="default" class="el-icon-plus"></i>
    </slot>
    <template #tip>
      <slot name="tip" />
    </template>
  </el-upload>
</template>

<script>
import commonPrivateMixin from "./mixins/commonPrivateMixin";
export default {
  name: 'crudFileUpload',
  mixins: [commonPrivateMixin],
};
</script>
