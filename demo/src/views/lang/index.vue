<template>
  <div class="lang-wrapper">
    <lang-item :data="formatData"/>
    <div class="link-list">
      <a :class="['link', hash == item.id && 'active']" :href="`#${item.id}`" v-for="item in linkArr" @click="clickHandler(item.id)">
        {{ item.name }}
      </a>
    </div>
  </div>
</template>

<script>
import langItem from './langItem'
import data from './en'
import {isArray, isPlainObject} from "lodash";

export default {
  components: {
    langItem
  },

  data() {
    return {
      data,
      hash: (location.hash || '').replace('#', '')
    }
  },


  computed: {
    formatData({data}) {
      return this.fillLanData(data)
    },

    linkArr({formatData}) {
      const tmpArr = []
      formatData.map(item => {
        tmpArr.push(item[0])
        item.map(arr => {
          if(isArray((arr)) &&isPlainObject(arr[0])) {
            tmpArr.push(arr[0])
          }
        })
      })
      return tmpArr
    }
  },

  methods: {
    clickHandler(id) {
      this.hash = id
    },

    fillLanData(data, pKey) {
      return Object.keys(data).map(key => {
        const val = data[key]
        const formatKey = pKey ? `${pKey}.${key}` : key
        const bool = pKey&&pKey!== 'page'
        const emptyObj = {id: key, name: key, show: false, level: !pKey ? 1 : 1}
        if (!val || typeof val !== 'object') return bool ? `$t('${formatKey}')` : [emptyObj, `$t('${formatKey}')`]
        const data1 = this.fillLanData(val, formatKey)
        return bool ? data1 : [emptyObj, ...data1]
      })
    },


  }
};
</script>

<style lang="css">
.lang-wrapper.lang-wrapper {
  overflow: hidden;
  margin-left: -30px;
}

.link-list.link-list {
  position: fixed;
  right: 0;
  top: 100px;
}

.link{
  display: block;
  /*background: #409EFF;*/
  background: #eeee;
  padding: 0px 20px;
  margin-bottom: 5px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.link.active, .link:hover {
  background: #409EFF;
  color: #fff;
}
.link[href="#page"]~.link {
  margin-left: 20px;
}

</style>