import request from '@/utils/request'

export default {
  updateUuid(uuid, oldpwd, newpwd) {
    return request({
      url: '/updateUuid/',
      method: 'get',
      params: { uuid: uuid, oldpwd: oldpwd, newpwd: newpwd }
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
