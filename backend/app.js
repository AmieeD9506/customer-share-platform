const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./db');
const config = require('./config');
const models = require('./models');

// 导入路由
const authRoutes = require('./routes/auth');
const branchCompanyRoutes = require('./routes/branch-companies');
const userRoutes = require('./routes/users');
const customerRoutes = require('./routes/customers');
const customerReclaimRoutes = require('./routes/customer-reclaims');
const followUpRoutes = require('./routes/follow-ups');

const app = express();

// 配置中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 同步数据库模型
sequelize.sync({ alter: true })
  .then(() => {
    console.log('数据库模型同步成功');
  })
  .catch((error) => {
    console.error('数据库模型同步失败:', error);
  });

// 健康检查路由
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 注册路由
app.use('/api/auth', authRoutes);
app.use('/api/branch-companies', branchCompanyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/customer-reclaims', customerReclaimRoutes);
app.use('/api/follow-ups', followUpRoutes);

// 启动服务器
app.listen(config.server.port, () => {
  console.log(`服务器运行在 http://localhost:${config.server.port}`);
});

module.exports = app;