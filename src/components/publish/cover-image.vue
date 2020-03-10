<template>
  <div class="cover-image">
      <div class="cover-image-item" v-for="(item,index) in list" :key="index" @click="openDialog(index)">
          <!-- 图片地址应该等于item -->
          <!-- 一开始item是一个空的字符串，因为此时还没有选择图片 此时应该根据item是否有值来决定是否显示默认的图片还是item-->
          <!-- item如果没有值就显示默认图片 -->
          <!-- img如果不是固定地址，图片应该先转化为变量 -->
          <img :src="item ? item : defaultImg" alt="">
      </div>
      <!-- 采用element的弹层组件 -->
      <el-dialog :visible="dialogVisible" @close='dialogVisible=false'>
          <!-- 弹层中再次封装一个选择图片组件 -->
        <select-image @selectOneImg='receiveImg'></select-image>
      </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['list'], // 接收传递过来的参数
  data () {
    return {
      // 先将默认图片转为变量
      defaultImg: require('../../assets/img/pic_bg.png'),
      //   控制弹层的显示或者隐藏
      dialogVisible: false,
      selectIndex: -1 // 用来记录当前点击的是哪个
    }
  },
  methods: {
    //   1-点击图片出现弹层
    openDialog (index) {
      this.dialogVisible = true
      this.selectIndex = index // 记录点击的图片
    },
    receiveImg (url) {
    //   拿到图片地址
    // 需要再次传递 传递时把图片地址和索引都要传出去
      this.$emit('zaichuan', url, this.selectIndex)
      //   关闭弹层
      this.dialogVisible = false
    }
  }
}
</script>

<style lang='less' scoped>
    .cover-image {
        display: flex;
        margin: 20px 100px;
        .cover-image-item {
            border: 1px solid #ccc;
            width: 250px;
            height: 250px;
            padding: 20px;
            // overflow: hidden;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
</style>
