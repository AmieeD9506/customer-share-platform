const express = require('express');
const router = express.Router();
const {
  getAllFollowUps,
  getCustomerFollowUps,
  getPendingFollowUps,
  getFollowUpById,
  createFollowUp,
  updateFollowUp,
  deleteFollowUp
} = require('../controllers/FollowUpController');
const { authenticateToken } = require('../middleware/auth');

// 获取所有跟进记录
router.get('/', authenticateToken, getAllFollowUps);

// 获取待跟进的客户
router.get('/pending', authenticateToken, getPendingFollowUps);

// 获取某个客户的跟进记录
router.get('/customer/:customerId', authenticateToken, getCustomerFollowUps);

// 获取单个跟进记录
router.get('/:id', authenticateToken, getFollowUpById);

// 创建跟进记录
router.post('/', authenticateToken, createFollowUp);

// 更新跟进记录
router.put('/:id', authenticateToken, updateFollowUp);

// 删除跟进记录
router.delete('/:id', authenticateToken, deleteFollowUp);

module.exports = router;