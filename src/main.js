import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/permission' // 引入路由前置守卫权限模块
import Element from 'element-ui' // 引入UI
import 'element-ui/lib/theme-chalk/index.css' // 引入样式
import './styles/index.less' // 引入less样式=>初始化搞定
import axios from '@/utils/request' // 引入我们封装后的axios组件，用来调接口发请求
import Components from '@/components'
Vue.config.productionTip = false
Vue.use(Element) // vue实例全局注册使用element组件，可以直接使用
Vue.use(Components) // 调用自己注册的自定义组件，可以全局使用
Vue.prototype.$axios = axios // 将axios赋值给vue对象的原型属性，这样在任何组件任意位置就可以获取axios
new Vue({
  router,
  render: h => h(App)
}).$mount('#app') // 完成vue实例化 并挂载了router路由
