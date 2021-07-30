<template>
  <Editor id="tinymce" class="tinymce" v-model="content" :init="init"></Editor>
</template>

<script>
import tinymce from "tinymce/tinymce";
import "tinymce/themes/silver";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/plugins/image";
import "tinymce/plugins/link";
import "tinymce/plugins/code";
import "tinymce/plugins/table";
import "tinymce/plugins/lists";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/autoresize";
import "tinymce/plugins/preview";
import "tinymce/icons/default/icons";
// import 'tinymce/plugins/wordcount'
// import 'tinymce/plugins/contextmenu'
// import 'tinymce/plugins/colorpicker'
// import 'tinymce/plugins/textcolor'
import { getUUID, getServiceRootPath } from "@/utils";

const options = {
  selector: "#tinymce",
  // plugins: 'print preview powerpaste casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker imagetools textpattern noneditable help formatpainter permanentpen pageembed charmap tinycomments mentions quickbars linkchecker emoticons advtable',
  plugins: "image link code table lists fullscreen  preview", //引入插件
  browser_spellcheck: true, // 拼写检查
  branding: false, // 去水印
  elementpath: false, //禁用编辑器底部的状态栏
  statusbar: false, // 隐藏编辑器底部的状态栏
  paste_data_images: true, // 允许粘贴图像
  contextmenu:
    "link  image  imagetools  table  configurepermanentpen  copy bold",
  // contextmenu_never_use_native: true,
  draggable_modal: true,
  fixed_toolbar_container: ".tox-editor-header", //指定工具栏在某一容器顶部固定。
  /* menu: { help: { title: '帮助', items: 'addcomment showcomments deleteallconversations' } },*/
  menubar: "file edit view insert format tools table help",
  toolbar:
    "undo redo | bold italic underline strikethrough | fontselect | fontsizeselect | formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment |fullscreen preview",
  mobile: {
    plugins: "image link code table lists fullscreen",
  },
  toolbar_mode: "sliding",
  font_formats:
    "微软雅黑='微软雅黑';宋体='宋体';黑体='黑体';仿宋='仿宋';楷体='楷体';隶书='隶书';幼圆='幼圆';Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings",
  image_advtab: true,
  image_description: false,
  // image_prepend_url 地址前缀
  a11y_advanced_options: true,
  //  ContentStyle 这块很重要， 在最后呈现的页面也要写入这个基本样式保证前后一致， `table`和`img`的问题基本就靠这个来填坑了
  content_style: `
            *                         { padding:0; margin:0; }
            img                       { max-width:100%; }
            iframe                    { width: 100%; }
            p                         { line-height:1.5; margin: 0px; }
            table                     { border:none; border-color:#999; }
            .mce-object-iframe        { max-width:100%;  margin:0; padding:0; }
          `,
};

export default {
  components: { Editor },
  props: {
    val: String,
    isEdit: {
      type: Boolean,
      default: false,
    },
    height: {
      type: Number,
      default: 500,
    },
    id: {
      required: true,
    },
    placeholder: {
      type: String,
      default: "请输入内容",
    },
    useObjectStr: {
      type: String,
      default: "ueditor",
    },
  },
  watch: {
    val: {
      handler(newValue, oldValue) {
        this.$nextTick((_) => {
          this.content = newValue;
        });
      },
      immediate: true,
    },
    content(val) {
      //内容改变事件
      this.$emit("update:val", val);
    },

    id: {
      handler(val) {
        this.getID();
      },
      immediate: true,
    },
  },
  data() {
    return {
      content: "",
      serverUrl: "",
      init: {
        ...options,
        placeholder: this.placeholder,
        height: this.height,
        max_height: this.height,
        language_url: "/tinymce/langs/zh_CN.js",
        language: "zh_CN",
        skin_url: "/tinymce/skins/ui/oxide",
        content_css: "/tinymce/skins/content/default/content.min.css",
        // images_upload_url: this.serverUrl,
        // images_upload_base_path: getServiceRootPath(),
        images_upload_handler: (blobInfo, success, failure) => {
          console.log("blobInfo", blobInfo);
          console.log("success", success);
          console.log("failure", failure);
          const file = blobInfo.blob(); //转化为易于理解的file对象
          console.log("blobInfo.blob()", blobInfo.blob());
          console.log("blobInfo.filename()", blobInfo.filename());
          const formData = new FormData();
          formData.append("file", blobInfo.blob(), blobInfo.filename());
          this.uploadImg(formData).then((res) => {
            console.log("res", res);
            // success(getServiceRootPath() + res.data.url);
            success("111111111");
          });
          // var xhr, formData;
          //
          // xhr = new XMLHttpRequest();
          // xhr.withCredentials = false;
          // xhr.open('POST', 'postAcceptor.php');
          //
          // xhr.onload = function() {
          //   var json;
          //
          //   if (xhr.status != 200) {
          //     failure('HTTP Error: ' + xhr.status);
          //     return;
          //   }
          //
          //   json = JSON.parse(xhr.responseText);
          //
          //   if (!json || typeof json.location != 'string') {
          //     failure('Invalid JSON: ' + xhr.responseText);
          //     return;
          //   }
          //
          //   success(json.location);
          // };
          //
          // formData = new FormData();
          // formData.append('file', blobInfo.blob(), blobInfo.filename());
          //
          // xhr.send(formData);
        },
      },
    };
  },
  methods: {
    uploadImg(formData) {
      console.log(888888);
      // const URL = getServiceRootPath() + this.serverUrl;
      // console.log('URL', URL)
      return Promise.resolve(111111);
      return this.$post(URL, formData).then((res) => {
        return res;
      });
    },

    async getID() {
      if (!this.isEdit) {
        if (!this.id) {
          const id = await getUUID();
          this.$emit("update:id", id);
        }
      }
      const serveJson = JSON.stringify({
        jobId: this.id,
        useObject: this.useObjectStr,
      });
      this.serverUrl = "/pf/file/upload/" + serveJson;
    },
  },
  mounted() {
    tinymce.init({});
  },
};
</script>

<style lang='scss'>
.tox {
  p {
    margin: 0;
    padding: 0;
  }

  .tox-dialog {
    border: none !important;
    border-radius: 8px !important;
  }

  .tox-dialog__header {
    color: #666;
  }

  .tox-dialog__body {
    .tox-tab {
      margin-bottom: 20px;
      color: #666;
    }

    .tox-dialog__body-nav-item--active {
      color: $color-primary;
      border: none;
    }

    .tox-label,
    .tox-textfield {
      margin-bottom: 10px;
      color: #666;
    }
  }

  .tox-dialog__footer {
    .tox-button {
      font-weight: normal !important;
      background: $color-primary !important;
      border-color: $color-primary !important;
      margin-left: 20px !important;
    }

    .tox-button--secondary {
      border-color: $border-color !important;
      background-color: white !important;
    }
  }
}

.tinymce {
  background: #fff;
  width: 100%;

  .tox-tinymce {
    border-radius: 6px;
  }

  .tinymce-container {
    position: relative;
    width: 100%;
  }

  .tinymce-container ::v-deep {
    .mce-fullscreen {
      z-index: 10000;
    }
  }

  .tinymce-textarea {
    visibility: hidden;
    z-index: -1;
  }

  .editor-custom-btn-container {
    position: absolute;
    right: 4px;
    top: 4px;
    /*z-index: 2005;*/
  }

  .fullscreen .editor-custom-btn-container {
    z-index: 10000;
    position: fixed;
  }

  .editor-upload-btn {
    display: inline-block;
  }
}
</style>
