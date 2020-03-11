// 这个模块专门处理咱们的页面素材请求

import request from '@/utils/request'

// 导出若干个方法
export function getMaterial (params) {
  // 请求调用 返回结果
  return request({
    url: '/user/images',
    params
  })
}
