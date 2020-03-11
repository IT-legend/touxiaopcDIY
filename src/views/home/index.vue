<template>
    <!-- 1.设置外层父容器，总容器 -->
    <el-container>
      <!-- 2.设置左侧边栏容器 -->
      <el-aside class="aside" :style="{width:collapse ? '64px' : '230px'}">
        <!-- 直接把父组件的状态传给子组件 -->
        <layout-aside :collapse='collapse'></layout-aside>
      </el-aside>
      <!-- 3.右侧也采用父容器包裹方式 -->
      <el-container>
        <!-- 4.右侧上方容器 -->
        <el-header style="background-color:rgb(35, 31, 32)">
          <layout-header></layout-header>
        </el-header>
        <!-- el-main默认有20px的内边距，需要去掉 -->
        <el-main style="padding:0">
          <!-- 这里应该放置二级路由容器 -->
          <router-view>
            <!-- 二级路由区域 -->
          </router-view>
        </el-main>
      </el-container>
      <!-- <audio hidden='hidden' class='music' controls="controls" autoplay="autoplay" loop="loop">
      <source src="../../assets/music/yesterday once more.mp3" />
      </audio> -->

    </el-container>
</template>

<script>
import eventBus from '@/utils/eventBus'
export default {
  data () {
    return {
      collapse: false // 默认展开
    }
  },
  created () {
    eventBus.$on('changeCollapse', () => {
      // 此时状态变了
      this.collapse = !this.collapse // 只要取反就和头部组件对上了
    })
  }
}
</script>

<style scoped>
.music {
  position: fixed;
  top:-93px;
  left: 1110px;
  width: 120px;
  height: 150px;
  outline: none;
}
.aside {
  background-image: url('../../assets/img/实验1.jpg');
}

</style>
