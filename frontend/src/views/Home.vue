<template>
  <div class="home-container">
    <el-container style="height: 100vh; border: 1px solid #eee;">
      <el-aside width="200px" style="background-color: #5470c6;">
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          @select="handleMenuSelect"
          background-color="#5470c6"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item index="1">
            <el-icon><House /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="2">
            <el-icon><User /></el-icon>
            <span>客户管理</span>
          </el-menu-item>
          <el-menu-item index="3">
            <el-icon><Share /></el-icon>
            <span>共享客户</span>
          </el-menu-item>
          <el-menu-item index="4">
            <el-icon><Clock /></el-icon>
            <span>跟进管理</span>
          </el-menu-item>
          <el-menu-item index="5">
            <el-icon><Setting /></el-icon>
            <span>系统设置</span>
          </el-menu-item>
          <el-menu-item index="6" @click="handleLogout">
            <el-icon><SwitchButton /></el-icon>
            <span>退出登录</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header style="padding: 0; background-color: #fff; border-bottom: 1px solid #eee;">
          <div class="header-content">
            <h1 style="margin: 0; font-size: 18px; line-height: 60px; padding-left: 20px;">客户信息共享平台</h1>
            <div class="user-info">
              <span>{{ user?.username }}</span>
              <el-avatar :size="32" :src="userAvatar"></el-avatar>
            </div>
          </div>
        </el-header>
        <el-main style="padding: 20px;">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>系统概览</span>
              </div>
            </template>
            <div class="dashboard">
              <el-row :gutter="20">
                <el-col :xs="24" :sm="12" :md="8" :lg="6">
                  <el-card class="stats-card">
                    <div class="stats-content">
                      <div class="stats-number">{{ totalCustomers }}</div>
                      <div class="stats-label">总客户数</div>
                    </div>
                  </el-card>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="6">
                  <el-card class="stats-card">
                    <div class="stats-content">
                      <div class="stats-number">{{ sharedCustomers }}</div>
                      <div class="stats-label">共享客户数</div>
                    </div>
                  </el-card>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="6">
                  <el-card class="stats-card">
                    <div class="stats-content">
                      <div class="stats-number">{{ pendingFollowUps }}</div>
                      <div class="stats-label">待跟进客户</div>
                    </div>
                  </el-card>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="6">
                  <el-card class="stats-card">
                    <div class="stats-content">
                      <div class="stats-number">{{ totalBranches }}</div>
                      <div class="stats-label">分公司数</div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
              <div class="recent-activities">
                <h3>最近活动</h3>
                <el-timeline>
                  <el-timeline-item
                    v-for="(activity, index) in recentActivities"
                    :key="index"
                    :timestamp="activity.time"
                  >
                    {{ activity.content }}
                  </el-timeline-item>
                </el-timeline>
              </div>
            </div>
          </el-card>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { House, User, Share, Clock, Setting, SwitchButton } from '@element-plus/icons-vue'

const router = useRouter()
const user = ref(JSON.parse(localStorage.getItem('user')))
const userAvatar = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')

// 模拟数据
const totalCustomers = ref(128)
const sharedCustomers = ref(36)
const pendingFollowUps = ref(24)
const totalBranches = ref(5)

const recentActivities = ref([
  { content: '客户A被分享到销售部', time: '2026-02-13 10:30' },
  { content: '客户B被市场部捡回', time: '2026-02-13 09:15' },
  { content: '客户C跟进记录更新', time: '2026-02-12 16:45' },
  { content: '新增客户D', time: '2026-02-12 14:20' }
])

const handleMenuSelect = (key) => {
  switch (key) {
    case '1':
      router.push('/')
      break
    case '2':
      router.push('/customers')
      break
    case '3':
      router.push('/shared-customers')
      break
    case '4':
      router.push('/follow-up')
      break
    case '5':
      router.push('/admin')
      break
  }
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

onMounted(() => {
  // 这里可以添加获取真实数据的API调用
})
</script>

<style scoped>
.home-container {
  height: 100vh;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dashboard {
  margin-top: 20px;
}

.stats-card {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stats-content {
  text-align: center;
}

.stats-number {
  font-size: 24px;
  font-weight: bold;
  color: #5470c6;
  margin-bottom: 8px;
}

.stats-label {
  font-size: 14px;
  color: #606266;
}

.recent-activities {
  margin-top: 30px;
}

.recent-activities h3 {
  margin-bottom: 20px;
  color: #303133;
}
</style>
