<template>
  <div class="app-container">
    <div v-if="user">
      <el-row>
        <el-col>
          <el-card style="height: 700px">
            <el-tabs v-model="activeTab">
              <el-tab-pane label="自定义工作空间" name="workspace">
                <workspace :user="user" />
              </el-tab-pane>
              <el-tab-pane label="修改密码" name="account">
                <account :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Workspace from './components/Workspace'
// import Timeline from './components/Timeline'
import Account from './components/Account'
// import Recommend from './components/Recommend'

export default {
  name: 'Profile',
  components: { Workspace, Account },
  data() {
    return {
      user: {},
      activeTab: 'workspace'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'point',
      'avatar',
      'roles'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      // this.user = {
      //   name: this.name,
      //   point: this.point,
      //   role: this.roles.join(' | '),
      //   email: '',
      //   avatar: this.avatar
      // }
    }
  }
}
</script>
