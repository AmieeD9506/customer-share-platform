const express = require('express');
const router = express.Router();
const {
  getAllCustomers,
  getMyCustomers,
  getSharedCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  shareCustomer,
  unshareCustomer
} = require('../controllers/CustomerController');
const { authenticateToken } = require('../middleware/auth');

// 获取所有客户（包括共享的）
router.get('/', authenticateToken, getAllCustomers);

// 获取本公司的客户
router.get('/my', authenticateToken, getMyCustomers);

// 获取共享的客户
router.get('/shared', authenticateToken, getSharedCustomers);

// 获取单个客户
router.get('/:id', authenticateToken, getCustomerById);

// 创建客户
router.post('/', authenticateToken, createCustomer);

// 更新客户
router.put('/:id', authenticateToken, updateCustomer);

// 删除客户
router.delete('/:id', authenticateToken, deleteCustomer);

// 分享客户
router.post('/:id/share', authenticateToken, shareCustomer);

// 取消分享客户
router.post('/:id/unshare', authenticateToken, unshareCustomer);

module.exports = router;