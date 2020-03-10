import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home'
import Login from '../views/login'
// 引入二级路由组件
import SecondHome from '@/views/home/second_home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '*', // 所有找不到家的孩子都来吧
    component: () => import('@/views/404')
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    // 在一级路由表下配置二级路由
    children: [
      {
        path: '', // 二级路由路径为空，代表二级路由的默认组件
        component: SecondHome // 默认的二级路由组件
      }, {
        // 配置评论列表二级路由
        path: 'comment', // 地址
        component: () => import('@/views/comment') // 按需加载的组件
      }, {
        // 配置素材管理二级路由
        path: 'material', // 地址
        component: () => import('@/views/material')
      }, {
        // 配置文章列表二级路由
        path: 'articles', // 地址
        component: () => import('@/views/articles')
      }, {
        // 配置发布文章二级路由
        path: 'publish/:articleId?', // 地址
        component: () => import('@/views/publish')
      }, {
        // 配置个人信息二级路由
        path: 'account', // 地址
        component: () => import('@/views/account')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }

]

const router = new VueRouter({
  routes
})

export default router
