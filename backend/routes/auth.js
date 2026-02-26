const express = require('express');
const router = express.Router();
const { login, register, getCurrentUser } = require('../controllers/AuthController');
const { authenticateToken } = require('../middleware/auth');

// 登录
router.post('/login', login);

// 注册
router.post('/register', register);

// 获取当前用户信息
router.get('/me', authenticateToken, getCurrentUser);

module.exports = router;