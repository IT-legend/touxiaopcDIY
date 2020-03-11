<template>
  <div class="layout-aside">
      <div class=title>
          <!-- 这里需要把图片换成动态的 -->
          <img :src="collapse ? smallImg : bigImg" alt="">
      </div>
      <!-- 导航菜单 -->
      <!-- 导航菜单开启路由模式 -->
      <!-- 开启路由模式之后，需要在每一个菜单上配置index属性，index属性就是在路由模式下设置跳转路径 -->
      <el-menu router background-color="rgba(0, 0, 0, 0)" text-color="#fff" active-text-color="#99CCFF" :collapse='collapse'>
          <!-- 子菜单 分固定的和可下拉的-->
        <el-menu-item index='/home'>
            <i class="el-icon-s-home" style="color:#fff"></i>
            <span>首页</span>
        </el-menu-item>
        <!-- 可下拉菜单1 -->
        <!-- 设置完index属性后不报错，而且分开两个下拉菜单 -->
        <el-submenu index='1'>
            <template slot="title">
                <i class="el-icon-edit-outline" style="color:#fff"></i>
                <span>文章管理</span>
            </template>
            <el-menu-item index='/home/publish'>发布文章</el-menu-item>
            <el-menu-item index='/home/articles'>内容列表</el-menu-item>
            <el-menu-item index='/home/comment'>评论列表</el-menu-item>
            <el-menu-item index='/home/material'>素材管理</el-menu-item>
        </el-submenu>
        <!-- 可下拉菜单2 -->
        <el-submenu index='2'>
            <template slot="title">
                <i class="el-icon-star-off" style="color:#fff"></i>
                <span>粉丝管理</span>
            </template>
            <el-menu-item index='/home/picture'>粉丝列表</el-menu-item>
            <el-menu-item index='/home/fansphoto'>粉丝照片</el-menu-item>
            <el-menu-item index='/home/fansgaft'>粉丝礼物</el-menu-item>
            <el-menu-item index='/home/fansdo'>粉丝做法</el-menu-item>
        </el-submenu>
        <el-menu-item index='/home/account'>
            <i class="el-icon-user" style="color:#fff"></i>
            <span>账户信息</span>
        </el-menu-item>
      </el-menu>
  </div>
</template>

<script>
export default {
  props: ['collapse'], // 接收父组件传出来的变量
  data () {
    return {
      bigImg: require('../../assets/img/logo_admin.png'),
      smallImg: require('../../assets/img/toutiao.png')
    }
  }
}
</script>

<style lang='less' scoped>
    .layout-aside {
        height: 100vh;
        // width: 230px;
        .title {
            text-align: center;
            padding: 10px 0;
            img {
                height: 35px;
            }
        }
        .el-menu {
            border-right: 0;
        }
    }
</style>
