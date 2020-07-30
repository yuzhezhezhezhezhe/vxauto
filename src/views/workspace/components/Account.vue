<template>
  <el-form>
    <el-form-item label="空间名">
      <el-input :disabled="true" v-model.trim="url" />
    </el-form-item>
    <el-form-item label="原密码">
      <el-input v-model.trim="user.oldpwd" />
    </el-form-item>
    <el-form-item label="新密码">
      <el-input v-model.trim="user.newpwd" placeholder="初始密码为空" />
    </el-form-item>
    <el-form-item>
      <el-button :loading="loading" type="primary" @click="submit">更新信息</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import api from '@/api'
import store from '@/store'

export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          oldpwd: '',
          newpwd: ''
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      userForm: {
        oldpwd: '',
        newpwd: ''
      },
      reg: /^[A-Za-z0-9]{6,18}$/,
      url: store.getters.url
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    submit() {
      this.$confirm('重置密码后需要重新访问工作空间并重置tokenId, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (!this.reg.test(this.user.newpwd) || !this.reg.test(this.user.oldpwd) || !this.reg.test(this.user.name)) {
          this.$notify({
            title: 'Error',
            message: '用户名密码仅支持6-18位以上大小写字符/数字！',
            type: 'danger',
            duration: 2000
          })
          return
        }
        const tempData = Object.assign({}, this.user)
        api.Workspace.update(tempData).then(() => {
          this.loading = false
          this.logout()
          this.dialogFormVisible = false
          this.$notify({
            title: 'Success',
            message: '操作成功,刷新后重新登录！',
            type: 'success',
            duration: 2000
          })
        }).catch(err => {
          this.loading = false
          this.$notify({
            title: 'Error',
            message: err.message,
            type: 'danger',
            duration: 2000
          })
        })
      }).catch(() => {})
    }
  }
}
</script>
