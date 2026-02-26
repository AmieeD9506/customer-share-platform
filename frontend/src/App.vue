<template>
  <div class="layout-container">
    <div class="sidebar">
      <div class="user-section">
        <div class="user-info">
          <span class="user-name">{{ user?.username }}</span>
          <span class="user-branch">{{ user?.branch }}</span>
        </div>
      </div>
      
      <div class="menu">
        <div 
          v-for="menu in menus" 
          :key="menu.path" 
          class="menu-item"
          :class="{ active: currentPath === menu.path }"
          @click="navigateTo(menu.path)"
        >
          <div class="menu-icon">{{ menu.icon }}</div>
          <div class="menu-text">{{ menu.name }}</div>
        </div>
      </div>
      
      <div class="logout-section">
        <div class="menu-item logout" @click="handleLogout">
          <div class="menu-icon">🚪</div>
          <div class="menu-text">退出登录</div>
        </div>
      </div>
    </div>
    
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const user = ref(JSON.parse(localStorage.getItem('user')))

const menus = [
  {
    path: '/',
    name: '集团共享客户池',
    icon: '📊'
  },
  {
    path: '/my-shared',
    name: '我共享的客户',
    icon: '📤'
  },
  {
    path: '/settings',
    name: '系统设置',
    icon: '⚙️'
  }
]

const currentPath = computed(() => route.path)

const navigateTo = (path) => {
  router.push(path)
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user) {
    console.log('当前用户:', user)
  }
})
</script>

<style scoped>
.layout-container {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.sidebar {
  width: 280px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.user-section {
  padding: 30px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
}

.user-branch {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
}

.menu {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 10px;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.menu-item.active {
  background-color: rgba(255, 255, 255, 0.2);
  border-left: 4px solid white;
}

.menu-item.logout {
  margin-top: auto;
  background-color: rgba(255, 255, 255, 0.1);
}

.menu-item.logout:hover {
  background-color: rgba(245, 108, 108, 0.3);
}

.menu-icon {
  font-size: 20px;
  width: 24px;
  text-align: center;
}

.menu-text {
  font-size: 15px;
  font-weight: 500;
}

.logout-section {
  margin-top: auto;
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.main-content {
  flex: 1;
  background-color: #f5f7fa;
  overflow-y: auto;
}
</style>
