<template>
  <div class="user-activity">
    <h5 style="font-size: 22px;color: #2f3033;">邀请好友</h5>

    <p class="text-muted">邀请好友注册，符合奖励标准的邀请人（累计充值满1万），可获得邀请用户充值积分0.4%奖返。</p>

    <div class="filter-container">
      <el-input v-model="inputData" disabled="disabled" placeholder="Please input" style="width:400px;max-width:100%;" />
      <el-button type="primary" icon="el-icon-share" @click="handleCopy(inputData,$event)">
        复制邀请链接
      </el-button>
    </div>

    <div class="post">
      <p style="font-size:17px;">邀请列表</p>

      <el-table v-loading="listLoading" :data="list" fit style="width: 100%">
        <el-table-column align="center" label="受邀客户邮件">
          <template slot-scope="scope">
            <span>{{ scope.row.uname }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="注册时间">
          <template slot-scope="scope">
            <span>{{ scope.row.created | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import clip from '@/utils/clipboard' // use clipboard directly
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import api from '@/api'

const Base64 = require('js-base64').Base64

export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        true: 'success',
        false: ''
      }
      return statusMap[status]
    }
  },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          avatar: '',
          point: 0,
          roles: ''
        }
      }
    }
  },
  data() {
    return {
      inputData: window.location.protocol + '//' + window.location.host + '/index.html#/login?t=' + Base64.encode(this.user.name).split('=')[0],
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 5,
        keywords: undefined,
        key: undefined
      },
      key: 1
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleCopy(text, event) {
      clip(text, event)
      this.$message({
        type: 'success',
        message: '复制成功'
      })
    },
    async getList() {
      this.listLoading = true
      const { data } = await api.Setting.recommend(this.listQuery)
      const items = data.dataList
      this.total = data.pager.recordCount
      this.list = items.map(v => {
        this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
        v.originalTitle = v.title //  will be used when user click the cancel botton
        return v
      })
      this.listLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .user-activity {
    .user-block {

      .username,
      .description {
        display: block;
        margin-left: 50px;
        padding: 2px 0;
      }

      .username{
        font-size: 16px;
        color: #000;
      }

      :after {
        clear: both;
      }

      .img-circle {
        border-radius: 50%;
        width: 40px;
        height: 40px;
        float: left;
      }

      span {
        font-weight: 500;
        font-size: 12px;
      }
    }

    .post {
      font-size: 14px;
      border-bottom: 1px solid #d2d6de;
      margin-bottom: 15px;
      padding-bottom: 15px;
      color: #666;

      .image {
        width: 100%;
        height: 100%;

      }

      .user-images {
        padding-top: 20px;
      }
    }

    .list-inline {
      padding-left: 0;
      margin-left: -5px;
      list-style: none;

      li {
        display: inline-block;
        padding-right: 5px;
        padding-left: 5px;
        font-size: 13px;
      }

      .link-black {

        &:hover,
        &:focus {
          color: #999;
        }
      }
    }

  }

  .box-center {
    margin: 0 auto;
    display: table;
  }

  .text-muted {
    color: #777;
  }
</style>
