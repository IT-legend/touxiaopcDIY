<template>
  <!-- 还是一个页签，这是弹窗中选择图片的组件 -->
  <el-tabs v-model="activeName">
      <el-tab-pane label="素材库" name="material">
          <!-- 查询全部的素材 -->
          <!-- {{list}} -->
          <div class="select-image-list">
              <el-card v-for="item in list" :key="item.id" class="img-card">
                  <img :src="item.url" alt="" @click="clickImg(item.url)">
              </el-card>
          </div>
            <!-- 插入分页 -->
            <el-row type="flex" justify="center" style="height:80px" align="middle">
                <!-- 分页组件 -->
                <el-pagination background layout="prev,pager,next" :total="page.total" :current-page="page.currentPage" :page-size="page.pageSize"
                @current-change='changPage'></el-pagination>
            </el-row>
      </el-tab-pane>
      <el-tab-pane label="上传素材" name="upload">
        <!-- 放置上传组件 -->
        <!-- action必须给值，否则报错 -->
        <el-upload action="" class="upload-icon" :http-request="uploadImg" :show-file-list="false">
          <!-- 放置元素用来点击上传 -->
          <!-- 完成上传素材之后，要把地址设置给封面 http-request-->
          <i class="el-icon-circle-plus-outline"></i>
        </el-upload>
      </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'material', // 当前激活的变量
      list: [], // 素材列表数据
      page: {
        currentPage: 1,
        pageSize: 8,
        total: 0
      }
    }
  },
  methods: {
    //   1-定义方法来获取全部素材
    getAllImg () {
      this.$axios({
        url: '/user/images', // 获取全部素材接口
        params: {
          collect: false, // 是否收藏，这里是查询全部素材
          page: this.page.currentPage, // 查询当前页码
          per_page: this.page.pageSize
        }
      }).then(result => {
        //   获取到全部素材的数据，并赋值给我们的list
        this.list = result.data.results
        this.page.total = result.data.total_count
      })
    },
    changPage (newPage) {
      // 赋值新页码
      this.page.currentPage = newPage
      this.getAllImg()
    },
    // 点击图片时触发
    clickImg (url) {
      // 需要将url参数传递给上层组件
      this.$emit('selectOneImg', url) // 将url参数传出去
    },

    uploadImg (params) {
      // 调用上传接口
      // params.file就是我要上传的文件
      // 接口参数类型是formDate
      const data = new FormData() // 实例化对象
      data.append('image', params.file)
      //   开始发送请求
      this.$axios({
        url: '/user/images',
        method: 'post', // 上传新增都是post
        data // ES6简写
      }).then(result => {
        //   成功后，接口会返回上传成功的图片地址
        this.$emit('selectOneImg', result.data.url) // 将url参数传出去
        // this.getMaterial()
      }).catch(() => {
        //   失败弹出提示信息
        this.$message.error('上传文件失败')
      })
    }
  },
  created () {
    //   1-调用获取数据方法
    this.getAllImg()
  }
}
</script>

<style lang='less' scoped>
    .select-image-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        .img-card {
            width: 150px;
            height: 150px;
            margin: 20px 0;
            img {
                width: 100%;
            }
        }
    }
    .upload-icon {
      display: flex;
      justify-content: center;
      i {
        font-size: 30px;
        padding: 50px;
        border:2px dashed #ccc;
        border-radius: 4px;
      }
    }
</style>
