<template>
  <div class="settings-container">
    <div class="header">
      <h1>系统设置</h1>
      <div class="user-info">
        <span class="user-name">{{ user?.username }}</span>
        <span class="user-branch">{{ user?.branch }}</span>
      </div>
    </div>

    <div class="content">
      <div class="section">
        <h2>配置结算比例</h2>
        <p class="section-desc">设置共享方和捞取方的结算比例，两者之和必须为100%</p>
        
        <div class="form-group">
          <label for="shareRatio">共享方结算比例：</label>
          <div class="input-wrapper">
            <input 
              type="number" 
              id="shareRatio" 
              v-model="settings.shareRatio" 
              min="0" 
              max="100"
              placeholder="请输入比例"
            >
            <span class="percentage">%</span>
          </div>
        </div>
        
        <div class="form-group">
          <label for="retrieveRatio">捞取方结算比例：</label>
          <div class="input-wrapper">
            <input 
              type="number" 
              id="retrieveRatio" 
              v-model="settings.retrieveRatio" 
              min="0" 
              max="100"
              placeholder="请输入比例"
            >
            <span class="percentage">%</span>
          </div>
        </div>
        
        <div class="form-actions">
          <button @click="saveRatioSettings" class="save-btn">保存设置</button>
          <div class="total-ratio">
            <span class="label">当前总和：</span>
            <span :class="getTotalRatioClass()">
              {{ totalRatio }}%
            </span>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>配置每日共享上限</h2>
        <p class="section-desc">设置每个分公司的员工每日可共享的客户数量上限</p>
        
        <div class="branch-list">
          <div 
            v-for="branch in branches" 
            :key="branch.name" 
            class="branch-item"
          >
            <div class="branch-header">
              <span class="branch-name">{{ branch.name }}</span>
              <span class="branch-code">({{ branch.code }})</span>
            </div>
            <div class="branch-input">
              <label>每日共享上限：</label>
              <input 
                type="number" 
                v-model="branch.limit" 
                min="0" 
                max="999"
                placeholder="请输入上限"
                class="limit-input"
              >
            </div>
          </div>
        </div>
        
        <div class="form-actions">
          <button @click="saveLimitSettings" class="save-btn">保存设置</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const user = ref(JSON.parse(localStorage.getItem('user')))

const branches = ref([
  { name: '常州分公司', code: 'CZ', limit: 10 },
  { name: '杭州分公司', code: 'HZ', limit: 15 },
  { name: '合肥分公司', code: 'HF', limit: 12 },
  { name: '湖州分公司', code: 'HUZ', limit: 8 },
  { name: '嘉兴分公司', code: 'JX', limit: 10 },
  { name: '济南分公司', code: 'JN', limit: 15 },
  { name: '连云港分公司', code: 'LYG', limit: 12 },
  { name: '南京分公司', code: 'NJ', limit: 20 },
  { name: '南通分公司', code: 'NT', limit: 10 },
  { name: '宁波分公司', code: 'NB', limit: 15 },
  { name: '青岛分公司', code: 'QD', limit: 18 },
  { name: '上海分公司', code: 'SH', limit: 25 },
  { name: '苏州分公司', code: 'SZ', limit: 20 },
  { name: '泰州分公司', code: 'TZ', limit: 10 },
  { name: '天津分公司', code: 'TJ', limit: 15 },
  { name: '潍坊分公司', code: 'WF', limit: 12 },
  { name: '武汉分公司', code: 'WH', limit: 18 },
  { name: '无锡分公司', code: 'WX', limit: 15 },
  { name: '徐州分公司', code: 'XZ', limit: 10 },
  { name: '盐城分公司', code: 'YC', limit: 12 },
  { name: '扬州分公司', code: 'YZ', limit: 10 },
  { name: '镇江分公司', code: 'ZJ', limit: 8 }
])

const settings = ref({
  shareRatio: 60,
  retrieveRatio: 40
})

const totalRatio = computed(() => {
  return settings.value.shareRatio + settings.value.retrieveRatio
})

const getTotalRatioClass = () => {
  const total = totalRatio.value
  if (total === 100) return 'valid'
  if (total > 100) return 'invalid-high'
  if (total < 100) return 'invalid-low'
  return 'valid'
}

const saveRatioSettings = () => {
  const total = totalRatio.value
  if (total !== 100) {
    alert('共享方和捞取方的结算比例之和必须为100%！\n当前总和：' + total + '%')
    return
  }
  
  localStorage.setItem('ratioSettings', JSON.stringify({
    shareRatio: settings.value.shareRatio,
    retrieveRatio: settings.value.retrieveRatio
  }))
  
  alert('结算比例设置已保存！\n共享方：' + settings.value.shareRatio + '%\n捞取方：' + settings.value.retrieveRatio + '%')
}

const saveLimitSettings = () => {
  const limits = {}
  branches.value.forEach(branch => {
    limits[branch.code] = branch.limit
  })
  
  localStorage.setItem('branchLimits', JSON.stringify(limits))
  
  alert('每日共享上限设置已保存！')
}

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user) {
    console.log('当前用户:', user)
  }
  
  const savedRatioSettings = localStorage.getItem('ratioSettings')
  if (savedRatioSettings) {
    const ratioSettings = JSON.parse(savedRatioSettings)
    settings.value.shareRatio = ratioSettings.shareRatio
    settings.value.retrieveRatio = ratioSettings.retrieveRatio
  }
  
  const savedLimitSettings = localStorage.getItem('branchLimits')
  if (savedLimitSettings) {
    const limits = JSON.parse(savedLimitSettings)
    branches.value.forEach(branch => {
      if (limits[branch.code]) {
        branch.limit = limits[branch.code]
      }
    })
  }
})
</script>

<style scoped>
.settings-container {
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
  max-width: 1000px;
  margin: 0 auto;
}

.section {
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section h2 {
  margin: 0 0 20px 0;
  color: #303133;
  font-size: 20px;
  font-weight: 600;
}

.section-desc {
  color: #909399;
  font-size: 14px;
  margin-bottom: 25px;
  line-height: 1.6;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #606266;
  font-weight: 500;
  font-size: 14px;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-wrapper input {
  flex: 1;
  padding: 12px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.percentage {
  color: #909399;
  font-size: 14px;
  font-weight: 500;
}

.form-actions {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
}

.save-btn {
  padding: 12px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.total-ratio {
  display: flex;
  align-items: center;
  gap: 10px;
}

.total-ratio .label {
  color: #606266;
  font-size: 14px;
}

.total-ratio .value {
  font-size: 16px;
  font-weight: 600;
}

.total-ratio .value.valid {
  color: #67c23a;
}

.total-ratio .value.invalid-high {
  color: #f56c6c;
}

.total-ratio .value.invalid-low {
  color: #e6a23c;
}

.branch-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.branch-item {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.branch-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.branch-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.branch-code {
  background-color: rgba(64, 158, 255, 0.1);
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  color: #409eff;
}

.branch-input {
  margin-top: 15px;
}

.branch-input label {
  display: block;
  margin-bottom: 8px;
  color: #606266;
  font-size: 14px;
  font-weight: 500;
}

.branch-input input {
  width: 100%;
  padding: 12px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.branch-input input:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}
</style>
