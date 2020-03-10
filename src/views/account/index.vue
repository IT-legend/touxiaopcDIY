<template>
  <el-card>
      <!-- 个人 账户信息 -->
      <bread-crumb slot="header">
        <template slot="title">账户信息</template>
      </bread-crumb>
      <!-- 页面结构，用el表单 -->
      <!-- 1-放置表单根容器 -->
      <el-form label-width="120px" :model="formDate" :rules="rules" ref="myForm">
          <!-- 2-放置单个表单域 -->
          <el-form-item label="用户名">
              <el-input style="width:25%" v-model="formDate.name"></el-input>

          </el-form-item>
          <el-form-item label="简介">
              <el-input style="width:25%" v-model="formDate.intro"></el-input>

          </el-form-item>
          <el-form-item label="用户邮箱">
              <el-input style="width:25%" v-model="formDate.email"></el-input>

          </el-form-item>
          <el-form-item label="手机号">
              <!-- 能看不能改 -->
              <el-input style="width:25%" disabled v-model="formDate.mobile"></el-input>

          </el-form-item>
          <el-form-item label="">
              <el-button type="primary" @click='saveUser'>保存</el-button>
          </el-form-item>
      </el-form>
      <!-- 3-右侧头像 -->
      <el-upload action :http-request="uploadImg" :show-file-list="none">
      <img class='head' :src="formDate.photo ? formDate.photo : defaultImg" alt="">
      </el-upload>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      formDate: {
        name: '',
        intro: '',
        photo: '',
        email: '',
        mobile: ''
      },
      defaultImg: require('../../assets/img/wushen3.png'),
      rules: {
        name: [{ required: true, message: '用户名不能为空', trigger: 'blur' }, { min: 1, max: 7, message: '用户名的长度必须为1-7位', trigger: 'blur' }],
        email: [{ required: true, message: '邮箱名不能为空', trigger: 'blur' }, { pattern: /^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$/, message: '邮箱格式不正确', trigger: 'blur' }]
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
        this.formDate = result.data
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
          data: this.formDate
        }).then(() => {
          this.$message.success('保存成功')
        }).catch(() => {
          this.$message.error('保存失败')
        })
      })
    },
    // 3-上传头像
    uploadImg (params) {
      const data = new FormData()
      data.append('photo', params.file)
      this.$axios({
        url: '/user/photo',
        method: 'patch',
        data
      }).then(result => {
        this.formDate.photo = result.data.photo
      })
    }
  },
  created () {
    this.getUserInfo()
  }
}
</script>

<style>
    .head {
        position: absolute;
        right: 300px;
        top:200px;
        width: 200px;
        height: 200px;
        border-radius: 50%;
    }
</style>
