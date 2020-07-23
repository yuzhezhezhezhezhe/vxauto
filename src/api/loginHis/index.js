import request from '@/utils/request'

export default {
  getLoginHis(query) {
    return request({
      url: '/getLoginHis/',
      method: 'get',
      params: query
    })
  }
}
