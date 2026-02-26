const { FollowUpRecord, Customer } = require('../models');

// 获取所有跟进记录
async function getAllFollowUps(req, res) {
  try {
    const { branchCompanyId } = req.user;
    
    // 获取本公司的跟进记录
    const followUps = await FollowUpRecord.findAll({
      where: { branchId: branchCompanyId },
      include: [{ model: Customer, as: 'customer' }],
      order: [['created_at', 'DESC']]
    });
    
    res.status(200).json(followUps);
  } catch (error) {
    console.error('获取跟进记录列表失败:', error);
    res.status(500).json({ message: '获取跟进记录列表失败' });
  }
}

// 获取某个客户的跟进记录
async function getCustomerFollowUps(req, res) {
  try {
    const { branchCompanyId } = req.user;
    const customerId = req.params.customerId;
    
    // 检查客户是否存在
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      return res.status(404).json({ message: '客户不存在' });
    }
    
    // 检查权限：只有客户所属公司或共享客户才能查看跟进记录
    if (customer.ownerBranchId !== branchCompanyId && !customer.shared) {
      return res.status(403).json({ message: '没有权限查看该客户的跟进记录' });
    }
    
    const followUps = await FollowUpRecord.findAll({
      where: { customerId },
      include: [{ model: Customer, as: 'customer' }],
      order: [['created_at', 'DESC']]
    });
    
    res.status(200).json(followUps);
  } catch (error) {
    console.error('获取客户跟进记录失败:', error);
    res.status(500).json({ message: '获取客户跟进记录失败' });
  }
}

// 获取待跟进的客户
async function getPendingFollowUps(req, res) {
  try {
    const { branchCompanyId } = req.user;
    
    // 获取本公司的客户
    const customers = await Customer.findAll({
      where: { ownerBranchId: branchCompanyId }
    });
    
    // 获取所有跟进记录
    const followUps = await FollowUpRecord.findAll({
      where: { branchId: branchCompanyId },
      order: [['nextFollowUp', 'ASC']]
    });
    
    // 找出需要跟进的客户
    const pendingFollowUps = followUps.filter(f => f.nextFollowUp && new Date(f.nextFollowUp) <= new Date());
    
    res.status(200).json(pendingFollowUps);
  } catch (error) {
    console.error('获取待跟进客户失败:', error);
    res.status(500).json({ message: '获取待跟进客户失败' });
  }
}

// 获取单个跟进记录
async function getFollowUpById(req, res) {
  try {
    const { branchCompanyId } = req.user;
    const followUp = await FollowUpRecord.findByPk(req.params.id, {
      include: [{ model: Customer, as: 'customer' }]
    });
    
    if (!followUp) {
      return res.status(404).json({ message: '跟进记录不存在' });
    }
    
    // 检查权限：只有跟进记录所属公司才能查看
    if (followUp.branchId !== branchCompanyId) {
      return res.status(403).json({ message: '没有权限查看该跟进记录' });
    }
    
    res.status(200).json(followUp);
  } catch (error) {
    console.error('获取跟进记录详情失败:', error);
    res.status(500).json({ message: '获取跟进记录详情失败' });
  }
}

// 创建跟进记录
async function createFollowUp(req, res) {
  try {
    const { branchCompanyId, id: userId } = req.user;
    const { customerId, content, nextFollowUp } = req.body;
    
    // 检查客户是否存在
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      return res.status(404).json({ message: '客户不存在' });
    }
    
    // 检查权限：只有客户所属公司才能添加跟进记录
    if (customer.ownerBranchId !== branchCompanyId) {
      return res.status(403).json({ message: '没有权限为该客户添加跟进记录' });
    }
    
    const followUp = await FollowUpRecord.create({
      customerId,
      userId,
      branchId: branchCompanyId,
      content,
      nextFollowUp
    });
    
    res.status(201).json({ message: '跟进记录创建成功', followUp });
  } catch (error) {
    console.error('创建跟进记录失败:', error);
    res.status(500).json({ message: '创建跟进记录失败' });
  }
}

// 更新跟进记录
async function updateFollowUp(req, res) {
  try {
    const { branchCompanyId } = req.user;
    const followUp = await FollowUpRecord.findByPk(req.params.id);
    
    if (!followUp) {
      return res.status(404).json({ message: '跟进记录不存在' });
    }
    
    // 检查权限：只有跟进记录所属公司才能更新
    if (followUp.branchId !== branchCompanyId) {
      return res.status(403).json({ message: '没有权限更新该跟进记录' });
    }
    
    const { content, nextFollowUp } = req.body;
    
    await followUp.update({
      content,
      nextFollowUp
    });
    
    res.status(200).json({ message: '跟进记录更新成功', followUp });
  } catch (error) {
    console.error('更新跟进记录失败:', error);
    res.status(500).json({ message: '更新跟进记录失败' });
  }
}

// 删除跟进记录
async function deleteFollowUp(req, res) {
  try {
    const { branchCompanyId } = req.user;
    const followUp = await FollowUpRecord.findByPk(req.params.id);
    
    if (!followUp) {
      return res.status(404).json({ message: '跟进记录不存在' });
    }
    
    // 检查权限：只有跟进记录所属公司才能删除
    if (followUp.branchId !== branchCompanyId) {
      return res.status(403).json({ message: '没有权限删除该跟进记录' });
    }
    
    await followUp.destroy();
    res.status(200).json({ message: '跟进记录删除成功' });
  } catch (error) {
    console.error('删除跟进记录失败:', error);
    res.status(500).json({ message: '删除跟进记录失败' });
  }
}

module.exports = {
  getAllFollowUps,
  getCustomerFollowUps,
  getPendingFollowUps,
  getFollowUpById,
  createFollowUp,
  updateFollowUp,
  deleteFollowUp
};