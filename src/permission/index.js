// 本文件专门处理路由权限的问题
import router from '@/router'
import progress from 'nprogress' // 引入进度条包
import 'nprogress/nprogress.css' // 引入样式文件
// 注册全局的路由前置守卫
router.beforeEach(function (to, from, next) {
  // 路由变化，开启进度条
  progress.start()

  // 回调函数会在路由发生改变之前执行
  //   next() // next没有参数，表示直接允许本次路由请求
  //   next(false) // 表示阻止本次跳转
  //   next(新地址) // 表示改变原本轨迹，跳转到新的地方
  // 1.首先判断需要拦截哪些页面，如果页面以/home开头，就需要进行token判断
  // 2.判断to要去的页面是否以/home开头
  if (to.path.startsWith('/home')) {
    // 判断是否要去主页相关的页面，是的话进入if
    const token = window.localStorage.getItem('user-token')
    if (token) {
      next() // 放过
    } else {
      next('/login') // 踢回登录页去拿钥匙
    }
  } else {
    // 不是的话进入else
    next() // 直接放过
  }
})

// 在全局后置守卫的位置关闭进度条，此时已经完成了路由的跳转
router.afterEach(() => {
  progress.done()
})
