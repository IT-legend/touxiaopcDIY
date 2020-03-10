<template>
  <div class='login'>
    <!-- 放置一个el-card组件 -->
    <el-card class="login-card">
      <!-- 1.标题图片 -->
      <div class="logo">
        <img src="../../assets/img/logo_index.png" alt="">
      </div>
      <!-- 2.放置总表单 -->
      <!-- 绑定model和rules两个属性 -->
      <!-- 为了完成手动提交，我们给el-form表单标签注册ref属性 通过ref获取整个表单组件的实例-->
      <el-form ref='loginForm' :model='loginForm' :rules='rules'>
        <!-- 3.第一行手机号输入栏 -->
        <!-- 给表单容器设置prop属性，prop表示要校验的字段名 -->
        <el-form-item prop='mobile'>
          <!-- 双向绑定数据 -->
          <el-input v-model='loginForm.mobile' placeholder="请输入您的手机号"></el-input>
        </el-form-item>
        <!-- 4.第二行验证码输入栏 -->
        <el-form-item prop='code'>
          <el-input v-model='loginForm.code' style='width:60%' placeholder='请输入您收到的验证码'></el-input>
          <el-button style='float:right;width:35%;'>发送验证码</el-button>
        </el-form-item>
        <!-- 5.服务条款栏 -->
        <el-form-item prop='checked'>
          <el-checkbox v-model='loginForm.checked' >请投币上车</el-checkbox>
        </el-form-item>
        <!-- 6.登录按钮 -->
        <el-form-item>
          <el-button @click='login' type='primary' style="width:100%">登陆</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  // 因为每个组件都是独立的运行域，所以组件中的data数据应该是一个带返回值的函数，必须有return属性
  data () {
    return {
      // loginForm：定义登陆表单的数据
      loginForm: {
        mobile: '',
        code: '',
        checked: false
      },
      // rules：定义表单的验证规则
      rules: {
        // 定义三个字段的校验规则
        // required为true代表该字段必填
        // message为该字段提示信息
        // pattern为正则表达式，可以规定格式
        mobile: [{ required: true, message: '请输入11位手机号', trigger: 'blur' }, { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }],
        code: [{ required: true, message: '请输入6位手机验证码', trigger: 'blur' }, { pattern: /^\d{6}$/, message: '验证码错误' }],
        // 由于required不能校验布尔值，这里我们用自定义校验函数validator来校验
        checked: [{
          validator: function (rule, value, callback) {
            // rule是当前的校验规则
            // value是当前要校验的字段的值
            // callback是一个回调函数，无论成功还是失败都会执行
            // 如果value是true就是执行成功
            // 执行成功=>callback()
            // 如果value是false就是执行失败
            // 执行失败=>callback(new Error)
            value ? callback() : callback(new Error('你想坐霸王车？'))
          }
        }]

      }
    }
  },
  methods: {
    login () {
      // 这里可以通过ref获取form的对象实例，直接调用上面的validate方法即可校验整个表单
      // 方法一：回调函数校验，利用isOK参数
      // this.$refs.loginForm.validate(function (isOK) {
      //   if (isOK) {
      //     console.log('校验通过')
      //   } else {
      //     console.log('校验失败')
      //   }
      // })
      // 方法二：promise校验
      this.$refs.loginForm.validate().then(() => {
        // console.log('校验通过')
        this.$axios({
          url: '/authorizations', // 请求地址
          data: this.loginForm, // 请求数据
          method: 'post' // 请求方式
        }).then(res => {
          // 请求成功
          window.localStorage.setItem('user-token', res.data.token) // 拿到token并存入本地缓存
          // 请求成功直接跳转到主页，这里我们用编程式导航进行跳转
          // console.log(123)
          this.$router.push('/home')
        }).catch(() => {
          // 请求失败，应该提示消息
          // 方法一：
          // this.$message({ message: '用户名或密码错误', type: 'error' })
          // 方法二：
          this.$message.error('用户名或者密码错误')
        })
      })
    }
  }
}
</script>

<style lang='less' scoped>
  .login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    &:before {
      content:'';
      position: absolute;
      background-image: url('../../assets/img/login背景.gif');
      background-size: cover;
      width: 100%;
      height: 100%;
      filter: blur(1px)
    }
    .login-card {
      z-index: 1;
      width: 380px;
      height: 300px;
      // width: 400px;
      // height: 320px;
      background-color:rgba(35, 96, 114, 0.1);
      .logo {
        text-align: center;
        margin-bottom: 5px;
        img {
          height: 30px;
        }
      }
    }
  }
</style>
