// 作为公共的组件注册文件，全局注册，需要使用Vue.use的方式来注册
// Vue.use会调用对象中的install方法 而install方法的第一个属性就是Vue对象
import LayoutAside from './home/layout-aside.vue'
import LayoutHeader from './home/layout-header.vue'
import BreadCrumb from './common/bread-crumb.vue'
import VueQuillEditor from 'vue-quill-editor' // 注册富文本编辑器
import CoverImage from './publish/cover-image.vue'
import SelectImage from './publish/select-image.vue'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
  install: function (Vue) {
    // 注册全局组件 Vue
    Vue.component('layout-aside', LayoutAside)
    Vue.component('layout-header', LayoutHeader)
    Vue.component('bread-crumb', BreadCrumb) // 注册面包屑组件
    // 注册 富文本编辑器 可以在任意位置使用了
    Vue.use(VueQuillEditor)
    Vue.component('cover-image', CoverImage)
    Vue.component('select-image', SelectImage)
  }
}
