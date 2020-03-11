<template>
<!-- 用el-card布局实现素材管理页面 -->
  <el-card>
      <!-- 放入面包屑组件 -->
      <bread-crumb slot="header">
      <template slot="title">
          素材管理
      </template>
      </bread-crumb>
      <el-row type="flex" justify="end">
      <!-- 放置上传组件 必须设置action属性-->
      <el-upload :show-file-list='false' :http-request='upLoadImg' action=''>
          <!-- 传入内容 点击才会出现-->
          <el-button type="primary" size="small">上传素材</el-button>
      </el-upload>
      </el-row>
      <!-- 放置标签页 -->
      <!-- v-model绑定的值就是当前激活的页签 -->
      <!-- 切换页签时，需要进行事件的监听 -->
      <el-tabs v-model="activeName" @tab-click='changeTab'>
          <!-- 子选项1 全部素材-->
          <!-- name代表页签选中的值 -->
          <el-tab-pane label="全部素材" name="all">
              <!-- 内容 v-for循环生成页面结构-->
              <div class="img-list">
                  <el-card class='img-card' v-for="(item,index) in list" :key="item.id">
                      <!-- 放置图片，并赋值图片地址 -->
                      <img :src="item.url" alt="" @click="selectImg(index)">
                      <!-- 放置操作栏 -->
                      <el-row class="operate" type="flex" justify="space-around" align="middle">
                          <i @click='collectOrCancel(item)' :style="{ color:item.is_collected ? 'red' : 'black' }" class="el-icon-star-on"></i>
                          <i @click="delMaterial(item)" class="el-icon-delete-solid"></i>
                      </el-row>
                  </el-card>
              </div>
          </el-tab-pane>
          <!-- 子选项2 收藏素材-->
          <el-tab-pane label="收藏素材" name="collect">
              <!-- 内容 没有操作栏-->
            <div class="img-list">
                  <el-card class='img-card' v-for="(item,index) in list" :key="item.id">
                      <!-- 放置图片，并赋值图片地址 -->
                      <img :src="item.url" alt="" @click="selectImg(index)">
                  </el-card>
              </div>
          </el-tab-pane>
      </el-tabs>
      <!-- 放置分页组件 -->
        <el-row type="flex" justify="center" style="height:80px" align="middle">
            <el-pagination background
            :total="page.total"
            :current-page="page.currentPage"
            :page-size="page.pageSize"
            layout='prev,pager,next'
            @current-change='changePage'>
            </el-pagination>
        </el-row>
        <!-- 放置el-dialog弹层组件 通过visible属性进行true和false的设置-->
        <el-dialog @opened='openEnd' :visible="dialogVisible" @close="dialogVisible = false">
          <!-- 放置一个走马灯组件 -->
          <el-carousel ref='myCarousel' indicator-position="outside" height="400px">
            <!-- 配置走马灯 放置幻灯片循环项=>根据当前列表list循环-->
            <el-carousel-item v-for="item in list" :key="item.id">
              <!-- 放置图片 -->
              <img style='width:100%' :src="item.url" alt="">
            </el-carousel-item>
          </el-carousel>
        </el-dialog>
  </el-card>
</template>

<script>
// import { getMaterial } from
export default {
  data () {
    return {
      activeName: 'all', // 当前激活的页签，默认选中全部素材
      list: [], // 接收全部素材，包括全部和收藏的数据
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页
        pageSize: 8 // 每页显示几条
      },
      dialogVisible: false, // 控制显示隐藏
      clickIndex: -1 // 点击的索引
    }
  },
  methods: {
    // 8.定义方法解决el-dialog懒加载问题
    openEnd () {
      // 这时候已经打开结束，ref已经拿到值，再设置
      this.$refs.myCarousel.setActiveItem(this.clickIndex) // 尝试通过ref设置index
    },
    // 7.点击图片时调用此方法
    selectImg (index) {
      this.clickIndex = index // 将得到的图片索引赋值
      this.dialogVisible = true // 并且打开索引
    },
    // 6.定义删除素材的方法
    async delMaterial (row) {
      // 删除之前提示一下用户
      await this.$confirm('Are you sure?', '提示信息')
      try {
        // 如果确定删除，就调删除接口
        await this.$axios({
          method: 'delete', // 注意里面是method
          url: `/user/images/${row.id}` // 请求地址
        })
        // 成功重新加载素材数据
        this.getMaterial()
        // 如果删除成功了 也可以重新拉取数据 也可以在前端删除 移动端会演示
      } catch (error) {
        this.$message.error('操作失败')
      }
    },
    // 5.定义取消或者收藏素材的方法
    async collectOrCancel (row) {
      try {
        // 点击调用收藏和取消收藏借口
        await this.$axios({
          method: 'put', // 注意里面是method
          url: `/user/images/${row.id}`, // 请求地址
          data: { collect: !row.is_collected } // 放置body参数
        })
        // 成功重新加载素材数据
        this.getMaterial()
      } catch (error) {
        this.$message.error('操作失败')
      }
    },
    //   4.定义上传组件方法
    async upLoadImg (params) {
      try {
        // params.file就是我要上传的文件
      // 接口参数类型是formDate
        const data = new FormData() // 实例化对象
        data.append('image', params.file)
        //   开始发送请求
        await this.$axios({
          url: '/user/images',
          method: 'post', // 上传新增都是post
          data // ES6简写
        })
        //   成功就重新拉取数据
        this.getMaterial()
      } catch (error) {
        //   失败弹出提示信息
        this.$message.error('上传文件失败')
      }
    },
    //   3.监听页码切换事件
    changePage (newPage) {
      this.page.currentPage = newPage // 将新页码赋值给页码数据
      this.getMaterial() // 获取数据
    },
    //   1.获取素材数据
    async getMaterial () {
      const result = await this.$axios({
        url: '/user/images',
        params: {
          // 里面放query参数
          collect: this.activeName === 'collect', // 获取不收藏的数据=全部数据
          page: this.page.currentPage, // 取页码变量中的值
          per_page: this.page.pageSize
        }
      })
      //   将返回数据赋值给data中的list
      this.list = result.data.results
      // 将总条数赋值给total变量，总数根据页签变化而变化
      this.page.total = result.data.total_count // 总数赋值
    },
    // 2.定义一个切换页签事件
    changeTab () {
      // 切换页码时，将页码重置为第一页
      this.page.currentPage = 1
      // 当页签切换时，根据activeName决定获取哪个方面的数据
      this.getMaterial()
    }
  },
  created () {
    this.getMaterial()
  }
}
</script>

<style lang='less' scoped>
    .img-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: left;
        .img-card {
            width: 200px;
            height: 230px;
            margin: 20px 34px;
            position: relative;
            img {
                width: 100%;
                height: 100%;
            }
            .operate {
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                height: 40px;
                background-color: #ccc;
                font-size: 20px;
            }
        }
    }
</style>
