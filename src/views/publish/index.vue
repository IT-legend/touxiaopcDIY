<template>
  <el-card>
      <bread-crumb slot="header">
        <template slot="title">发布文章</template>
      </bread-crumb>
      <!-- 放置表单组件 -->
      <el-form :model='publishForm' :rules='publishRules' style="margin-left:50px" label-width="100px" ref="myForm">
          <!-- 第一行 标题功能-->
          <el-form-item label="标题" prop="title">
              <el-input style="width:60%" placeholder="请输入标题" v-model="publishForm.title"></el-input>
          </el-form-item>
          <!-- 第二行 内容功能-->
          <!-- 将input换成quill-editor即可实现富文本编辑器 -->
          <el-form-item label="内容" prop="content">
              <quill-editor v-model="publishForm.content" style="height:300px"></quill-editor>
          </el-form-item>
          <!-- 第三行 封面功能-->
          <el-form-item label="封面" prop="cover" style="margin-top:120px">
              <!-- 单选框组 -->
              <el-radio-group v-model="publishForm.cover.type" @change="changeType">
                  <el-radio :label="1">单图</el-radio>
                  <el-radio :label="3">三图</el-radio>
                  <el-radio :label="0">无图</el-radio>
                  <el-radio :label="-1">自动</el-radio>
              </el-radio-group>
          </el-form-item>
          <!-- 把封面图片传递给组件 -->
          <cover-image :list="publishForm.cover.images" @zaichuan="receiveImg"></cover-image>
          <!-- 第四行 频道功能-->
          <el-form-item label="频道" prop="channel_id">
              <el-select placeholder="请选择频道" v-model="publishForm.channel_id">
                  <!-- 下拉选项必须写入label和value属性 -->
                  <el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
          </el-form-item>
          <!-- 第五行 发布、草稿功能按钮-->
          <el-form-item>
              <!-- 放置两个按钮，发表和存入草稿 -->
              <el-button type="primary" @click="publish(false)">发表文章</el-button>
              <el-button @click="publish(true)">存入草稿</el-button>
          </el-form-item>
      </el-form>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      channels: [], // 接收频道数据
      //   定义发布表单数据
      publishForm: {
        //   内容选项需要根据接口定义
        title: '', // 文章标题
        content: '', // 文章内容
        cover: {
          type: 0, // -1自动，0无图，1单图，3三图
          images: [] // 字符串数组，跟type一一对应
        }, // 封面是一个对象
        channel_id: null // 频道id
      },
      //   定义发布表单校验规则
      publishRules: {
        title: [{ required: true, message: '文章标题不能为空', trigger: 'blur' }, { min: 5, max: 30, message: '标题长度必须在5-30个字符之间', trigger: 'blur' }],
        content: [{ required: true, message: '文章内容不能为空', trigger: 'blur' }],
        channel_id: [{ required: true, message: '频道内容不能为空', trigger: 'blur' }]
      }
    }
  },
  // 如果想要捕捉路由参数的变化，可以采用watch来监听$route
  watch: {
    // watch是监听data中数据的变化，路由初始化后会把$route也放在data中
    $route: function (to, from) {
      // 监听谁就写谁
      // to表示新的路由地址对象 from表示旧的路由地址对象
      // 根据articleId是否存在来进行下一步：有就是编辑，没有就清空
      if (to.params.articleId) {
        // 如果id存在，应该获取文章数据
        this.getArticleById(to.params.articleId)
      } else {
        // 不存在，就清空表单，恢复默认值
        this.publishForm = {
          //   内容选项需要根据接口定义
          title: '', // 文章标题
          content: '', // 文章内容
          cover: {
            type: 0, // -1自动，0无图，1单图，3三图
            images: [] // 字符串数组，跟type一一对应
          }, // 封面是一个对象
          channel_id: null // 频道id
        }
      }
    }
  },
  methods: {
    //   1-定义获取频道数据方法
    getChannels () {
      this.$axios({
        url: '/channels' // 地址
      }).then(result => {
        this.channels = result.data.channels
      })
    },
    // 2-定义发布校验方法
    publish (draft) {
    // 点击发布按钮会手动校验
      this.$refs.myForm.validate().then(() => {
        const { articleId } = this.$route.params
        // 这样等于同时处理了四件事：发布正式文章、发布草稿文章、修改正式文章、修改草稿
        this.$axios({
          // 根据场景决定用什么接口
          url: articleId ? `/articles/${articleId}` : '/articles',
          // 根据场景决定用什么类型
          method: articleId ? 'put' : 'post',
          params: { draft },
          data: this.publishForm
        }).then(() => {
          this.$message.success('操作成功')
          //   如果发布成功，应当跳转到文章列表页
          this.$router.push('/home/articles')
        }).catch(() => {
          this.$message.error('操作失败')
        })

        // if (articleId) {
        //   // 进入这里是修改
        //   this.$axios({
        //     url: `/articles/${articleId}`,
        //     method: 'put',
        //     params: { draft },
        //     data: this.publishForm
        //   }).then(() => {
        //     this.$message.success('发布成功')
        //     //   如果发布成功，应当跳转到文章列表页
        //     this.$router.push('/home/articles')
        //   }).catch(() => {
        //     this.$message.error('发布失败')
        //   })
        // } else {
        //   // 这里是新增
        //   //   校验通过，调取发布接口
        //   this.$axios({
        //     url: '/articles',
        //     method: 'post',
        //     params: { draft }, // query参数，这里必须带括号，否则参数传不进来
        //     data: this.publishForm // body参数
        //   }).then(() => {
        //     this.$message.success('发布成功')
        //     //   如果发布成功，应当跳转到文章列表页
        //     this.$router.push('/home/articles')
        //   }).catch(() => {
        //     this.$message.error('发布失败')
        //   })
        // }
      })
    },
    // 3-根据id获取文章详情
    getArticleById (id) {
      this.$axios({
        url: `/articles/${id}` // 请求地址
      }).then(result => {
        // 将获取到的数据直接赋值给我们的表单数据
        this.publishForm = result.data
      })
    },
    // 4-定义单选框图片类型发生变化的监听方法
    changeType () {
      // 我们应该根据type的值对images进行控制
      if (this.publishForm.cover.type === 1) {
        this.publishForm.cover.images = [''] // 此时没有选择图片，所以给空字符串
      } else if (this.publishForm.cover.type === 3) {
        this.publishForm.cover.images = ['', '', ''] // 此时还没有选择图片，所以给三个空字符串
      } else {
        this.publishForm.cover.images = [] // 无图或者自动时
      }
    },
    // 5-监听接收子组件传递过来的图片数据
    receiveImg (url, index) {
      // 接受到了传递过来的封面数据，将数据更新给images数据
      // 这样就有图片地址和索引了，可以更改数据了
      // 方法一：（简单）
      this.publishForm.cover.images.splice(index, 1, url)
    }
  },
  created () {
    //   1-调取获取频道数据方法
    this.getChannels()
    // 判断是否存在文章ID，如果存在就是修改文章，那么就获取数据。不存在就是新发布文章
    const { articleId } = this.$route.params // articleId是在路由参数中定义的
    // if (articleId) {
    //   // id存在就是编辑，要获取文章数据
    //   this.getArticleById(articleId)
    // }
    // 如果前面为true，才会执行后面的代码
    articleId && this.getArticleById(articleId)
  }
}
</script>

<style>

</style>
