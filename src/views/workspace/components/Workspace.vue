<template>
  <div class="createPost-container">
    <div style="text-align: right">
      <el-button style="width: 6%; text-align: center;" type="info" icon="el-icon-star-off" size="mini" :loading="loading" @click="customizeShow()">
        自定义
      </el-button>
    </div>
    <div style="text-align: center; margin-top: 110px" class="createPost-main-container">
      <el-row>
        <el-col :span="24">
          <P style="color: #606266; font-weight: 700; font-size: 17px" />
          <div class="tip" style="background-color: #ffffff"><p>链接是用户唯一标识，请不要泄露他人 <br><br>链接一经生成即为个人的工作空间，将链接复制进手机即可<br></p></div>
          <el-input
            v-model="url"
            :autosize="{ minRows: 1, maxRows: 4}"
            type="input"
            style="width: 40%; text-align: center;"
            :readonly="true"
          />
        </el-col>
      </el-row>
    </div>

    <div slot="footer" class="dialog-footer" style="width: 100%; text-align: center">
      <el-button style="width: 12%; text-align: center; margin-top: 20px" type="primary" :loading="loading" @click="createUrl()">
        生成新的链接
      </el-button>
    </div>

    <el-dialog :visible.sync="dialogFormVisible" title="自定义链接">
      <div class="user-bio-section-header"><span style="color: rgb(144, 147, 153); font-size: 26px;font-weight: 500 !important; "></span></div>
      <el-form ref="fromData" :model="fromData" :rules="rules" label-position="top" label-width="110px" style="width: 600px; margin-left:50px;">
        <el-form-item label="自定义后缀" prop="uuid">
          <el-input v-model="fromData.uuid" :autosize="{ minRows: 4, maxRows: 6}" maxlength="7" show-word-limit type="text" placeholder="仅支持7位字母或数字，区分大小写">
            <template slot="prepend"> {{ this.url.substring(0,this.url.lastIndexOf("/")) + '/' }}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="原密码">
          <el-input v-model.trim="fromData.oldpwd" />
        </el-form-item>
        <el-form-item label="新密码" prop="newpwd">
          <el-input v-model.trim="fromData.newpwd" placeholder="初始密码为空" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="customizeUrl()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store'
import api from '@/api'
export default {
  // props: {
  //   user: {
  //     type: Object,
  //     default: () => {
  //       return {
  //         oldpwd: '',
  //         newpwd: ''
  //       }
  //     }
  //   }
  // },
  filters: {

  },
  data() {
    var checkUuid = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('后缀不能为空'))
      }
      setTimeout(() => {
        var reg = /^[0-9a-zA-Z]+$/
        if (!reg.test(value)) {
          callback(new Error('只能输入数字或字母'))
        } else {
          if (value.toString().length !== 7) {
            callback(new Error('长度必须为7位'))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    var checkPassWord = (rule, value, callback) => {
      // if (!value) {
      //   return callback(new Error('后缀不能为空'))
      // }
      setTimeout(() => {
        var reg = /^[A-Za-z0-9]{6,18}$/
        if (!reg.test(value) && value) {
          callback(new Error('用户名密码仅支持6-18位以上大小写字符/数字！'))
        } else {
          callback()
        }
      }, 1000)
    }
    return {
      url: store.getters.url,
      loading: false,
      dialogFormVisible: false,
      fromData: {
        uuid: '',
        oldpwd: '',
        newpwd: ''
      },
      reg: /^[A-Za-z0-9]{6,18}$/,
      rules: {
        uuid: [
          { validator: checkUuid, trigger: 'blur' }
        ],
        newpwd: [
          { validator: checkPassWord, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
  },
  methods: {
    createUrl() {
      this.$confirm('确认替换生成新的链接, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.Workspace.updateUuid().then((res) => {
          this.url = res.data
          this.$notify({
            title: 'Success',
            message: '操作成功！',
            type: 'success',
            duration: 2000
          })
        }).catch(err => {
          this.$notify({
            title: 'Error',
            message: err.message,
            type: 'danger',
            duration: 2000
          })
        })
      }).catch(() => {})
    },
    customizeShow() {
      this.fromData.uuid = ''
      this.fromData.newpwd = ''
      this.fromData.oldpwd = ''
      this.dialogFormVisible = true
    },
    customizeUrl() {
      this.$refs['fromData'].validate((valid) => {
        if (valid) {
          api.Workspace.updateUuid(this.fromData.uuid, this.fromData.oldpwd, this.fromData.newpwd).then((res) => {
            this.url = res.data
            this.$notify({
              title: 'Success',
              message: '操作成功！',
              type: 'success',
              duration: 2000
            })
            this.dialogFormVisible = false
          }).catch(err => {
            this.$notify({
              title: 'Error',
              message: err.message,
              type: 'danger',
              duration: 2000
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .tip {
    padding: 8px 16px;
    background-color: #ecf8ff;
    border-radius: 4px;
    border-left: 5px solid #FFFFFF;
    margin: 20px 0;
  }
</style>
