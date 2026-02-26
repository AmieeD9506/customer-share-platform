const express = require('express');
const router = express.Router();
const {
  getAllBranchCompanies,
  getBranchCompanyById,
  createBranchCompany,
  updateBranchCompany,
  deleteBranchCompany
} = require('../controllers/BranchCompanyController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// 获取所有分公司
router.get('/', authenticateToken, getAllBranchCompanies);

// 获取单个分公司
router.get('/:id', authenticateToken, getBranchCompanyById);

// 创建分公司（需要管理员权限）
router.post('/', authenticateToken, authorizeAdmin, createBranchCompany);

// 更新分公司（需要管理员权限）
router.put('/:id', authenticateToken, authorizeAdmin, updateBranchCompany);

// 删除分公司（需要管理员权限）
router.delete('/:id', authenticateToken, authorizeAdmin, deleteBranchCompany);

module.exports = router;