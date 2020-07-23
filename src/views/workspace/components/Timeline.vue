<template>
  <div class="block">
    <el-timeline v-loading.fullscreen.lock="loading" element-loading-text="拼命加载中" element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-timeline-item v-for="(item,index) of timeline" :key="index" :timestamp="item.timestamp" placement="top">
        <el-card>
          <h4>{{ item.title }}</h4>
          <p>{{ item.content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import api from '@/api'
import { Message } from 'element-ui'

export default {
  data() {
    return {
      loading: false,
      timeline: [
        // {
        //   timestamp: '2019/4/20',
        //   title: 'Update Github template',
        //   content: 'PanJiaChen committed 2019/4/20 20:46'
        // },
        // {
        //   timestamp: '2019/4/21',
        //   title: 'Update Github template',
        //   content: 'PanJiaChen committed 2019/4/21 20:46'
        // },
        // {
        //   timestamp: '2019/4/22',
        //   title: 'Build Template',
        //   content: 'PanJiaChen committed 2019/4/22 20:46'
        // },
        // {
        //   timestamp: '2019/4/23',
        //   title: 'Release New Version',
        //   content: 'PanJiaChen committed 2019/4/23 20:46'
        // }
      ]
    }
  },
  created() {
    this.loading = false
    this.getTimeline()
  },
  methods: {
    async getTimeline() {
      const { data } = await api.Tool.commitMessage().catch((error) => {
        this.loading = false
        Message({
          message: error.message,
          type: 'error',
          duration: 5 * 1000
        })
      })
      this.timeline = data.data
      this.loading = false
    }
  }
}
</script>
