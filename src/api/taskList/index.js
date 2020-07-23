import request from '@/utils/request'

export default {
  getTaskList(query) {
    return request({
      url: '/getTaskList/',
      method: 'get',
      params: query
    })
  },

  deleteSent(id) {
    return request({
      url: '/deleteSent',
      method: 'get',
      params: { id }
    })
  },

  updateTask(data) {
    return request({
      url: '/updateTask',
      method: 'post',
      data
    })
  }
}
