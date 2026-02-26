<template>
  <div class="customers-container">
    <el-container style="height: 100vh; border: 1px solid #eee;">
      <el-aside width="200px" style="background-color: #5470c6;">
        <el-menu
          default-active="2"
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
            <h1 style="margin: 0; font-size: 18px; line-height: 60px; padding-left: 20px;">客户管理</h1>
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
                <span>我的客户</span>
                <el-button type="primary" @click="showAddDialog">新增客户</el-button>
              </div>
            </template>
            <el-table :data="customers" style="width: 100%">
              <el-table-column prop="name" label="客户名称" width="150"></el-table-column>
              <el-table-column prop="contactPerson" label="联系人" width="120"></el-table-column>
              <el-table-column prop="contactPhone" label="联系电话" width="150"></el-table-column>
              <el-table-column prop="industry" label="行业" width="120"></el-table-column>
              <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="shared" label="是否共享" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.shared ? 'success' : 'info'">{{ row.shared ? '已共享' : '未共享' }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="300">
                <template #default="{ row }">
                  <el-button size="small" @click="handleEdit(row)">编辑</el-button>
                  <el-button size="small" type="success" @click="handleShare(row)" v-if="!row.shared">共享</el-button>
                  <el-button size="small" type="warning" @click="handleUnshare(row)" v-if="row.shared">取消共享</el-button>
                  <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-main>
      </el-container>
    </el-container>

    <!-- 新增/编辑客户对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="customerForm" :rules="rules" ref="customerFormRef" label-width="100px">
        <el-form-item label="客户名称" prop="name">
          <el-input v-model="customerForm.name" placeholder="请输入客户名称"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contactPerson">
          <el-input v-model="customerForm.contactPerson" placeholder="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="contactPhone">
          <el-input v-model="customerForm.contactPhone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="customerForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="customerForm.address" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="行业" prop="industry">
          <el-input v-model="customerForm.industry" placeholder="请输入行业"></el-input>
        </el-form-item>
        <el-form-item label="需求" prop="requirements">
          <el-input type="textarea" v-model="customerForm.requirements" placeholder="请输入需求"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="customerForm.status" placeholder="请选择状态">
            <el-option label="潜在客户" value="potential"></el-option>
            <el-option label="跟进中" value="following"></el-option>
            <el-option label="已成交" value="closed"></el-option>
            <el-option label="已放弃" value="abandoned"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
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

const customers = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增客户')
const customerFormRef = ref(null)
const isEdit = ref(false)
const currentCustomerId = ref(null)

const customerForm = reactive({
  name: '',
  contactPerson: '',
  contactPhone: '',
  email: '',
  address: '',
  industry: '',
  requirements: '',
  status: 'potential'
})

const rules = {
  name: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
  contactPerson: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  contactPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }]
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

const loadCustomers = async () => {
  // 模拟数据
  customers.value = [
    {
      id: 1,
      name: '苏州科技有限公司',
      contactPerson: '张三',
      contactPhone: '13800138000',
      email: 'zhangsan@example.com',
      address: '苏州市工业园区',
      industry: '科技',
      requirements: '需要开发企业管理系统',
      status: 'following',
      shared: false
    },
    {
      id: 2,
      name: '苏州贸易公司',
      contactPerson: '李四',
      contactPhone: '13900139000',
      email: 'lisi@example.com',
      address: '苏州市高新区',
      industry: '贸易',
      requirements: '需要进销存系统',
      status: 'potential',
      shared: true
    }
  ]
}

const showAddDialog = () => {
  dialogTitle.value = '新增客户'
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑客户'
  isEdit.value = true
  currentCustomerId.value = row.id
  Object.assign(customerForm, row)
  dialogVisible.value = true
}

const handleSave = async () => {
  if (!customerFormRef.value) return
  
  try {
    await customerFormRef.value.validate()
    
    if (isEdit.value) {
      // 更新客户
      const index = customers.value.findIndex(c => c.id === currentCustomerId.value)
      if (index !== -1) {
        customers.value[index] = { ...customerForm, id: currentCustomerId.value }
      }
      ElMessage.success('客户更新成功')
    } else {
      // 新增客户
      const newCustomer = { ...customerForm, id: Date.now(), shared: false }
      customers.value.push(newCustomer)
      ElMessage.success('客户创建成功')
    }
    
    dialogVisible.value = false
    resetForm()
  } catch (error) {
    console.error('保存失败:', error)
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该客户吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const index = customers.value.findIndex(c => c.id === row.id)
    if (index !== -1) {
      customers.value.splice(index, 1)
    }
    ElMessage.success('客户删除成功')
  } catch (error) {
    console.error('删除失败:', error)
  }
}

const handleShare = async (row) => {
  try {
    await ElMessageBox.confirm('确定要共享该客户吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    })
    
    const index = customers.value.findIndex(c => c.id === row.id)
    if (index !== -1) {
      customers.value[index].shared = true
    }
    ElMessage.success('客户共享成功')
  } catch (error) {
    console.error('共享失败:', error)
  }
}

const handleUnshare = async (row) => {
  try {
    await ElMessageBox.confirm('确定要取消共享该客户吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const index = customers.value.findIndex(c => c.id === row.id)
    if (index !== -1) {
      customers.value[index].shared = false
    }
    ElMessage.success('客户取消共享成功')
  } catch (error) {
    console.error('取消共享失败:', error)
  }
}

const resetForm = () => {
  Object.assign(customerForm, {
    name: '',
    contactPerson: '',
    contactPhone: '',
    email: '',
    address: '',
    industry: '',
    requirements: '',
    status: 'potential'
  })
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
  loadCustomers()
})
</script>

<style scoped>
.customers-container {
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
