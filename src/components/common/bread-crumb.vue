<template>
<!-- 使用elementui的面包屑组件 设置分隔符号 -->
  <el-breadcrumb separator=">">
      <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
      <!-- 内容是动态的，所以采用具名插槽实现，谁调用谁填坑即可-->
      <el-breadcrumb-item>
        <slot name="title"></slot>
      </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {

}
</script>

<style>

</style>
