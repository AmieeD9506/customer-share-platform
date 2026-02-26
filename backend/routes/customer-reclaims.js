const express = require('express');
const router = express.Router();
const {
  getAllReclaims,
  getPendingReclaims,
  getReclaimById,
  createReclaim,
  approveReclaim,
  rejectReclaim
} = require('../controllers/CustomerReclaimController');
const { authenticateToken } = require('../middleware/auth');

// 获取所有捡回申请
router.get('/', authenticateToken, getAllReclaims);

// 获取待审批的捡回申请
router.get('/pending', authenticateToken, getPendingReclaims);

// 获取单个捡回申请
router.get('/:id', authenticateToken, getReclaimById);

// 创建捡回申请
router.post('/', authenticateToken, createReclaim);

// 批准捡回申请
router.post('/:id/approve', authenticateToken, approveReclaim);

// 拒绝捡回申请
router.post('/:id/reject', authenticateToken, rejectReclaim);

module.exports = router;