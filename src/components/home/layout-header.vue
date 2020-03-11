<template>
    <!-- 这里用element的布局el-row（行）和el-col（列） -->
    <el-row type='flex' align='middle' class="layout-header" >
        <!-- 分两列 -->
        <!-- 左侧列 -->
        <el-col class='left' :span='12'>
          <!-- 点击太阳图标对左侧导航栏进行宽度控制 -->
          <!-- 此处的class图标应改为动态的 -->
          <!-- :class="{ class名称 : 布尔值 , class名称 : 布尔值 }" -->
            <i :class="{'el-icon-sunny' : !collapse, 'el-icon-moon': collapse }" @click="collapse=!collapse"></i>
            <span style="color:#fff;margin-left:8px">My Queen</span>
        </el-col>
        <!-- 右侧列 -->
        <el-col class='right' :span='12'>
            <!-- 再次放置row组件 -->
            <el-row align='middle' type="flex" justify='end'>
            <!-- 拿到真实数据，替换 -->
            <img :src="userInfo.photo" alt="">
            <!-- 下拉菜单 点击菜单项，会触发command事件-->
            <el-dropdown @command='clickMenu' trigger="click">
                <!-- 拿到真实数据，替换 -->
                <span style="color:#fff;margin-left:8px">{{userInfo.name}}</span>
                <!-- 下拉内容需要具名插槽 -->
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command='user'>我是谁</el-dropdown-item>
                    <el-dropdown-item command='github'>我来自哪儿</el-dropdown-item>
                    <el-dropdown-item command='gout'>我要去哪儿</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            </el-row>
        </el-col>
    </el-row>
</template>

<script>
// 公共领域监听
import eventBus from '@/utils/eventBus.js'
export default {
  data () {
    return {
      userInfo: {}, // 接收个人信息
      collapse: false

    }
  },
  // 监听data数据变化
  watch: {
    collapse () {
      // alert(1)
      // 数据变了
      eventBus.$emit('changeCollapse') // 触发改变折叠状态的事件
    }
  },
  methods: {
    clickMenu (command) {
      // 需要处理三种点击情况
      if (command === 'user') {
        // 点击个人信息时
      } else if (command === 'github') {
        // 点击个人仓库时需要跳转
        window.location.href = 'https://github.com/IT-legend'
      } else if (command === 'gout') {
        // 点击退出时退出系统
        // 1.删除token
        window.localStorage.removeItem('user-token') // 删除localstorage中的选项
        // 2.跳转回登录页，用编程式导航
        this.$router.push('/login')
      }
    },
    getUserInfo () {
      // 获取真实的个人信息
      this.$axios({
        url: '/user/profile' // 请求地址
      }).then(res => {
      // 如果加载成功，将数据赋值给userInfo
        this.userInfo = res.data
      })
    }
  },
  created () {
    // 正常加载
    this.getUserInfo()
    // 监听
    eventBus.$on('updateUser', () => {
      // 如果有人触发了事件，就会进来
      // 重新获取信息
      this.getUserInfo()
    })
  }
}
</script>

<style lang='less' scoped>
    .layout-header {
        height: 60px;
        .left {
            i {
                font-size: 20px;
                color:#fff;
            }
        }
        .right {
            img {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                margin-right: 5px;
            }
        }
    }
</style>
