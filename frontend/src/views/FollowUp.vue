<template>
  <div class="follow-up-container">
    <el-container style="height: 100vh; border: 1px solid #eee;">
      <el-aside width="200px" style="background-color: #5470c6;">
        <el-menu
          default-active="4"
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
            <h1 style="margin: 0; font-size: 18px; line-height: 60px; padding-left: 20px;">跟进管理</h1>
            <div class="user-info">
              <span>{{ user?.username }}</span>
              <el-avatar :size="32" :src="userAvatar"></el-avatar>
            </div>
          </div>
        </el-header>
        <el-main style="padding: 20px;">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-card shadow="hover">
                <template #header>
                  <div class="card-header">
                    <span>跟进记录</span>
                  </div>
                </template>
                <el-table :data="followUpRecords" style="width: 100%">
                  <el-table-column prop="customerName" label="客户名称" width="150"></el-table-column>
                  <el-table-column prop="content" label="跟进内容" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="userName" label="跟进人" width="100"></el-table-column>
                  <el-table-column prop="nextFollowUp" label="下次跟进时间" width="180">
                    <template #default="{ row }">
                      {{ row.nextFollowUp ? formatDate(row.nextFollowUp) : '-' }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="createdAt" label="创建时间" width="180">
                    <template #default="{ row }">
                      {{ formatDate(row.createdAt) }}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="150">
                    <template #default="{ row }">
                      <el-button size="small" @click="handleEdit(row)">编辑</el-button>
                      <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="hover">
                <template #header>
                  <div class="card-header">
                    <span>添加跟进记录</span>
                  </div>
                </template>
                <el-form :model="followUpForm" :rules="rules" ref="followUpFormRef" label-width="100px">
                  <el-form-item label="客户" prop="customerId">
                    <el-select v-model="followUpForm.customerId" placeholder="请选择客户" style="width: 100%">
                      <el-option
                        v-for="customer in customers"
                        :key="customer.id"
                        :label="customer.name"
                        :value="customer.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="跟进内容" prop="content">
                    <el-input type="textarea" v-model="followUpForm.content" placeholder="请输入跟进内容"></el-input>
                  </el-form-item>
                  <el-form-item label="下次跟进时间" prop="nextFollowUp">
                    <el-date-picker
                      v-model="followUpForm.nextFollowUp"
                      type="datetime"
                      placeholder="选择日期时间"
                      style="width: 100%"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="handleAdd" style="width: 100%">添加跟进记录</el-button>
                  </el-form-item>
                </el-form>
              </el-card>
              <el-card shadow="hover" style="margin-top: 20px;">
                <template #header>
                  <div class="card-header">
                    <span>待跟进客户</span>
                  </div>
                </template>
                <el-timeline>
                  <el-timeline-item
                    v-for="item in pendingFollowUps"
                    :key="item.id"
                    :timestamp="formatDate(item.nextFollowUp)"
                    placement="top"
                  >
                    <el-card>
                      <h4>{{ item.customerName }}</h4>
                      <p>{{ item.content }}</p>
                    </el-card>
                  </el-timeline-item>
                </el-timeline>
              </el-card>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-container>

    <!-- 编辑跟进记录对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑跟进记录" width="500px">
      <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="100px">
        <el-form-item label="跟进内容" prop="content">
          <el-input type="textarea" v-model="editForm.content" placeholder="请输入跟进内容"></el-input>
        </el-form-item>
        <el-form-item label="下次跟进时间" prop="nextFollowUp">
          <el-date-picker
            v-model="editForm.nextFollowUp"
            type="datetime"
            placeholder="选择日期时间"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleEditSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { House, User, Share, Clock, Setting, SwitchButton } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const user = ref(JSON.parse(localStorage.getItem('user')))
const userAvatar = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')

const followUpRecords = ref([])
const customers = ref([])
const pendingFollowUps = ref([])
const followUpFormRef = ref(null)
const editFormRef = ref(null)
const editDialogVisible = ref(false)
const currentFollowUpId = ref(null)

const followUpForm = reactive({
  customerId: '',
  content: '',
  nextFollowUp: ''
})

const editForm = reactive({
  content: '',
  nextFollowUp: ''
})

const rules = {
  customerId: [{ required: true, message: '请选择客户', trigger: 'change' }],
  content: [{ required: true, message: '请输入跟进内容', trigger: 'blur' }]
}

const editRules = {
  content: [{ required: true, message: '请输入跟进内容', trigger: 'blur' }]
}

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

const loadFollowUpRecords = async () => {
  followUpRecords.value = [
    {
      id: 1,
      customerId: 1,
      customerName: '苏州科技有限公司',
      content: '与客户沟通了需求，客户表示对系统功能很满意',
      userName: '张三',
      nextFollowUp: '2026-02-14 10:00:00',
      createdAt: '2026-02-13 10:30:00'
    },
    {
      id: 2,
      customerId: 2,
      customerName: '苏州贸易公司',
      content: '客户询问了价格，已发送报价单',
      userName: '李四',
      nextFollowUp: '2026-02-15 14:00:00',
      createdAt: '2026-02-12 15:20:00'
    }
  ]
}

const loadCustomers = async () => {
  customers.value = [
    { id: 1, name: '苏州科技有限公司' },
    { id: 2, name: '苏州贸易公司' },
    { id: 3, name: '苏州制造公司' }
  ]
}

const loadPendingFollowUps = async () => {
  pendingFollowUps.value = [
    {
      id: 1,
      customerName: '苏州科技有限公司',
      content: '与客户沟通了需求，客户表示对系统功能很满意',
      nextFollowUp: '2026-02-14 10:00:00'
    }
  ]
}

const handleAdd = async () => {
  if (!followUpFormRef.value) return
  
  try {
    await followUpFormRef.value.validate()
    
    const customer = customers.value.find(c => c.id === followUpForm.customerId)
    const newRecord = {
      id: Date.now(),
      customerId: followUpForm.customerId,
      customerName: customer.name,
      content: followUpForm.content,
      userName: user.value.name,
      nextFollowUp: followUpForm.nextFollowUp,
      createdAt: new Date().toISOString()
    }
    
    followUpRecords.value.unshift(newRecord)
    ElMessage.success('跟进记录添加成功')
    
    Object.assign(followUpForm, {
      customerId: '',
      content: '',
      nextFollowUp: ''
    })
    
    loadPendingFollowUps()
  } catch (error) {
    console.error('添加跟进记录失败:', error)
  }
}

const handleEdit = (row) => {
  currentFollowUpId.value = row.id
  editForm.content = row.content
  editForm.nextFollowUp = row.nextFollowUp
  editDialogVisible.value = true
}

const handleEditSubmit = async () => {
  if (!editFormRef.value) return
  
  try {
    await editFormRef.value.validate()
    
    const index = followUpRecords.value.findIndex(f => f.id === currentFollowUpId.value)
    if (index !== -1) {
      followUpRecords.value[index].content = editForm.content
      followUpRecords.value[index].nextFollowUp = editForm.nextFollowUp
    }
    
    ElMessage.success('跟进记录更新成功')
    editDialogVisible.value = false
  } catch (error) {
    console.error('更新跟进记录失败:', error)
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该跟进记录吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const index = followUpRecords.value.findIndex(f => f.id === row.id)
    if (index !== -1) {
      followUpRecords.value.splice(index, 1)
    }
    
    ElMessage.success('跟进记录删除成功')
    loadPendingFollowUps()
  } catch (error) {
    console.error('删除跟进记录失败:', error)
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
  loadFollowUpRecords()
  loadCustomers()
  loadPendingFollowUps()
})
</script>

<style scoped>
.follow-up-container {
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
