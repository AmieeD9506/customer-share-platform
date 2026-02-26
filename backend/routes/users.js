const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/UserController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// 获取所有用户（需要管理员权限）
router.get('/', authenticateToken, authorizeAdmin, getAllUsers);

// 获取单个用户
router.get('/:id', authenticateToken, getUserById);

// 创建用户（需要管理员权限）
router.post('/', authenticateToken, authorizeAdmin, createUser);

// 更新用户
router.put('/:id', authenticateToken, updateUser);

// 删除用户（需要管理员权限）
router.delete('/:id', authenticateToken, authorizeAdmin, deleteUser);

module.exports = router;