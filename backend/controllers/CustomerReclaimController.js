const { CustomerReclaim, Customer } = require('../models');
const { Op } = require('sequelize');

// 获取所有捡回申请
async function getAllReclaims(req, res) {
  try {
    const { branchCompanyId } = req.user;
    
    // 获取本公司的捡回申请和针对本公司客户的捡回申请
    const reclaims = await CustomerReclaim.findAll({
      where: {
        [Op.or]: [
          { reclaimFromBranchId: branchCompanyId },
          { '$customer.ownerBranchId$': branchCompanyId }
        ]
      },
      include: [{ model: Customer, as: 'customer' }]
    });
    
    res.status(200).json(reclaims);
  } catch (error) {
    console.error('获取捡回申请列表失败:', error);
    res.status(500).json({ message: '获取捡回申请列表失败' });
  }
}

// 获取待审批的捡回申请（针对本公司客户）
async function getPendingReclaims(req, res) {
  try {
    const { branchCompanyId } = req.user;
    
    const reclaims = await CustomerReclaim.findAll({
      where: { status: 'pending' },
      include: [
        { 
          model: Customer, 
          as: 'customer',
          where: { ownerBranchId: branchCompanyId }
        }
      ]
    });
    
    res.status(200).json(reclaims);
  } catch (error) {
    console.error('获取待审批捡回申请失败:', error);
    res.status(500).json({ message: '获取待审批捡回申请失败' });
  }
}

// 获取单个捡回申请
async function getReclaimById(req, res) {
  try {
    const { branchCompanyId } = req.user;
    const reclaim = await CustomerReclaim.findByPk(req.params.id, {
      include: [{ model: Customer, as: 'customer' }]
    });
    
    if (!reclaim) {
      return res.status(404).json({ message: '捡回申请不存在' });
    }
    
    // 检查权限：只有捡回方或客户所属方才能查看
    if (reclaim.reclaimFromBranchId !== branchCompanyId && 
        reclaim.customer.ownerBranchId !== branchCompanyId) {
      return res.status(403).json({ message: '没有权限查看该捡回申请' });
    }
    
    res.status(200).json(reclaim);
  } catch (error) {
    console.error('获取捡回申请详情失败:', error);
    res.status(500).json({ message: '获取捡回申请详情失败' });
  }
}

// 创建捡回申请
async function createReclaim(req, res) {
  try {
    const { branchCompanyId, id: userId } = req.user;
    const { customerId, reclaimReason } = req.body;
    
    // 检查客户是否存在
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      return res.status(404).json({ message: '客户不存在' });
    }
    
    // 检查客户是否已共享
    if (!customer.shared) {
      return res.status(400).json({ message: '该客户未共享，无法捡回' });
    }
    
    // 检查客户是否属于本公司
    if (customer.ownerBranchId === branchCompanyId) {
      return res.status(400).json({ message: '该客户属于本公司，无需捡回' });
    }
    
    // 检查是否已有待审批的捡回申请
    const existingReclaim = await CustomerReclaim.findOne({
      where: {
        customerId,
        status: 'pending'
      }
    });
    
    if (existingReclaim) {
      return res.status(400).json({ message: '该客户已有待审批的捡回申请' });
    }
    
    const reclaim = await CustomerReclaim.create({
      customerId,
      reclaimFromBranchId: branchCompanyId,
      reclaimFromUserId: userId,
      reclaimReason,
      status: 'pending'
    });
    
    res.status(201).json({ message: '捡回申请创建成功', reclaim });
  } catch (error) {
    console.error('创建捡回申请失败:', error);
    res.status(500).json({ message: '创建捡回申请失败' });
  }
}

// 审批捡回申请
async function approveReclaim(req, res) {
  try {
    const { branchCompanyId } = req.user;
    const reclaim = await CustomerReclaim.findByPk(req.params.id, {
      include: [{ model: Customer, as: 'customer' }]
    });
    
    if (!reclaim) {
      return res.status(404).json({ message: '捡回申请不存在' });
    }
    
    // 检查权限：只有客户所属公司才能审批
    if (reclaim.customer.ownerBranchId !== branchCompanyId) {
      return res.status(403).json({ message: '没有权限审批该捡回申请' });
    }
    
    // 检查申请状态
    if (reclaim.status !== 'pending') {
      return res.status(400).json({ message: '该申请已被处理' });
    }
    
    // 更新捡回申请状态
    await reclaim.update({ status: 'approved' });
    
    // 转移客户归属权
    await reclaim.customer.update({
      ownerBranchId: reclaim.reclaimFromBranchId,
      ownerUserId: reclaim.reclaimFromUserId,
      shared: false
    });
    
    res.status(200).json({ message: '捡回申请已批准', reclaim });
  } catch (error) {
    console.error('批准捡回申请失败:', error);
    res.status(500).json({ message: '批准捡回申请失败' });
  }
}

// 拒绝捡回申请
async function rejectReclaim(req, res) {
  try {
    const { branchCompanyId } = req.user;
    const reclaim = await CustomerReclaim.findByPk(req.params.id, {
      include: [{ model: Customer, as: 'customer' }]
    });
    
    if (!reclaim) {
      return res.status(404).json({ message: '捡回申请不存在' });
    }
    
    // 检查权限：只有客户所属公司才能审批
    if (reclaim.customer.ownerBranchId !== branchCompanyId) {
      return res.status(403).json({ message: '没有权限审批该捡回申请' });
    }
    
    // 检查申请状态
    if (reclaim.status !== 'pending') {
      return res.status(400).json({ message: '该申请已被处理' });
    }
    
    // 更新捡回申请状态
    await reclaim.update({ status: 'rejected' });
    
    res.status(200).json({ message: '捡回申请已拒绝', reclaim });
  } catch (error) {
    console.error('拒绝捡回申请失败:', error);
    res.status(500).json({ message: '拒绝捡回申请失败' });
  }
}

module.exports = {
  getAllReclaims,
  getPendingReclaims,
  getReclaimById,
  createReclaim,
  approveReclaim,
  rejectReclaim
};