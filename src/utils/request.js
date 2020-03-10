// 工具文件
// 对axios进行二次封装，配置拦截器
import axios from 'axios'
import router from '@/router' // 引入router
import JSONBig from 'json-bigint' // 引入第三方处理包
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0'// 配置axios的公共请求头地址

// 对axios的返回数据做自定义处理：用json-bigint替换原来的json
axios.defaults.transformResponse = [function (data) {
  // 自带的json处理有问题，我们不用它
  // const result = JSON.parse(data)
  // 用json-bigint来转化
  // 这里需要判断一下，data是否为空
  return data ? JSONBig.parse(data) : {}
}]
// 请求拦截器
axios.interceptors.request.use(function (config) {
  // 成功时执行
// config中有所有axios的请求信息
// 在第一个函数中必须将config配置进行返回，返回之前我们可以配置token
// 1.先获取token
  const token = localStorage.getItem('user-token')
  // 2.统一注入token
  config.headers.Authorization = `Bearer ${token}`
  return config
}, function (error) {
  // 失败时执行
//   axios支持promise，所以reject能直接进入到axios的catch中拿到error
  return Promise.reject(error)
})

// 响应拦截器
axios.interceptors.response.use(function (response) {
// 成功时执行
// 回调函数第一个参数就是响应体，在拦截器中需要将数据返回
// 这里我们对data数据解构
  return response.data ? response.data : {} // 有的接口没有响应数据，所以需要判断
}, function (error) {
// 失败时执行
// error就是错误对象，里面有错误的详细信息
// 401表示：token错误，过期等等，因为导航守卫已经检验了是否有token，所以这里一定是token出了问题
// 解决办法：回login重新登陆获取token，回之前要清除token
  if (error.response.status === 401) {
    localStorage.removeItem('user-token') // 删除token
    // 返回登录页，采用导入router实例，然后编程式路由返回登录页的方法实现
    router.push('/login')
  }
  //   进行错误的处理
  return Promise.reject(error) // catch可以得到错误
})
export default axios
