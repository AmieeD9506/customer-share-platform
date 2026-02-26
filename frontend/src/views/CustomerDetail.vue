<template>
  <div class="customer-detail-container">
    <div class="header">
      <button @click="goBack" class="back-btn">&larr; 返回</button>
      <h1>客户详情</h1>
    </div>

    <div class="detail-content">
      <div class="info-section">
        <h2>个人信息</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">姓名：</span>
            <span class="value">{{ customerDetail.name }}</span>
          </div>
          <div class="info-item">
            <span class="label">年龄：</span>
            <span class="value">{{ customerDetail.age }}岁</span>
          </div>
          <div class="info-item">
            <span class="label">工作单位：</span>
            <span class="value">{{ customerDetail.workUnit }}</span>
          </div>
          <div class="info-item">
            <span class="label">客户类型：</span>
            <span class="value" :class="customerDetail.customerType">
              {{ customerDetail.customerType === '企业' ? '企业客户' : '个人客户' }}
            </span>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h2>公积金缴存情况</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">缴存状态：</span>
            <span class="value" :class="customerDetail.housingFundStatus">
              {{ customerDetail.housingFundStatus }}
            </span>
          </div>
          <div class="info-item">
            <span class="label">缴存基数：</span>
            <span class="value">{{ customerDetail.housingFundBase }}元</span>
          </div>
          <div class="info-item">
            <span class="label">缴存比例：</span>
            <span class="value">{{ customerDetail.housingFundRatio }}%</span>
          </div>
          <div class="info-item">
            <span class="label">累计缴存：</span>
            <span class="value">{{ customerDetail.housingFundTotal }}元</span>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h2>房产情况</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">房产坐落：</span>
            <span class="value">{{ customerDetail.propertyLocation }}</span>
          </div>
          <div class="info-item">
            <span class="label">房产面积：</span>
            <span class="value">{{ customerDetail.propertyArea }}平方米</span>
          </div>
          <div class="info-item">
            <span class="label">房产估值：</span>
            <span class="value">{{ customerDetail.propertyValue }}万元</span>
          </div>
          <div class="info-item">
            <span class="label">房产性质：</span>
            <span class="value">{{ customerDetail.propertyType }}</span>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h2>其他信息</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">客户城市：</span>
            <span class="value">{{ customerDetail.city }}</span>
          </div>
          <div class="info-item">
            <span class="label">共享原因：</span>
            <span class="value">{{ customerDetail.shareReason }}</span>
          </div>
          <div class="info-item">
            <span class="label">标签：</span>
            <div class="tags">
              <span 
                v-for="tag in customerDetail.tags" 
                :key="tag" 
                class="tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          <div class="info-item">
            <span class="label">被捞取分公司：</span>
            <span class="value">{{ customerDetail.retrievedBy || '未捞取' }}</span>
          </div>
          <div class="info-item">
            <span class="label">最新进展：</span>
            <span class="value">{{ customerDetail.latestProgress }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const customerDetail = ref({
  id: 1,
  name: '张三',
  age: 32,
  workUnit: '苏州某科技有限公司',
  customerType: '个人',
  housingFundStatus: '正常缴存',
  housingFundBase: 12000,
  housingFundRatio: 12,
  housingFundTotal: 288000,
  propertyLocation: '苏州市工业园区',
  propertyArea: 120,
  propertyValue: 180,
  propertyType: '商品房',
  city: '杭州',
  shareReason: '房贷',
  tags: ['房贷', '征信'],
  retrievedBy: null,
  latestProgress: '邀约时间：2026-02-12 14:20'
})

const goBack = () => {
  router.back()
}

onMounted(() => {
  const customerId = route.params.id
  console.log('客户ID:', customerId)
  
  if (customerId) {
    // 这里可以添加获取真实客户详情的API调用
    // fetchCustomerDetail(customerId)
  }
})
</script>

<style scoped>
.customer-detail-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.detail-content {
  max-width: 1000px;
  margin: 0 auto;
}

.info-section {
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-section h2 {
  margin: 0 0 20px 0;
  color: #303133;
  font-size: 20px;
  font-weight: 600;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.info-item .label {
  color: #606266;
  font-size: 14px;
  margin-bottom: 8px;
  font-weight: 500;
}

.info-item .value {
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.info-item .value.正常缴存 {
  color: #67c23a;
}

.info-item .value.断缴 {
  color: #f56c6c;
}

.info-item .value.企业客户 {
  color: #409eff;
}

.info-item .value.个人客户 {
  color: #e6a23c;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.tag {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 13px;
  background-color: rgba(64, 158, 255, 0.1);
  color: #409eff;
}
</style>
