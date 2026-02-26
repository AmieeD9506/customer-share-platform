<template>
  <div class="admin-container">
    <el-container style="height: 100vh; border: 1px solid #eee;">
      <el-aside width="200px" style="background-color: #5470c6;">
        <el-menu
          default-active="5"
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
            <h1 style="margin: 0; font-size: 18px; line-height: 60px; padding-left: 20px;">系统设置</h1>
            <div class="user-info">
              <span>{{ user?.username }}</span>
              <el-avatar :size="32" :src="userAvatar"></el-avatar>
            </div>
          </div>
        </el-header>
        <el-main style="padding: 20px;">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="分公司管理" name="branches">
              <el-card shadow="hover">
                <template #header>
                  <div class="card-header">
                    <span>分公司列表</span>
                    <el-button type="primary" @click="showAddBranchDialog">新增分公司</el-button>
                  </div>
                </template>
                <el-table :data="branches" style="width: 100%">
                  <el-table-column prop="name" label="分公司名称" width="200"></el-table-column>
                  <el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="contactPerson" label="联系人" width="120"></el-table-column>
                  <el-table-column prop="contactPhone" label="联系电话" width="150"></el-table-column>
                  <el-table-column label="操作" width="200">
                    <template #default="{ row }">
                      <el-button size="small" @click="handleEditBranch(row)">编辑</el-button>
                      <el-button size="small" type="danger" @click="handleDeleteBranch(row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </el-tab-pane>
            <el-tab-pane label="用户管理" name="users">
              <el-card shadow="hover">
                <template #header>
                  <div class="card-header">
                    <span>用户列表</span>
                    <el-button type="primary" @click="showAddUserDialog">新增用户</el-button>
                  </div>
                </template>
                <el-table :data="users" style="width: 100%">
                  <el-table-column prop="username" label="用户名" width="150"></el-table-column>
                  <el-table-column prop="name" label="姓名" width="120"></el-table-column>
                  <el-table-column prop="branchName" label="所属分公司" width="150"></el-table-column>
                  <el-table-column prop="role" label="角色" width="100">
                    <template #default="{ row }">
                      <el-tag :type="row.role === 'admin' ? 'danger' : 'primary'">{{ row.role === 'admin' ? '管理员' : '员工' }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="200">
                    <template #default="{ row }">
                      <el-button size="small" @click="handleEditUser(row)">编辑</el-button>
                      <el-button size="small" type="danger" @click="handleDeleteUser(row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </el-container>
    </el-container>

    <!-- 新增/编辑分公司对话框 -->
    <el-dialog v-model="branchDialogVisible" :title="branchDialogTitle" width="500px">
      <el-form :model="branchForm" :rules="branchRules" ref="branchFormRef" label-width="100px">
        <el-form-item label="分公司名称" prop="name">
          <el-input v-model="branchForm.name" placeholder="请输入分公司名称"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="branchForm.address" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contactPerson">
          <el-input v-model="branchForm.contactPerson" placeholder="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="contactPhone">
          <el-input v-model="branchForm.contactPhone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="branchDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveBranch">确定</el-button>
      </template>
    </el-dialog>

    <!-- 新增/编辑用户对话框 -->
    <el-dialog v-model="userDialogVisible" :title="userDialogTitle" width="500px">
      <el-form :model="userForm" :rules="userRules" ref="userFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" :disabled="isEditUser"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password" type="password" placeholder="请输入密码" :disabled="isEditUser"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userForm.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="所属分公司" prop="branchCompanyId">
          <el-select v-model="userForm.branchCompanyId" placeholder="请选择分公司" style="width: 100%">
            <el-option
              v-for="branch in branches"
              :key="branch.id"
              :label="branch.name"
              :value="branch.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="员工" value="employee"></el-option>
            <el-option label="管理员" value="admin"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="userDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveUser">确定</el-button>
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

const activeTab = ref('branches')
const branches = ref([])
const users = ref([])
const branchDialogVisible = ref(false)
const userDialogVisible = ref(false)
const branchDialogTitle = ref('新增分公司')
const userDialogTitle = ref('新增用户')
const branchFormRef = ref(null)
const userFormRef = ref(null)
const isEditBranch = ref(false)
const isEditUser = ref(false)
const currentBranchId = ref(null)
const currentUserId = ref(null)

const branchForm = reactive({
  name: '',
  address: '',
  contactPerson: '',
  contactPhone: ''
})

const userForm = reactive({
  username: '',
  password: '',
  name: '',
  branchCompanyId: '',
  role: 'employee'
})

const branchRules = {
  name: [{ required: true, message: '请输入分公司名称', trigger: 'blur' }]
}

const userRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  branchCompanyId: [{ required: true, message: '请选择分公司', trigger: 'change' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

const loadBranches = async () => {
  branches.value = [
    {
      id: 1,
      name: '销售部',
      address: '苏州市工业园区',
      contactPerson: '张经理',
      contactPhone: '13800138000'
    },
    {
      id: 2,
      name: '市场部',
      address: '苏州市高新区',
      contactPerson: '李经理',
      contactPhone: '13900139000'
    },
    {
      id: 3,
      name: '技术部',
      address: '苏州市吴中区',
      contactPerson: '王经理',
      contactPhone: '13700137000'
    }
  ]
}

const loadUsers = async () => {
  users.value = [
    {
      id: 1,
      username: 'admin',
      name: '管理员',
      branchName: '销售部',
      role: 'admin'
    },
    {
      id: 2,
      username: 'zhangsan',
      name: '张三',
      branchName: '销售部',
      role: 'employee'
    },
    {
      id: 3,
      username: 'lisi',
      name: '李四',
      branchName: '市场部',
      role: 'employee'
    }
  ]
}

const showAddBranchDialog = () => {
  branchDialogTitle.value = '新增分公司'
  isEditBranch.value = false
  resetBranchForm()
  branchDialogVisible.value = true
}

const handleEditBranch = (row) => {
  branchDialogTitle.value = '编辑分公司'
  isEditBranch.value = true
  currentBranchId.value = row.id
  Object.assign(branchForm, row)
  branchDialogVisible.value = true
}

const handleSaveBranch = async () => {
  if (!branchFormRef.value) return
  
  try {
    await branchFormRef.value.validate()
    
    if (isEditBranch.value) {
      const index = branches.value.findIndex(b => b.id === currentBranchId.value)
      if (index !== -1) {
        branches.value[index] = { ...branchForm, id: currentBranchId.value }
      }
      ElMessage.success('分公司更新成功')
    } else {
      const newBranch = { ...branchForm, id: Date.now() }
      branches.value.push(newBranch)
      ElMessage.success('分公司创建成功')
    }
    
    branchDialogVisible.value = false
    resetBranchForm()
  } catch (error) {
    console.error('保存分公司失败:', error)
  }
}

const handleDeleteBranch = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该分公司吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const index = branches.value.findIndex(b => b.id === row.id)
    if (index !== -1) {
      branches.value.splice(index, 1)
    }
    
    ElMessage.success('分公司删除成功')
  } catch (error) {
    console.error('删除分公司失败:', error)
  }
}

const showAddUserDialog = () => {
  userDialogTitle.value = '新增用户'
  isEditUser.value = false
  resetUserForm()
  userDialogVisible.value = true
}

const handleEditUser = (row) => {
  userDialogTitle.value = '编辑用户'
  isEditUser.value = true
  currentUserId.value = row.id
  Object.assign(userForm, row)
  userDialogVisible.value = true
}

const handleSaveUser = async () => {
  if (!userFormRef.value) return
  
  try {
    await userFormRef.value.validate()
    
    if (isEditUser.value) {
      const index = users.value.findIndex(u => u.id === currentUserId.value)
      if (index !== -1) {
        const branch = branches.value.find(b => b.id === userForm.branchCompanyId)
        users.value[index] = { ...userForm, id: currentUserId.value, branchName: branch.name }
      }
      ElMessage.success('用户更新成功')
    } else {
      const branch = branches.value.find(b => b.id === userForm.branchCompanyId)
      const newUser = { ...userForm, id: Date.now(), branchName: branch.name }
      users.value.push(newUser)
      ElMessage.success('用户创建成功')
    }
    
    userDialogVisible.value = false
    resetUserForm()
  } catch (error) {
    console.error('保存用户失败:', error)
  }
}

const handleDeleteUser = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该用户吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const index = users.value.findIndex(u => u.id === row.id)
    if (index !== -1) {
      users.value.splice(index, 1)
    }
    
    ElMessage.success('用户删除成功')
  } catch (error) {
    console.error('删除用户失败:', error)
  }
}

const resetBranchForm = () => {
  Object.assign(branchForm, {
    name: '',
    address: '',
    contactPerson: '',
    contactPhone: ''
  })
}

const resetUserForm = () => {
  Object.assign(userForm, {
    username: '',
    password: '',
    name: '',
    branchCompanyId: '',
    role: 'employee'
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
  loadBranches()
  loadUsers()
})
</script>

<style scoped>
.admin-container {
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
