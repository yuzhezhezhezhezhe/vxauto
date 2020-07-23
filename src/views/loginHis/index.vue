<template>
  <div class="app-container">
<!--    <div class="filter-container">-->
<!--      <el-input v-model="listQuery.keywords" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />-->
<!--      <el-select v-model="listQuery.key" placeholder="Type" clearable class="filter-item" style="width: 130px">-->
<!--        <el-option v-for="item in pointConvertOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />-->
<!--      </el-select>-->
<!--      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">-->
<!--        Search-->
<!--      </el-button>-->
<!--    </div>-->

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="Id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="访问地址">
        <template slot-scope="scope">
          <span v-if="scope.row.ip !== ''">{{ scope.row.ip }} {{ scope.row.address }}</span>
          <span v-else>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="访问时间">
        <template slot-scope="scope">
          <span>{{ scope.row.created | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>
<script>
import api from '@/api'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import axios from 'axios'

const pointConvertOptions = [
  { key: 'uuid', display_name: 'TradeId' },
  { key: 'ip', display_name: '访客IP' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const pointConvertKeyValue = pointConvertOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'InlineEditTable',
  directives: { waves },
  components: { Pagination },
  filters: {
    typeFilter(type) {
      return pointConvertKeyValue[type]
    },
    statusFilter(status) {
      const statusMap = {
        积分: '',
        红包: 'warning'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      pointConvertOptions,
      list: null,
      ipMap: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        keywords: undefined,
        key: undefined
      },
      temp: {
        id: undefined,
        point: undefined,
        memberid: undefined,
        message: '',
        crttime: new Date(),
        status: ''
      },
      textMap: {
        update: 'Edit'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      statusOptions: ['已兑换', '已拒绝'],
      isCreate: false,
      address: ''
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.key != null && vm.isCreate) {
        vm.getListByPc(to.params)
      }
    })
  },
  created() {
    if (this.$route.params.key != null) {
      this.getListByPc(this.$route.params)
    } else {
      this.getList()
    }
    this.isCreate = true
  },
  methods: {
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    async getList() {
      this.listLoading = true
      const { data } = await api.LoginHis.getLoginHis(this.listQuery)
      const items = data.dataList
      this.total = data.pager.recordCount
      this.list = items.map(v => {
        this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
        v.originalTitle = v.title //  will be used when user click the cancel botton
        return v
      })
      this.listLoading = false
      this.addressGet(this.list)
    },
    async getListByPc(params) {
      this.listLoading = true
      const { data } = await api.VisitorLogs.list(params)
      const items = data.dataList
      this.total = data.pager.recordCount
      this.list = items.map(v => {
        this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
        v.originalTitle = v.title //  will be used when user click the cancel botton
        return v
      })
      this.listLoading = false
      this.addressGet(this.list)
    },
    async addressGet(arr) {
      for (const item of arr) {
        if (item.ip !== '') {
          const itemArr = this.list.filter(x => x.ip === item.ip && x.address !== undefined)
          if (itemArr.length !== 0) {
            item.address = itemArr[0].address
            for (const v of this.list) {
              if (v.id === item.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, item)
                break
              }
            }
          } else {
            await axios.get('https://restapi.amap.com/v3/ip?key=a4f9a2b7be847772349b133d0e77f424&ip=' + item.ip, '', { timeout: 1000 * 60 * 2 }).then((resp) => {
              item.address = resp.data.province + ' ' + resp.data.city
            }).catch((resp) => {
              console.log('请求失败：' + resp.data.status + ',' + resp.data.info)
              item.address = ''
            })
            for (const v of this.list) {
              if (v.id === item.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, item)
                break
              }
            }
          }
        }
      }
    }
  }
}
</script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
