<template>
  <div class="my-shared-container">
    <div class="header">
      <h1>我共享的客户</h1>
      <div class="user-info">
        <span class="user-name">{{ user?.username }}</span>
        <span class="user-branch">{{ user?.branch }}</span>
      </div>
    </div>

    <div class="content">
      <div class="table-container">
        <table class="customer-table">
          <thead>
            <tr>
              <th>客户类型</th>
              <th>客户名称</th>
              <th>被捞取分公司</th>
              <th>最新进展</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in myCustomers" :key="customer.id" class="table-row">
              <td class="customer-type-cell">
                <span class="customer-type" :class="customer.customerType">
                  {{ customer.customerType === '企业' ? '企业' : '个人' }}
                </span>
              </td>
              <td class="customer-name-cell">{{ customer.name }}</td>
              <td class="branch-cell">
                <span :class="getBranchClass(customer.retrievedBy)">
                  {{ customer.retrievedBy || '未捞取' }}
                </span>
              </td>
              <td class="progress-cell">{{ customer.latestProgress }}</td>
            </tr>
          </tbody>
        </table>

        <div v-if="myCustomers.length === 0" class="empty-state">
          <div class="empty-icon">📤</div>
          <div class="empty-text">暂无共享客户</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(JSON.parse(localStorage.getItem('user')))

const myCustomers = ref([
  {
    id: 1,
    customerType: '企业',
    name: '苏州科技有限公司',
    retrievedBy: null,
    latestProgress: '最近一次触达时间：2026-02-13 10:30'
  },
  {
    id: 2,
    customerType: '个人',
    name: '王五',
    retrievedBy: '上海分公司',
    latestProgress: '已被上海分公司捞取'
  },
  {
    id: 3,
    customerType: '企业',
    name: '杭州贸易公司',
    retrievedBy: '杭州分公司',
    latestProgress: '已被杭州分公司捞取'
  },
  {
    id: 4,
    customerType: '个人',
    name: '赵六',
    retrievedBy: '常州分公司',
    latestProgress: '邀约时间：2026-02-12 14:20'
  },
  {
    id: 5,
    customerType: '企业',
    name: '无锡制造企业',
    retrievedBy: '企业贷款分公司',
    latestProgress: '已被企业贷款分公司捞取'
  }
])

const getBranchClass = (branch) => {
  if (!branch) return 'unretrieved'
  const branchClass = {
    '上海分公司': 'retrieved-shanghai',
    '杭州分公司': 'retrieved-hangzhou',
    '常州分公司': 'retrieved-changzhou',
    '企业贷款分公司': 'retrieved-enterprise-loan',
    '债优分公司': 'retrieved-debt-optimization'
  }
  return branchClass[branch] || 'retrieved-other'
}

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user) {
    console.log('当前用户:', user)
  }
})
</script>

<style scoped>
.my-shared-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
}

.user-info {
  margin-top: 15px;
  display: flex;
  gap: 20px;
  align-items: center;
}

.user-name {
  font-size: 16px;
  font-weight: 500;
}

.user-branch {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 14px;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
}

.table-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.customer-table {
  width: 100%;
  border-collapse: collapse;
}

.customer-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.customer-table th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.customer-table tbody tr {
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.3s;
}

.customer-table tbody tr:hover {
  background-color: #f5f7fa;
}

.customer-table td {
  padding: 16px;
  font-size: 14px;
  color: #303133;
}

.customer-type-cell {
  width: 120px;
}

.customer-type {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.customer-type.企业 {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(238, 82, 83, 0.3);
}

.customer-type.个人 {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(240, 98, 146, 0.3);
}

.customer-name-cell {
  font-weight: 600;
  color: #303133;
}

.branch-cell {
  width: 200px;
}

.branch-cell span {
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.branch-cell .unretrieved {
  color: #909399;
  background-color: #f5f7fa;
}

.branch-cell .retrieved-shanghai {
  color: #e6a23c;
  background-color: #fef0f0;
}

.branch-cell .retrieved-hangzhou {
  color: #67c23a;
  background-color: #f0f9ff;
}

.branch-cell .retrieved-changzhou {
  color: #409eff;
  background-color: #ecf5ff;
}

.branch-cell .retrieved-enterprise-loan {
  color: #f56c6c;
  background-color: #fef0f0;
}

.branch-cell .retrieved-debt-optimization {
  color: #e6a23c;
  background-color: #fef0f0;
}

.branch-cell .retrieved-other {
  color: #909399;
  background-color: #f5f7fa;
}

.progress-cell {
  color: #606266;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-text {
  font-size: 18px;
  color: #909399;
}
</style>
