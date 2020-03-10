<template>
<!-- 用el-card做主页面 并调用面包屑组件-->
 <el-card v-loading='loading'>
     <!-- 1.放置面包屑组件 -->
     <bread-crumb slot="header">
     <!-- 填坑 -->
        <template slot="title">
            <span>评论管理</span>
        </template>
     </bread-crumb>
    <!-- 2.放置element表格组件 -->
    <el-table :data="list">
        <!-- prop表示显示的字段 -->
        <el-table-column prop='title' width='600' label="标题"></el-table-column>
        <!-- formatter属性给评论状态列 解决el-table不显示布尔值的问题-->
        <el-table-column :formatter='formatterBool' prop='comment_status' label="评论状态"></el-table-column>
        <el-table-column prop='total_comment_count' label="总评论数"></el-table-column>
        <el-table-column prop='fans_comment_count' label="粉丝评论数"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="obj">
            <!-- 用按钮组件实现操作 -->
            <el-button size='small' type="text">修改</el-button>
            <!-- 文本内容需要根据评论行内状态决定是关闭评论还是打开评论，这里用到作用域插槽 -->
            <el-button @click='openOrClose(obj.row)' size='small' type="text">{{obj.row.comment_status ? '关闭' : '打开'}}评论</el-button>
          </template>
        </el-table-column>
    </el-table>
    <el-row style='height:80px' type='flex' align="middle" justify="center">
    <!-- 引入分页组件 分页组件需要动态数据-->
    <el-pagination background layout="prev,pager,next"
    :total='page.total'
    :current-page="page.currentPage"
    :page-size="page.pageSize"
    @current-change='changePage'></el-pagination>

    </el-row>
 </el-card>
</template>

<script>
export default {
  data () {
    return {
      // 分页数据单独放一个对象，使数据更清晰
      page: {
        total: 0, // 评论总条数
        currentPage: 1, // 默认页码，决定当前页码是第几页
        pageSize: 10 // 每页显示的条数，默认是10
      },
      list: [],
      loading: false // 控制遮罩层的显示或者隐藏
    }
  },
  //   定义方法
  methods: {
    // 定义监听页码改变事件
    changePage (newPage) {
      // newPage就是切换后的页码
      // 将最新的页码设置给page下的当前页码
      this.page.currentPage = newPage
      // 重新拉取列表数据
      this.getComment()
    },
    //   获取评论数据
    getComment () {
      // 获取之前加载遮罩层
      this.loading = true
      this.$axios({
        url: '/articles', // 请求地址
        params: {
          response_type: 'comment',
          // 接口中不传分页数据，默认是查第一页
          page: this.page.currentPage, // 查第一页
          per_page: this.page.pageSize // 查10条
        }
      }).then(res => {
        // 将返回结果中的数组给list
        this.list = res.data.results
        // 在获取完数据之后，将总数赋值给total
        this.page.total = res.data.total_count // 将评论总数赋值
        // 请求完毕关闭遮罩层
        this.loading = false
      })
    },
    formatterBool (row, column, cellValue, index) {
      // row表示当前一行数据
      // column表示当前列信息
      // cellValue表示当前单元格的值
      // index表示当前索引
      return cellValue ? '打开' : '关闭'
    },
    // 定义修改评论状态方法
    openOrClose (row) {
      const mess = row.comment_status ? '关闭' : '打开'
      this.$confirm(`是否确定${mess}评论`, '提示信息').then(() => {
        // 成功之后，调接口
        this.$axios({
          url: './comments/status', // 请求地址
          method: 'put', // 请求类型
          params: {
            article_id: row.id.toString() // 要求参数的文章id
          },
          data: {
            // 提示信息：是打开还是关闭，和评论状态相反
            allow_comment: !row.comment_status
          }
        }).then(() => {
          // 代表成功
          this.$message.success(`${mess}评论成功`)
          // 重新拉取数据
          this.getComment()
        }).catch(() => {
          // 代表失败
          this.$message.error(`${mess}评论失败`)
        })
      })
    }

  },
  //   钩子函数初始化调用
  created () {
    this.getComment()
  }
}
</script>

<style>

</style>
