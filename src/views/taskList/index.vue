<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keywords" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.key" placeholder="Type" clearable class="filter-item" style="width: 130px;margin-left: 5px">
        <el-option v-for="item in pointConvertOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" style="margin-left: 5px" @click="handleFilter">
        Search
      </el-button>
      <el-button v-waves class="filter-item" type="primary" style="margin-left: 5px" @click="customizeTask">
        自定义添加任务
      </el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column align="center" label="ID" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="标题">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="680"
            trigger="hover"
            :content="scope.row.title"
          >
            <span slot="reference">{{ scope.row.title.toString().substring(0,48)+ '   ...' }}</span>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column align="center" label="评论">
        <template slot-scope="scope">
          <div>
            <section v-if="scope.row.comment && scope.row.comment.length > 0">
              <el-popover
                v-for="(src,index) in scope.row.comment"
                :key="index"
                placement="top-start"
                width="680"
                trigger="hover"
                :content="src"
              >
                <span slot="reference" style="width:100px; height: 100px;margin-right: 10px;">{{ src }} &nbsp;&nbsp;&nbsp; </span>
              </el-popover>
            </section>
            <span v-else>暂无评论</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="图片" style="width: 100px;height: 100px;overflow: auto;">
        <template slot-scope="scope">
          <div style="overflow: scroll; overflow-y: hidden; overflow-x: auto; white-space: nowrap;">
            <section v-if="scope.row.fengmian && scope.row.fengmian.length > 0">
              <el-image v-for="(src,index) in scope.row.fengmian" :key="index" :src="src" style="width:100px; height: 100px;margin-right: 10px;" />
            </section>
            <span v-else>暂无图片</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" label="来源" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="发送状态" width="100px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">
            {{ scope.row.status === 1? '未发送' : scope.row.status === 2? '发送失败' : '已发送' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="预计发送时间" width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.senttime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="实际发送时间" width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.updated }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="200">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status === 1"
            round
            :loading="loading"
            type="primary"
            size="mini"
            @click="addSent(scope.row)"
          >
            编辑
          </el-button>
          <el-button v-if="scope.row.status === 1" round size="mini" type="success" @click="deleteSent(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="添加待发送列表" :visible.sync="dialogFormVisible">
      <el-form ref="sentDataForm" :model="sentDataForm" label-position="top" label-width="110px" style="width: 600px; margin-left:50px;">
        <el-form-item label="标题">
          <el-input v-model="sentDataForm.title" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" placeholder="Please input" />
        </el-form-item>
        <el-form-item v-for="(comment, index) in sentDataForm.comment" :key="comment.key" :label="'待评论内容' + (index + 1)">
          <el-row>
            <el-col :span="20">
              <el-input v-model="sentDataForm.comment[index]" type="textarea" :autosize="{ minRows: 4, maxRows: 6}" />
            </el-col>
            <el-col :span="4">
              <el-button style="margin-left: 10px;" @click.prevent="removeComment(comment)">删除</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-button @click="addComment">添加评论</el-button>
        <el-form-item label="预计发送时间" prop="timestamp">
          <el-date-picker v-model="sentDataForm.sentTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="图片">
          <div class="editor-container">
            <dropzone :key="key" :defaultImg="sentDataForm.imgList" id="myVueDropzone" url="https://upload-z2.qiniup.com" @dropzone-removedFile="dropzoneR" @dropzone-success="dropzoneS" />
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" :loading="sendDialogFormVisible" @click="sentDataForm.id === null? createTask():updateTask()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Dropzone from '@/components/Dropzone'

const pointConvertOptions = [
  { key: 'id', display_name: 'Id' },
  { key: 'title', display_name: '标题' },
  { key: 'comment', display_name: '评论' },
  { key: 'type', display_name: '来源' },
  { key: 'status', display_name: '发送状态(1未发送，0已发送，2发送失败)' }
]
// arr to obj, such as { CN : "China", US : "USA" }
const pointConvertKeyValue = pointConvertOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
export default {
  name: 'InlineEditTable',
  directives: { waves },
  components: { Pagination, Dropzone },
  filters: {
    typeFilter(type) {
      return pointConvertKeyValue[type]
    },
    statusFilter(status) {
      const statusMap = {
        1: '',
        0: 'success',
        2: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      key: 0,
      // 初始图片
      fileList: [{ name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }, { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }],
      // fileList: ['https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100', 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'],
      pointConvertOptions,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        keywords: undefined,
        key: undefined
      },
      imgList: [],
      temp: {

      },
      dialogFormVisible: false,
      sendDialogFormVisible: false,
      dialogStatus: '',
      statusOptions: [false, true],
      loading: false,
      sendLoading: false,
      sendTotal: 100,
      tempList: [],
      sendText: '',
      isCreate: false,
      sentDataForm: {
        title: '',
        type: '',
        comment: [],
        imgList: [],
        sentTime: '',
        id: ''
      },
      imgUrl: []
    }
  },
  watch: {
    'dialogFormVisible'(newVal, oldVal) {
      if (!newVal) {
        this.fileList = []
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.key != null && vm.isCreate) {
        vm.listQuery = to.params
        vm.getList()
      }
    })
  },
  created() {
    if (this.$route.params.key != null) {
      this.listQuery = this.$route.params
    }
    this.getList()
    this.isCreate = true
  },
  methods: {
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    async getList() {
      this.listLoading = true
      const { data } = await api.TaskList.getTaskList(this.listQuery)
      const items = data.dataList
      this.total = data.pager.recordCount
      this.list = items.map(v => {
        this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
        v.originalTitle = v.title //  will be used when user click the cancel botton
        return v
      })
      this.listLoading = false
    },
    deleteSent(row) {
      this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.TaskList.deleteSent(row.id).then((res) => {
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
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
      })
    },
    addSent(row) {
      this.key += 1
      this.dialogFormVisible = true
      this.sentDataForm.comment = []
      this.sentDataForm.title = row.title
      this.sentDataForm.type = row.type
      this.sentDataForm.imgList = row.fengmian
      this.sentDataForm.sentTime = new Date()
      this.sentDataForm.comment = row.comment
      this.sentDataForm.id = row.id
      this.imgUrl = []
      for (const v of row.fengmian) {
        this.imgUrl.push(v)
      }
      this.$nextTick(() => {
        this.$refs['sentDataForm'].clearValidate()
      })
      // this.fileList = []
      // row.fengmian.forEach(x => this.fileList.push({ name: x.substring(5), url: x }))
    },
    dropzoneS(file) {
      // console.log(file)
      // this.temp.fengmian.push(file.key)
      // this.sentDataForm.imgList.push(file.key)
      this.imgUrl.push(file.key)
      // console.log(this.sentDataForm)
      this.$message({ message: 'Upload success', type: 'success' })
    },
    dropzoneR(file) {
      console.log(file)
      let t = ''
      if (file.key === null || file.key === '' || file.key === undefined) {
        t = file.url
      } else {
        t = file.key
      }
      // var index = this.temp.fengmian.indexOf(t)
      var index = this.imgUrl.indexOf(t)
      if (index !== -1) {
        // this.temp.fengmian.splice(index, 1)
        this.imgUrl.splice(index, 1)
      }
      console.log(this.sentDataForm)
      this.$message({ message: 'Delete success', type: 'success' })
    },
    handlePictureCardPreview(file) {
      this.fileList = file.url
    },
    createTask() {
      this.$refs['sentDataForm'].validate((valid) => {
        if (valid) {
          this.sendDialogFormVisible = true
          this.temp.comment = ''
          for (const x of this.sentDataForm.comment) {
            this.temp.comment += x + ','
          }
          // const tempData = Object.assign({}, this.temp)
          for (let i = 0; i < this.imgUrl.length; i++) {
            if (this.imgUrl[i].indexOf('http') === -1) {
              this.imgUrl[i] = 'http://cdn.vxauto.thegun.cn/' + this.imgUrl[i]
            }
          }
          this.sentDataForm.imgList = this.imgUrl
          const tempData = Object.assign({}, this.sentDataForm)
          api.Warehouse.createTask(tempData).then((data) => {
            this.sendDialogFormVisible = false
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '操作成功！',
              type: 'success',
              duration: 2000
            })
            this.list.unshift(data.data)
          }).catch(err => {
            this.sendDialogFormVisible = false
            this.$notify({
              title: 'Error',
              message: err.message,
              type: 'danger',
              duration: 2000
            })
          })
        }
      })
    },
    updateTask() {
      this.$refs['sentDataForm'].validate((valid) => {
        if (valid) {
          this.sendDialogFormVisible = true
          this.temp.comment = ''
          for (const x of this.sentDataForm.comment) {
            this.temp.comment += x + ','
          }
          // const tempData = Object.assign({}, this.temp)
          for (let i = 0; i < this.imgUrl.length; i++) {
            if (this.imgUrl[i].indexOf('http') === -1) {
              this.imgUrl[i] = 'http://cdn.vxauto.thegun.cn/' + this.imgUrl[i]
            }
          }
          this.sentDataForm.imgList = this.imgUrl
          const tempData = Object.assign({}, this.sentDataForm)
          api.TaskList.updateTask(tempData).then((data) => {
            this.sendDialogFormVisible = false
            this.dialogFormVisible = false
            for (const v of this.list) {
              if (v.id === this.sentDataForm.id) {
                this.temp = data.data
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.$notify({
              title: 'Success',
              message: '操作成功！',
              type: 'success',
              duration: 2000
            })
          }).catch(err => {
            this.sendDialogFormVisible = false
            this.$notify({
              title: 'Error',
              message: err.message,
              type: 'danger',
              duration: 2000
            })
          })
        }
      })
    },
    customizeTask() {
      this.key += 1
      this.dialogFormVisible = true
      this.sentDataForm.comment = []
      this.sentDataForm.title = ''
      this.sentDataForm.type = ''
      this.sentDataForm.imgList = []
      this.sentDataForm.sentTime = new Date()
      this.sentDataForm.id = null
      this.imgUrl = []
      this.$nextTick(() => {
        this.$refs['sentDataForm'].clearValidate()
      })
    },
    addComment() {
      this.sentDataForm.comment.push('')
    },
    removeComment(item) {
      var index = this.sentDataForm.comment.indexOf(item)
      if (index !== -1) {
        this.sentDataForm.comment.splice(index, 1)
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
  .editor-container{
    position: relative;
    height: 100%;
  }
</style>
