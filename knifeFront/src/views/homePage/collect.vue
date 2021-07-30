<template>
  <div class="app-container myCollection">
    <div class="content">
      <h3>我的收藏</h3>
      <el-row>
        <!-- 左边一列 -->
        <el-col :span="4" class="left">
          <h4>分组</h4>
          <!-- 搜索框 -->
          <el-form>
            <el-form-item>
              <el-input
                v-model="searchIpt"
                size="mini"
                prefix-icon="el-icon-search"
                placeholder="搜索文件夹"
              ></el-input>
            </el-form-item>
          </el-form>
          <!-- 文件夹区 -->
          <div class="fileName" v-for="(item, index) in fileName" :key="index">
            <button
              class="file"
              @click="fileClick(index)"
              :class="{ fileClicked: fileIndex == index ? true : false }"
            >
              <i class="el-icon-folder-opened"></i>{{ item }}
            </button>
          </div>
          <!-- 新建文件夹按钮 -->
          <el-button
            size="small"
            type="primary"
            class="addBtn"
            @click="showCreatDialogVisible"
            icon="el-icon-plus"
            >新建文件夹
          </el-button>
          <!-- 创建文件对话框 -->

          <el-dialog
            title="创建文件夹"
            :visible.sync="creatDialogVisible"
            width="30%"
          >
            <el-form
              :model="ceratForm"
              :rules="ceratFormRules"
              ref="ceratRuleFormRef"
              label-width="100px"
            >
              <el-form-item label="文件夹名称" prop="name">
                <el-input v-model="ceratForm.name"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="creatDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="createFile"
                >确 定</el-button
              >
            </span>
          </el-dialog>
        </el-col>
        <!-- 右边一列 -->
        <el-col :span="18" class="right">
          <!-- 提醒框 -->
          <el-alert
            title="温馨提示 : 如果想要变更已收场款式的分类，只需拖拽响应的款式到左侧想要归类的文件夹即可"
            type="info"
            closable
          ></el-alert>
          <!-- 全部勾选删除区 -->
          <el-row class="checkedRow">
            <el-col>
              <el-checkbox v-model="allChecked" @change="checkedAll">全部勾选</el-checkbox>
              <i class="el-icon-delete" @click="deleteAll"></i>
            </el-col>
          </el-row>
          <!-- 图片区 -->
          <div :class="{show: fileIndex == index ? false : true}" v-for="(item, index) in fileName" :key="index">
            <el-row class="photo" :gutter="20">
              <el-col :span="6" v-for="(item, index) in photoData" :key="index">
                <el-image :src="item.src"></el-image>
                <el-checkbox v-model="item.state" @change="checkedOnly"></el-checkbox>
                <p class="demonstration">款式名称,限定字段超过用省略号代替1231231231231231</p>
                <div class="pifa">批发:￥<b>12</b>起 <i class="el-icon-more"></i></div>
                <div class="heibai">
                  <span class="span1"></span>
                  <span class="span2"></span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileName: ["默认文件夹", "设计过的", "我爱的"],
      fileIndex: 0,
      searchIpt: '',
      creatDialogVisible: false,
      ceratForm: {name: ''},
      ceratFormRules: {
        name: [
           { required: true, message: '请输入文件夹名称', trigger: 'blur' },
        ]
      },
      allChecked: false,
      // 图片数据
      photoData: [
        { src: "/img/2.jpg", state: false },
        { src: "/img/2.jpg", state: false },
        { src: "/img/2.jpg", state: false },
        { src: "/img/2.jpg", state: false }
      ]
    };
  },
  methods: {
    fileClick(index) {
      this.fileIndex = index;
    },
    // 点击展示创建文件夹的对话框
    showCreatDialogVisible() {
      this.creatDialogVisible = true;
    },
    // 点击创建文件夹
    createFile() {
      this.fileName.push(this.ceratForm.name);
      this.creatDialogVisible = false;
    },
    // 点击全选图片
    checkedAll(bool) {
      this.photoData.map(value => value.state = bool)
    },
    // 反选
    checkedOnly(){
      let bool = this.photoData.every(value => value.state == true)
      if(bool) {
        this.allChecked = true
      } else {
        this.allChecked = false
      }
    },
    // 点击删除图片
    deleteAll() {
      this.photoData = this.photoData.filter(({state}) => !state)
    }
  },
};
</script>

<style lang="scss" scope>
.myCollection {
  .content {
    margin-left: 20px;
    h3 {
      margin: 20px 0 20px 0;
    }
  }
  .el-row {
    .left,.right {
      border: 1px solid rgba($color: #000000, $alpha: 0.1);
      height: 800px;
    }
    .left {
      margin-right: 20px;
      padding: 20px 10px;
      position: relative;
      .el-input {
        margin-top: 10px;
      }
      .file {
        background-color: #fff;
        border: 0;
        outline: none;
        font-size: 14px;
        height: 30px;

        width: 100%;
        text-align: initial;
        margin-bottom: 10px;
        i {
          margin-right: 10px;
          color: $color-primary;
        }
      }
      .fileClicked {
        background-color: rgba($color: #004cff, $alpha: 0.2);
        transition: 0.8s;
      }
      .addBtn {
        position: absolute;
        width: 90%;
        bottom: 20px;
      }
    }
    .right {
      padding: 20px 40px;
      .checkedRow {
      margin-top: 40px;
        .el-icon-delete {
          margin-left: 20px;
          cursor: pointer;
        }
      }
      .show {
        display: none;
        
      }
      .photo {
        margin-top: 40px;
        .el-col {
          position: relative;
        }
        .el-checkbox {
          position: absolute;
          top: 10px;
          left: 20px;
        }
        .demonstration {
        font-size: 12px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-top: 10px;
        }
        .pifa {
          font-size: 12px;
          margin-top: 10px;
          position: relative;
          b {
            font-size: 16px;
            font-weight: 400;
            color: black;
          }
          i {
            font-size: 14px;
            position: absolute;
            right: 20px;
            bottom: 0px;
          }
        }
        .heibai {
          margin-top: 10px;
          .span1,.span2 {
            display: inline-block;
            height: 20px;
            width: 20px;
            background-color: black;
            border: 1px solid $menuHover;
          }
          .span2 {
            background-color: white;
            margin-left: 5px;
          }
        }
      }  
    } 
  }
}
</style>
