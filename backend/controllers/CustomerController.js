const { Customer, CustomerShare } = require('../models');
const { Op } = require('sequelize');

// 获取所有客户（包括共享的）
async function getAllCustomers(req, res) {
  try {
    const { branchCompanyId } = req.user;
    
    // 获取本公司的客户和其他公司共享的客户
    const customers = await Customer.findAll({
      where: {
        [Op.or]: [
          { ownerBranchId: branchCompanyId },
          { shared: true }
        ]
      }
    });
    
    res.status(200).json(customers);
  } catch (error) {
    console.error('获取客户列表失败:', error);
    res.status(500).json({ message: '获取客户列表失败' });
  }
}

// 获取本公司的客户
async function getMyCustomers(req, res) {
  try {
    const { branchCompanyId } = req.user;
    
    const customers = await Customer.findAll({
      where: { ownerBranchId: branchCompanyId }
    });
    
    res.status(200).json(customers);
  } catch (error) {
    console.error('获取本公司客户失败:', error);
    res.status(500).json({ message: '获取本公司客户失败' });
  }
}

// 获取共享的客户
async function getSharedCustomers(req, res) {
  try {
    const { branchCompanyId } = req.user;
    
    // 获取其他公司共享的客户
    const customers = await Customer.findAll({
      where: {
        shared: true,
        ownerBranchId: { [Op.ne]: branchCompanyId }
      }
    });
    
    res.status(200).json(customers);
  } catch (error) {
    console.error('获取共享客户失败:', error);
    res.status(500).json({ message: '获取共享客户失败' });
  }
}

// 获取单个客户
async function getCustomerById(req, res) {
  try {
    const { branchCompanyId } = req.user;
    const customer = await Customer.findByPk(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: '客户不存在' });
    }
    
    // 检查权限：只有客户所属公司或共享客户才能查看
    if (customer.ownerBranchId !== branchCompanyId && !customer.shared) {
      return res.status(403).json({ message: '没有权限查看该客户' });
    }
    
    res.status(200).json(customer);
  } catch (error) {
    console.error('获取客户详情失败:', error);
    res.status(500).json({ message: '获取客户详情失败' });
  }
}

// 创建客户
async function createCustomer(req, res) {
  try {
    const { branchCompanyId, id: userId } = req.user;
    const { name, contactPerson, contactPhone, email, address, industry, requirements, status } = req.body;
    
    const customer = await Customer.create({
      name,
      contactPerson,
      contactPhone,
      email,
      address,
      industry,
      requirements,
      status: status || 'potential',
      ownerBranchId: branchCompanyId,
      ownerUserId: userId,
      shared: false
    });
    
    res.status(201).json({ message: '客户创建成功', customer });
  } catch (error) {
    console.error('创建客户失败:', error);
    res.status(500).json({ message: '创建客户失败' });
  }
}

// 更新客户
async function updateCustomer(req, res) {
  try {
    const { branchCompanyId } = req.user;
    const customer = await Customer.findByPk(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: '客户不存在' });
    }
    
    // 检查权限：只有客户所属公司才能更新
    if (customer.ownerBranchId !== branchCompanyId) {
      return res.status(403).json({ message: '没有权限更新该客户' });
    }
    
    const { name, contactPerson, contactPhone, email, address, industry, requirements, status } = req.body;
    
    await customer.update({
      name,
      contactPerson,
      contactPhone,
      email,
      address,
      industry,
      requirements,
      status
    });
    
    res.status(200).json({ message: '客户更新成功', customer });
  } catch (error) {
    console.error('更新客户失败:', error);
    res.status(500).json({ message: '更新客户失败' });
  }
}

// 删除客户
async function deleteCustomer(req, res) {
  try {
    const { branchCompanyId } = req.user;
    const customer = await Customer.findByPk(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: '客户不存在' });
    }
    
    // 检查权限：只有客户所属公司才能删除
    if (customer.ownerBranchId !== branchCompanyId) {
      return res.status(403).json({ message: '没有权限删除该客户' });
    }
    
    await customer.destroy();
    res.status(200).json({ message: '客户删除成功' });
  } catch (error) {
    console.error('删除客户失败:', error);
    res.status(500).json({ message: '删除客户失败' });
  }
}

// 分享客户
async function shareCustomer(req, res) {
  try {
    const { branchCompanyId, id: userId } = req.user;
    const customer = await Customer.findByPk(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: '客户不存在' });
    }
    
    // 检查权限：只有客户所属公司才能分享
    if (customer.ownerBranchId !== branchCompanyId) {
      return res.status(403).json({ message: '没有权限分享该客户' });
    }
    
    // 标记客户为共享
    await customer.update({ shared: true });
    
    // 记录分享记录
    await CustomerShare.create({
      customerId: customer.id,
      shareFromBranchId: branchCompanyId,
      shareFromUserId: userId,
      shareReason: req.body.shareReason || ''
    });
    
    res.status(200).json({ message: '客户分享成功', customer });
  } catch (error) {
    console.error('分享客户失败:', error);
    res.status(500).json({ message: '分享客户失败' });
  }
}

// 取消分享客户
async function unshareCustomer(req, res) {
  try {
    const { branchCompanyId } = req.user;
    const customer = await Customer.findByPk(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: '客户不存在' });
    }
    
    // 检查权限：只有客户所属公司才能取消分享
    if (customer.ownerBranchId !== branchCompanyId) {
      return res.status(403).json({ message: '没有权限取消分享该客户' });
    }
    
    // 取消分享
    await customer.update({ shared: false });
    
    res.status(200).json({ message: '客户取消分享成功', customer });
  } catch (error) {
    console.error('取消分享客户失败:', error);
    res.status(500).json({ message: '取消分享客户失败' });
  }
}

module.exports = {
  getAllCustomers,
  getMyCustomers,
  getSharedCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  shareCustomer,
  unshareCustomer
};