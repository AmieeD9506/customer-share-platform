<template>
  <div class="shared-pool-container">
    <div class="header">
      <h1>集团共享客户池</h1>
      <div class="user-info">
        <span class="user-name">{{ user?.username }}</span>
        <span class="user-branch">{{ user?.branch }}</span>
      </div>
    </div>

    <div class="content">
      <div class="filter-section">
        <div class="filter-item">
          <label>客户可贷款城市：</label>
          <select v-model="filters.city" class="filter-select">
            <option value="">全部城市</option>
            <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
          </select>
        </div>
        
        <div class="filter-item">
          <label>客户类型：</label>
          <select v-model="filters.customerType" class="filter-select">
            <option value="">全部类型</option>
            <option value="企业">企业客户</option>
            <option value="个人">个人客户</option>
          </select>
        </div>
      </div>

      <div class="customer-grid">
        <div 
          v-for="customer in filteredCustomers" 
          :key="customer.id" 
          class="customer-card"
        >
          <div class="card-header">
            <div class="customer-type" :class="customer.customerType">
              {{ customer.customerType === '企业' ? '企业客户' : '个人客户' }}
            </div>
          </div>
          
          <div class="card-body">
            <div class="customer-name">{{ customer.name }}</div>
            <div class="customer-city">{{ customer.city }}</div>
            <div class="tags-section">
              <div class="tags-label">标签：</div>
              <div class="tags-container">
                <span 
                  v-for="tag in customer.tags" 
                  :key="tag" 
                  class="tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
            <div class="share-reason">
              <span class="label">共享原因：</span>
              <span class="reason">{{ customer.shareReason }}</span>
            </div>
          </div>
          
          <div class="card-footer">
            <button @click="viewDetail(customer)" class="detail-btn">查看详情</button>
            <button 
              @click="retrieveCustomer(customer)" 
              class="retrieve-btn"
              :disabled="customer.retrieved"
            >
              {{ customer.retrieved ? '已捞取' : '捞取' }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredCustomers.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <div class="empty-text">暂无共享客户</div>
      </div>
    </div>

    <div v-if="showDetailDialog" class="detail-dialog" @click.self="showDetailDialog = false">
      <div class="dialog-content" @click.stop>
        <div class="dialog-header">
          <h2>客户详情</h2>
          <button @click="showDetailDialog = false" class="close-btn">&times;</button>
        </div>
        <div class="dialog-body">
          <div class="detail-item">
            <span class="label">客户类型：</span>
            <span class="value">{{ selectedCustomer?.customerType }}</span>
          </div>
          <div class="detail-item">
            <span class="label">客户名称：</span>
            <span class="value">{{ selectedCustomer?.name }}</span>
          </div>
          <div class="detail-item">
            <span class="label">客户城市：</span>
            <span class="value">{{ selectedCustomer?.city }}</span>
          </div>
          <div class="detail-item">
            <span class="label">共享原因：</span>
            <span class="value">{{ selectedCustomer?.shareReason }}</span>
          </div>
          <div class="detail-item">
            <span class="label">标签：</span>
            <span class="value">{{ selectedCustomer?.tags?.join(', ') }}</span>
          </div>
          <div class="detail-item">
            <span class="label">被捞取分公司：</span>
            <span class="value">{{ selectedCustomer?.retrievedBy || '未捞取' }}</span>
          </div>
          <div class="detail-item">
            <span class="label">最新进展：</span>
            <span class="value">{{ selectedCustomer?.latestProgress }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showRetrieveDialog" class="detail-dialog" @click.self="showRetrieveDialog = false">
      <div class="dialog-content" @click.stop>
        <div class="dialog-header">
          <h2>确认捞取</h2>
          <button @click="showRetrieveDialog = false" class="close-btn">&times;</button>
        </div>
        <div class="dialog-body">
          <p class="warning-text">
            捞取后10个工作日如果没有邀约，则会自动回到共享池。
          </p>
          <p class="confirm-text">是否确定捞取？</p>
          <div class="dialog-buttons">
            <button @click="showRetrieveDialog = false" class="cancel-btn">取消</button>
            <button @click="confirmRetrieve" class="confirm-btn">确定</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(JSON.parse(localStorage.getItem('user')))

const cities = [
  '常州', '杭州', '合肥', '湖州', '嘉兴', '济南', '连云港',
  '南京', '南通', '宁波', '青岛', '上海', '苏州', '泰州',
  '天津', '潍坊', '武汉', '无锡', '徐州', '盐城', '扬州', '镇江'
]

const filters = ref({
  city: '',
  customerType: ''
})

const showDetailDialog = ref(false)
const showRetrieveDialog = ref(false)
const selectedCustomer = ref(null)

const customers = ref([
  {
    id: 1,
    customerType: '企业',
    name: '苏州科技有限公司',
    city: '苏州',
    shareReason: '公积金断缴',
    tags: ['公积金', '断缴'],
    retrieved: false,
    retrievedBy: null,
    latestProgress: '最近一次触达时间：2026-02-13 10:30'
  },
  {
    id: 2,
    customerType: '个人',
    name: '张三',
    city: '杭州',
    shareReason: '房贷',
    tags: ['房贷', '征信'],
    retrieved: false,
    retrievedBy: null,
    latestProgress: '邀约时间：2026-02-12 14:20'
  },
  {
    id: 3,
    customerType: '企业',
    name: '南京贸易公司',
    city: '南京',
    shareReason: '未放款续签',
    tags: ['未放款', '续签'],
    retrieved: false,
    retrievedBy: null,
    latestProgress: '最近一次触达时间：2026-02-13 09:15'
  },
  {
    id: 4,
    customerType: '个人',
    name: '李四',
    city: '上海',
    shareReason: '养征信',
    tags: ['养征信', '评估'],
    retrieved: false,
    retrievedBy: null,
    latestProgress: '邀约时间：2026-02-11 16:45'
  },
  {
    id: 5,
    customerType: '企业',
    name: '无锡制造企业',
    city: '无锡',
    shareReason: '市场推广',
    tags: ['市场推广', '渠道'],
    retrieved: true,
    retrievedBy: '上海分公司',
    latestProgress: '已被上海分公司捞取'
  }
])

const filteredCustomers = computed(() => {
  return customers.value.filter(customer => {
    const cityMatch = !filters.value.city || customer.city === filters.value.city
    const typeMatch = !filters.value.customerType || customer.customerType === filters.value.customerType
    return cityMatch && typeMatch
  })
})

const viewDetail = (customer) => {
  selectedCustomer.value = customer
  showDetailDialog.value = true
}

const retrieveCustomer = (customer) => {
  selectedCustomer.value = customer
  showRetrieveDialog.value = true
}

const confirmRetrieve = () => {
  if (selectedCustomer.value) {
    selectedCustomer.value.retrieved = true
    selectedCustomer.value.retrievedBy = user.value.branch
    selectedCustomer.value.latestProgress = '已被' + user.value.branch + '捞取'
    showRetrieveDialog.value = false
    alert('捞取成功！')
  }
}

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user) {
    console.log('当前用户:', user)
  }
})
</script>

<style scoped>
.shared-pool-container {
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
  max-width: 1400px;
  margin: 0 auto;
}

.filter-section {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.filter-item {
  flex: 1;
  min-width: 200px;
}

.filter-item label {
  display: block;
  margin-bottom: 8px;
  color: #606266;
  font-weight: 500;
  font-size: 14px;
}

.filter-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.customer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.customer-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.customer-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.customer-type {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.card-body {
  padding: 20px;
}

.customer-name {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

.customer-city {
  font-size: 14px;
  color: #909399;
  margin-bottom: 20px;
}

.tags-section {
  margin-bottom: 20px;
}

.tags-label {
  font-size: 13px;
  color: #606266;
  font-weight: 500;
  margin-bottom: 10px;
}

.tags-container {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 13px;
  background-color: rgba(64, 158, 255, 0.1);
  color: #409eff;
  border: 1px solid rgba(64, 158, 255, 0.2);
}

.share-reason {
  background-color: #f5f7fa;
  padding: 12px;
  border-radius: 4px;
  border-left: 4px solid #409eff;
  margin-bottom: 20px;
}

.share-reason .label {
  color: #606266;
  font-size: 13px;
  margin-right: 8px;
}

.share-reason .reason {
  color: #303133;
  font-weight: 500;
  font-size: 14px;
}

.card-footer {
  padding: 15px 20px;
  display: flex;
  gap: 10px;
  border-top: 1px solid #f0f0f0;
}

.detail-btn {
  flex: 1;
  padding: 10px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.detail-btn:hover {
  background-color: #66b1ff;
}

.retrieve-btn {
  flex: 1;
  padding: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.retrieve-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.retrieve-btn:disabled {
  background-color: #c0c4cc;
  cursor: not-allowed;
  opacity: 0.6;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background-color: white;
  border-radius: 8px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-text {
  font-size: 18px;
  color: #909399;
}

.detail-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-content {
  background-color: white;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.dialog-header h2 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #909399;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #f56c6c;
}

.dialog-body {
  padding: 20px;
}

.detail-item {
  display: flex;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f5f7fa;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item .label {
  width: 120px;
  color: #606266;
  font-weight: 500;
  font-size: 14px;
}

.detail-item .value {
  flex: 1;
  color: #303133;
  font-size: 14px;
}

.warning-text {
  color: #e6a23c;
  background-color: #fef0f0;
  padding: 12px;
  border-radius: 4px;
  border-left: 4px solid #e6a23c;
  margin-bottom: 15px;
  font-size: 14px;
}

.confirm-text {
  color: #303133;
  font-size: 16px;
  margin-bottom: 20px;
}

.dialog-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.cancel-btn {
  padding: 10px 20px;
  background-color: #f5f7fa;
  color: #606266;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.cancel-btn:hover {
  background-color: #e4e7da;
  border-color: #d9ecff;
}

.confirm-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}
</style>
