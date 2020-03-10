<template>
  <el-card class="articles">
      <bread-crumb slot="header">
        <template slot="title">文章列表</template>
      </bread-crumb>
      <!-- 上半部分：搜索工具栏 -->
      <!-- 放入表单容器组件 -->
      <el-form style="padding-left:50px">
          <!-- 第一行组件 -->
          <el-form-item label="文章状态：">
              <!-- 1-放置单选框组 -->
              <!-- 第一种change监听标签发生变化的方法 -->
              <!-- <el-radio-group v-model="searchForm.status" @change="changeCondition"> -->
                  <!-- 第二种 -->
              <el-radio-group v-model="searchForm.status">
                  <!-- 放置单选框选项 -->
                  <el-radio :label="5">全部</el-radio>
                  <el-radio :label="0">草稿</el-radio>
                  <el-radio :label="1">待审核</el-radio>
                  <el-radio :label="2">审核通过</el-radio>
                  <el-radio :label="3">审核失败</el-radio>
              </el-radio-group>
          </el-form-item>
          <!-- 第二行组件 -->
          <el-form-item label="频道列表：">
              <!-- 2-放置下拉选择器组件 -->
              <!-- 第一种change监听标签发生变化的方法 -->
              <!-- <el-select placeholder="请选择频道" v-model="searchForm.channel_id" @change="changeCondition"> -->
              <el-select placeholder="请选择频道" v-model="searchForm.channel_id">
                  <!-- 下拉选项需要通过接口获取 -->
                  <!-- el-option是下拉选项 -->
                  <!-- label是显示值 value是绑定的值 -->
                  <el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
          </el-form-item>
          <!-- 第三行组件 -->
          <el-form-item label="日期范围：">
              <!-- 3-放置时间范围选择组件 -->
              <!-- 日期的显示值和存储值格式不一致，需要我们定义格式 使用value-format制定绑定值得格式-->
              <!-- 第一种change监听标签发生变化的方法 -->
              <!-- <el-date-picker @change="changeCondition" value-format='yyyy-MM-dd' type="daterange" v-model="searchForm.value1"></el-date-picker> -->
              <el-date-picker value-format='yyyy-MM-dd' type="daterange" v-model="searchForm.dateRange"></el-date-picker>
          </el-form-item>
      </el-form>
      <!-- 下半部分：文章的主体结构 flex布局-->
      <!-- 1-信息总数 -->
        <el-row class='total' type="flex" align="middle">
            <span>共找到10000条符合条件的内容</span>
        </el-row>
        <!-- 2-列表内容 -->
        <div class="article-item" v-for="item in list" :key="item.id.toString()">
            <!-- 左侧内容 -->
            <div class="left">
                <img :src="item.cover.images.length ? item.cover.images[0] : defaultImg" alt="">
                <div class="info">
                    <span>{{ item.title }}</span>
                    <!-- 文章状态想要显示需要使用过滤器 -->
                    <!-- 两个过滤器一个处理显示文本，一个处理标签样式类型 -->
                    <el-tag :type='item.status | fliterType' class="tag">{{item.status |filterStatus}}</el-tag>
                    <span class="date">{{ item.pubdate }}</span>
                </div>
            </div>
            <!-- 右侧内容 -->
            <div class="right">
                <!-- 修改按钮 -->
                <span @click="$router.push(`/home/publish/${item.id.toString()}`)">
                    <i class="el-icon-edit"></i>修改
                </span>
                <!-- 删除按钮 -->
                <!-- 要删除的id可能是大数字类型，所以这里传参需要转换 -->
                <span @click="delMaterial(item.id.toString())">
                    <i class="el-icon-delete"></i>删除
                </span>
            </div>
        </div>
        <!-- 放置分页组件 -->
        <el-row type="flex" justify="center" style="height:80px" align="middle">
            <!-- 放置分页组件 -->
            <!-- 分页三件套缺一不可 -->
            <el-pagination background layout='prev,pager,next' :current-page="page.currentPage" :total="page.total" :page-size="page.pageSize" @current-change='changePage'></el-pagination>
        </el-row>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      // 定义分页对象
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      // 定义一个表单数据对象
      searchForm: {
        // 用来接收数据
        status: 5, // 默认为全部状态
        channel_id: null, // 表示没有任何频道，需要绑定数据
        dateRange: [] // 日期范围
      },
      //   定义channels数组专门接收频道接口的数据
      channels: [],
      //   定义list数组接收文章列表接口数据
      list: [],
      //   将地址对应的文件变成了变量，在编译的时候会被拷贝到对应的位置
      defaultImg: require('../../assets/img/default.gif')
    }
  },
  //   第二种方案：watch监听data中的数据变化
  watch: {
    searchForm: {
      deep: true, // 固定写法 表示会深度检测serchForm中数据的变化
      handler () {
        //   handler固定写法，数据变化就会触发
        this.page.currentPage = 1 // 只要条件变化就回到第一页
        // 直接调用我们的监听改变条件方法
        this.changeCondition()
      }
    }
  },
  methods: {
    //   1-定义方法来获取频道数据
    getChannels () {
      this.$axios({
        url: '/channels' // 地址
      }).then(result => {
        //   获取频道接口返回的数据，赋值给我们的数据数组
        this.channels = result.data.channels
      })
    },
    // 2-定义获取文章列表方法
    getArticles (params) {
      this.$axios({
        url: '/articles', // 请求地址
        params // ES6简写
      }).then(result => {
        this.list = result.data.results // 赋值文章列表给本地数据
        // 将数据总条数赋值给我们的total总条数
        this.page.total = result.data.total_count
      })
    },
    // 3-定义方法监听顶部三个选择组件的变化
    changeCondition () {
      // 当触发此方法的时候，表单数据已经变成最新的了
    //   这时候就可以组合条件了
      const params = {
        page: this.page.currentPage, // 条件改变，就回到第一页
        per_page: this.page.pageSize,
        status: this.searchForm.status === 5 ? null : this.searchForm.status, // 5是我们虚构的
        channel_id: this.searchForm.channel_id, // 表单数据
        begin_pubdate: this.searchForm.dateRange && this.searchForm.dateRange.length ? this.searchForm.dateRange[0] : null,
        end_pubdate: this.searchForm.dateRange && this.searchForm.dateRange.length > 1 ? this.searchForm.dateRange[1] : null
      }
      //   通过接口传入我们的组装条件
      this.getArticles(params)
    },
    // 4-定义方法来监听改变页码
    changePage (newPage) {
      // 先将最新的页码给到当前页码
      this.page.currentPage = newPage
      //   直接调用改变事件方法
      this.changeCondition()
    },
    // 5-定义删除文章方法
    delMaterial (id) {
      // 先提示一下
      this.$confirm('Are you sure?', '提示信息').then(() => {
        //   点击了确定删除，开始调接口删除数据
        this.$axios({
          method: 'delete',
          url: `/articles/${id}` // 地址
        }).then(() => {
          // 删除成功，重新拉取数据
        //   这里需要带着条件来加载页面
        //   this.getArticles()
          this.changeCondition()
        }).catch(() => {
          this.$message.error('删除失败')
        })
      })
    }
    // 6-定义修改文章方法 这里我们直接在行内定义了跳转
    // toPublish () {
    //   // 修改文章要跳转到发布文章页面，采用编程式导航
    //   this.$router.push('/home/publish')
    // }
  },
  //   定义过滤器
  filters: {
  //   定义过滤器用于获取文章发布状态
    filterStatus (value) {
      switch (value) {
        case 0:
          return '草稿'
        case 1:
          return '待审核'
        case 2:
          return '已发表'
        case 3:
          return '审核失败'
      }
    },
    // 过滤器除了在插值表达式中使用，也可以在v-bind的中使用
    fliterType (value) {
      // 根据当前状态的值显示不同的tag标签样式
      switch (value) {
        case 0:
          return 'warning' // 草稿的时候警告
        case 1:
          return 'info' // 待审核
        case 2:
          return '' // 已发表
        case 3:
          return 'danger' // 失败 错误
      }
    }
  },
  created () {
    // 1-获取频道数据
    this.getChannels()
    // 2-获取文章列表数据
    this.getArticles()
  }
}
</script>

<style lang='less' scoped>
    .articles {
        .total {
            height:60px;
            border-bottom: 1px dashed #ccc;
        }
        //文章循环项样式
        .article-item {
            display: flex;
            justify-content: space-between;
            padding: 20px 0;
            border-bottom: 1px solid #ccc;
            .left {
                display: flex;
                img {
                    width: 180px;
                    height: 100px;
                    border-radius: 4px;
                }
                .info {
                    display: flex;
                    flex-direction: column;
                    height:100px;
                    justify-content: space-around;
                    margin-left: 10px;
                    .date {
                        color: #999;
                        font-size: 12px;
                    }
                    .tag{
                        width: 60px;
                        text-align: center;

                    }
                }
            }
            .right {
                span {
                    font-size: 12px;
                    margin-right: 8px;
                    cursor: pointer;
                    user-select: none;
                }
            }
        }
    }
</style>
