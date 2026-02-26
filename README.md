# 客户信息共享平台

一个为苏州各分公司设计的客户信息共享平台，实现客户资源的有效流转和跟进管理。

## 功能特性

### 用户管理
- 分公司管理：创建和管理各分公司信息
- 用户认证：基于JWT的登录认证
- 角色权限：管理员和员工两种角色

### 客户管理
- 客户信息录入：基本信息、联系方式、业务需求等
- 客户分类：按行业、需求类型等分类
- 客户状态：潜在、跟进中、已成交、已放弃等

### 客户分享
- 分享设置：将客户信息分享给其他分公司
- 分享通知：分享后通知其他分公司
- 分享记录：追踪客户分享历史

### 客户捡回
- 捡回申请：其他分公司申请捡回客户
- 捡回审批：原分公司审批捡回请求
- 捡回记录：追踪客户捡回历史

### 跟进管理
- 跟进记录：记录客户沟通内容和进展
- 跟进提醒：设置跟进时间和提醒
- 跟进统计：分析跟进效果和转化率

## 技术栈

### 前端
- Vue.js 3.4
- Element Plus 2.4
- Vue Router 4.2
- Axios 1.6
- Vite 5.0

### 后端
- Node.js
- Express 4.18
- SQLite 3
- Sequelize 6.35
- JWT 9.0
- Bcryptjs 2.4

## 项目结构

```
customer-share-platform/
├── frontend/                 # 前端项目
│   ├── src/
│   │   ├── api/             # API接口
│   │   ├── components/      # 组件
│   │   ├── router/          # 路由配置
│   │   ├── utils/           # 工具函数
│   │   ├── views/           # 页面组件
│   │   ├── App.vue          # 根组件
│   │   └── main.js          # 入口文件
│   ├── index.html           # HTML模板
│   ├── package.json         # 依赖配置
│   └── vite.config.js       # Vite配置
└── backend/                  # 后端项目
    ├── config.js            # 配置文件
    ├── db.js                # 数据库连接
    ├── app.js               # 应用入口
    ├── init.js              # 数据库初始化
    ├── controllers/         # 控制器
    ├── middleware/          # 中间件
    ├── models/              # 数据模型
    └── routes/              # 路由配置
```

## 快速开始

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装Node.js

如果系统中没有安装Node.js，请先安装：

1. 访问 [Node.js官网](https://nodejs.org/)
2. 下载并安装LTS版本
3. 安装完成后，在终端中运行以下命令验证安装：
```bash
node --version
npm --version
```

### 后端安装

1. 进入后端目录
```bash
cd customer-share-platform/backend
```

2. 安装依赖
```bash
npm install
```

3. 初始化数据库
```bash
node init.js
```

4. 启动后端服务
```bash
npm start
```

后端服务将运行在 http://localhost:3000

### 前端安装

1. 进入前端目录
```bash
cd customer-share-platform/frontend
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

前端服务将运行在 http://localhost:8080

## 默认账号

系统初始化后会创建以下默认账号：

| 用户名 | 密码 | 角色 | 所属分公司 |
|--------|------|------|------------|
| admin | 123456 | 管理员 | 销售部 |
| zhangsan | 123456 | 员工 | 销售部 |
| lisi | 123456 | 员工 | 市场部 |
| wangwu | 123456 | 员工 | 技术部 |

## 使用说明

### 登录系统
1. 访问 http://localhost:8080
2. 输入用户名和密码
3. 点击登录按钮

### 客户管理
1. 点击"客户管理"菜单
2. 点击"新增客户"按钮创建客户
3. 点击"编辑"按钮修改客户信息
4. 点击"共享"按钮将客户分享给其他分公司
5. 点击"删除"按钮删除客户

### 共享客户
1. 点击"共享客户"菜单
2. 查看其他分公司共享的客户
3. 点击"捡回"按钮申请捡回客户

### 跟进管理
1. 点击"跟进管理"菜单
2. 查看跟进记录和待跟进客户
3. 添加新的跟进记录
4. 设置下次跟进时间

### 系统设置
1. 点击"系统设置"菜单
2. 管理分公司信息
3. 管理用户信息

## API文档

### 认证接口
- POST /api/auth/login - 用户登录
- POST /api/auth/register - 用户注册
- GET /api/auth/me - 获取当前用户信息

### 分公司接口
- GET /api/branch-companies - 获取所有分公司
- POST /api/branch-companies - 创建分公司
- PUT /api/branch-companies/:id - 更新分公司
- DELETE /api/branch-companies/:id - 删除分公司

### 用户接口
- GET /api/users - 获取所有用户
- POST /api/users - 创建用户
- PUT /api/users/:id - 更新用户
- DELETE /api/users/:id - 删除用户

### 客户接口
- GET /api/customers - 获取所有客户
- GET /api/customers/my - 获取本公司的客户
- GET /api/customers/shared - 获取共享的客户
- POST /api/customers - 创建客户
- PUT /api/customers/:id - 更新客户
- DELETE /api/customers/:id - 删除客户
- POST /api/customers/:id/share - 共享客户
- POST /api/customers/:id/unshare - 取消共享客户

### 捡回接口
- GET /api/customer-reclaims - 获取所有捡回申请
- GET /api/customer-reclaims/pending - 获取待审批的捡回申请
- POST /api/customer-reclaims - 创建捡回申请
- POST /api/customer-reclaims/:id/approve - 批准捡回申请
- POST /api/customer-reclaims/:id/reject - 拒绝捡回申请

### 跟进接口
- GET /api/follow-ups - 获取所有跟进记录
- GET /api/follow-ups/pending - 获取待跟进的客户
- POST /api/follow-ups - 创建跟进记录
- PUT /api/follow-ups/:id - 更新跟进记录
- DELETE /api/follow-ups/:id - 删除跟进记录

## 注意事项

1. 首次使用前请确保MySQL数据库已正确配置
2. 建议在生产环境中修改默认密码
3. 定期备份数据库数据
4. 根据实际需求调整系统配置

## 许可证

MIT License