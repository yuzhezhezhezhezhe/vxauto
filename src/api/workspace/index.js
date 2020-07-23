import request from '@/utils/request'

export default {
  updateUuid(uuid) {
    return request({
      url: '/updateUuid/',
      method: 'get',
      params: { uuid: uuid }
    })
  },
  update(data) {
    return request({
      url: '/user/update',
      method: 'post',
      data
    })
  }
}
