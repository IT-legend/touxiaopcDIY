<template>
  <!-- 二级路由的默认组件 -->
  <div class="second-home">
      <!-- 幻灯片 -->
<el-carousel :interval="4000" arrow="always" class="tab" height="600px">
    <el-carousel-item v-for="item in list" :key="item.url">
      <img class='imgs' :src="item.url" alt="">
    </el-carousel-item>
  </el-carousel>
<div class="wrap">
  <div class="cube">
    <div class="out_front">
      <img class="pic" src="../../assets/img/正方体1.gif" alt="">
    </div>
    <div class="out_back">
      <img class="pic" src="../../assets/img/正方体6.gif" alt="">
    </div>
    <div class="out_left">
      <img class="pic" src="../../assets/img/正方体2.gif" alt="">
    </div>
    <div class="out_right">
      <img class="pic" src="../../assets/img/正方体3.gif" alt="">
    </div>
    <div class="out_top">
      <img class="pic" src="../../assets/img/正方体4.gif" alt="">
    </div>
    <div class="out_bottom">
      <img class="pic" src="../../assets/img/正方体5.gif" alt="">
    </div>
  </div>
</div>
</div>
</template>

<script>
export default {
  data () {
    return {
      list: [
        {
          url: require('../../assets/img/tab1.jpg')
        },
        {
          url: require('../../assets/img/tab2.jpg')
        },
        {
          url: require('../../assets/img/tab3.jpg')
        },
        {
          url: require('../../assets/img/tab4.jpg')
        },
        {
          url: require('../../assets/img/tab5.jpg')
        },
        {
          url: require('../../assets/img/tab6.jpg')
        },
        {
          url: require('../../assets/img/tab7.jpg')
        }
      ]
    }
  }
}
</script>

<style>
  .second-home {
      /* calc 计算的意思 在css中计算数值 用法  calc ( 四则运算  ) 变量之间 和运算符之间一定要有空格 */
      height: calc(100vh - 60px);
      background: url("../../assets/img/home背景.gif");
      background-size: cover;
  }
  .wrap{
    z-index: 5;
    width: 150px;
    height: 150px;
    left: 320px;
    top: 130px;
    position: absolute;
  }
  .cube{
    width: 150px;
    height: 150px;
    margin: 0 auto;
    transform-style: preserve-3d;
    transform: rotateX(-45deg) rotateY(-360deg);
    -webkit-animation: rotate 12s infinite;
    animation-timing-function: linear;
  }
  /* @-webkit-keyframes rotate {
    from{transform: rotateX(-40deg) rotateY(0deg);}
    to{transform: rotateX(0deg) rotateY(-360deg);}
  } */
  .out_front,
  .out_back,
  .out_left,
  .out_right,
  .out_top,
  .out_bottom {
    position: absolute;
    width: 150px;
    height: 150px;
    /* 透明度 */
    opacity: 1;
    /* 鼠标经过完成动画的时间 */
    transition: all .5s;
  }
  /* 正方体设置 */
  .pic{
    width: 150px;
    height: 150px;
  }
  .out_front{
    transform: rotateX(0deg) translateZ(75px);
  }
  .out_back{
    transform: translateZ(-75px) rotateY(180deg);
  }
  .out_left{
    transform: rotateY(90deg) translateZ(75px);
  }
  .out_right{
    transform: rotateY(-90deg) translateZ(75px);
  }
  .out_top{
    transform: rotateX(90deg) translateZ(75px);
  }
  .out_bottom{
    transform: rotateX(-90deg) translateZ(75px);
  }
  /* 鼠标经过事件 */
  .cube:hover .out_front{
    transform: rotateY(0deg) translateZ(150px);
  }
  .cube:hover .out_back{
    transform: translateZ(-150px) rotateY(180deg);
  }
  .cube:hover .out_left{
    transform: rotateY(90deg) translateZ(150px);
  }
  .cube:hover .out_right{
    transform: rotateY(-90deg) translateZ(150px);
  }
  .cube:hover .out_top{
    transform: rotateX(90deg) translateZ(150px);
  }
  .cube:hover .out_bottom{
    transform: rotateX(-90deg) translateZ(150px);
  }
  .imgs {
    height: 100%;
    width: 100%;
  }
  .tab {
    position: flex;
    left:0;
    top:575px;
  }
</style>
