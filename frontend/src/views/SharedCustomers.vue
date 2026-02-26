<template>
  <div class="shared-customers-container">
    <el-container style="height: 100vh; border: 1px solid #eee;">
      <el-aside width="200px" style="background-color: #5470c6;">
        <el-menu
          default-active="3"
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
            <h1 style="margin: 0; font-size: 18px; line-height: 60px; padding-left: 20px;">共享客户</h1>
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
                <span>其他分公司共享的客户</span>
              </div>
            </template>
            <el-table :data="sharedCustomers" style="width: 100%">
              <el-table-column prop="name" label="客户名称" width="150"></el-table-column>
              <el-table-column prop="contactPerson" label="联系人" width="120"></el-table-column>
              <el-table-column prop="contactPhone" label="联系电话" width="150"></el-table-column>
              <el-table-column prop="industry" label="行业" width="120"></el-table-column>
              <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="ownerBranchName" label="所属分公司" width="150"></el-table-column>
              <el-table-column prop="shareTime" label="分享时间" width="180"></el-table-column>
              <el-table-column label="操作" width="150">
                <template #default="{ row }">
                  <el-button size="small" type="primary" @click="handleReclaim(row)">捡回</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-main>
      </el-container>
    </el-container>

    <!-- 捡回客户对话框 -->
    <el-dialog v-model="reclaimDialogVisible" title="捡回客户" width="500px">
      <el-form :model="reclaimForm" :rules="reclaimRules" ref="reclaimFormRef" label-width="100px">
        <el-form-item label="客户名称">
          <el-input v-model="reclaimForm.customerName" disabled></el-input>
        </el-form-item>
        <el-form-item label="捡回原因" prop="reason">
          <el-input type="textarea" v-model="reclaimForm.reason" placeholder="请输入捡回原因"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reclaimDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleReclaimSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { House, User, Share, Clock, Setting, SwitchButton } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const user = ref(JSON.parse(localStorage.getItem('user')))
const userAvatar = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')

const sharedCustomers = ref([])
const reclaimDialogVisible = ref(false)
const reclaimFormRef = ref(null)
const currentCustomer = ref(null)

const reclaimForm = reactive({
  customerName: '',
  reason: ''
})

const reclaimRules = {
  reason: [{ required: true, message: '请输入捡回原因', trigger: 'blur' }]
}

const getStatusType = (status) => {
  const statusMap = {
    potential: '',
    following: 'warning',
    closed: 'success',
    abandoned: 'info'
  }
  return statusMap[status] || ''
}

const getStatusText = (status) => {
  const statusMap = {
    potential: '潜在客户',
    following: '跟进中',
    closed: '已成交',
    abandoned: '已放弃'
  }
  return statusMap[status] || status
}

const loadSharedCustomers = async () => {
  // 模拟数据
  sharedCustomers.value = [
    {
      id: 3,
      name: '苏州制造公司',
      contactPerson: '王五',
      contactPhone: '13700137000',
      email: 'wangwu@example.com',
      address: '苏州市吴中区',
      industry: '制造',
      requirements: '需要生产管理系统',
      status: 'potential',
      ownerBranchName: '销售部',
      shareTime: '2026-02-13 10:30:00'
    },
    {
      id: 4,
      name: '苏州服务公司',
      contactPerson: '赵六',
      contactPhone: '13600136000',
      email: 'zhaoliu@example.com',
      address: '苏州市相城区',
      industry: '服务',
      requirements: '需要客户管理系统',
      status: 'following',
      ownerBranchName: '市场部',
      shareTime: '2026-02-12 15:20:00'
    }
  ]
}

const handleReclaim = (row) => {
  currentCustomer.value = row
  reclaimForm.customerName = row.name
  reclaimForm.reason = ''
  reclaimDialogVisible.value = true
}

const handleReclaimSubmit = async () => {
  if (!reclaimFormRef.value) return
  
  try {
    await reclaimFormRef.value.validate()
    
    // 模拟捡回客户
    const index = sharedCustomers.value.findIndex(c => c.id === currentCustomer.value.id)
    if (index !== -1) {
      sharedCustomers.value.splice(index, 1)
    }
    
    ElMessage.success('捡回申请已提交，等待原分公司审批')
    reclaimDialogVisible.value = false
  } catch (error) {
    console.error('捡回失败:', error)
  }
}

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
  loadSharedCustomers()
})
</script>

<style scoped>
.shared-customers-container {
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
