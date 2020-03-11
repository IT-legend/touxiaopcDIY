<template>
  <el-card>
      <!-- 个人 账户信息 -->
      <bread-crumb slot="header">
        <template slot="title">账户信息</template>
      </bread-crumb>
      <!-- 页面结构，用el表单 -->
      <!-- 1-放置表单根容器 -->
      <el-form label-width="120px" :model="formData" :rules="rules" ref="myForm">
          <!-- 2-放置单个表单域 -->
          <!-- 第一行 用户名 -->
          <el-form-item label="用户名" prop="name">
              <el-input style="width:25%" v-model="formData.name"></el-input>
          </el-form-item>
          <!-- 第二行 用户简介 -->
          <el-form-item label="用户简介">
              <el-input style="width:25%" v-model="formData.intro"></el-input>
          </el-form-item>
          <!-- 第二行 用户邮箱 -->
          <el-form-item label="用户邮箱" prop="email">
              <el-input style="width:25%" v-model="formData.email"></el-input>
          </el-form-item>
          <!-- 第四行 手机号 -->
          <el-form-item label="手机号">
              <!-- 能看不能改 -->
              <el-input style="width:25%" disabled v-model="formData.mobile"></el-input>
          </el-form-item>
          <!-- 第五行 保存按钮 -->
          <el-form-item>
            <el-button type="primary" @click='saveUser'>保存</el-button>
          </el-form-item>
      </el-form>
      <!-- 3-右侧头像 -->
      <el-upload action :http-request="uploadImg"  :show-file-list="false">
      <img class='head' :src="formData.photo ? formData.photo : defaultImg" alt="">
      </el-upload>
  </el-card>
</template>

<script>
import eventBus from '@/utils/eventBus.js'
export default {
  data () {
    return {
      // 定义个人信息数据
      formData: {
        name: '',
        intro: '',
        photo: '',
        email: '',
        mobile: ''
      },
      // 定义默认图片
      defaultImg: require('../../assets/img/wushen3.png'),
      // 定义校验规则
      rules: {
        name: [{ required: true, message: '用户名不能为空', trigger: 'blur' }, { min: 1, max: 7, message: '用户名的长度必须为1-7位', trigger: 'blur' }],
        email: [{ required: true, message: '邮箱名不能为空', trigger: 'blur' }, { pattern: /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/, message: '邮箱格式不正确', trigger: 'blur' }]
      }
    }
  },
  methods: {
    //   1-获取用户个人资料
    getUserInfo () {
      this.$axios({
        url: '/user/profile'
      }).then(result => {
        //   将获取到的数据赋值给我们的表单数据
        this.formData = result.data
      })
    },
    // 2-保存
    saveUser () {
      // 手动校验
      this.$refs.myForm.validate().then(() => {
        // 校验成功
        this.$axios({
          url: '/user/profile',
          method: 'patch',
          data: this.formData
        }).then(() => {
          this.$message.success('保存成功')
          // 广播消息
          eventBus.$emit('updateUser')
        }).catch(() => {
          this.$message.error('保存失败')
        })
      })
    },
    // 3-上传头像
    uploadImg (params) {
      // params.file就是我们上传文件传过来的文件数据
      const data = new FormData()
      data.append('photo', params.file)
      this.$axios({
        url: '/user/photo',
        method: 'patch',
        data // 要传递的参数
      }).then(result => {
        // 拿到数据赋值给我们的新地址
        this.formData.photo = result.data.photo
        // 但是头部组件的小头像没有更新，明天讲
        eventBus.$emit('updateUser')
      })
    }
  },
  created () {
    // 调用获取用户数据的方法
    this.getUserInfo()
  }
}
</script>

<style>
    .head {
        position: absolute;
        right: 300px;
        top: 170px;
        width: 200px;
        height: 200px;
        border-radius: 50%;
    }
</style>
