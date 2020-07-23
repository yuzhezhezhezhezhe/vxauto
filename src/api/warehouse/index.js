import request from '@/utils/request'

export default {
  getJDwarehouse(query) {
    return request({
      url: '/getKuaiBao/',
      method: 'get',
      params: query
    })
  },

  createTask(data) {
    return request({
      url: '/createTask',
      method: 'post',
      data
    })
  }
}
