const { BranchCompany } = require('../models');

// 获取所有分公司
async function getAllBranchCompanies(req, res) {
  try {
    const branchCompanies = await BranchCompany.findAll();
    res.status(200).json(branchCompanies);
  } catch (error) {
    console.error('获取分公司列表失败:', error);
    res.status(500).json({ message: '获取分公司列表失败' });
  }
}

// 获取单个分公司
async function getBranchCompanyById(req, res) {
  try {
    const branchCompany = await BranchCompany.findByPk(req.params.id);
    if (!branchCompany) {
      return res.status(404).json({ message: '分公司不存在' });
    }
    res.status(200).json(branchCompany);
  } catch (error) {
    console.error('获取分公司详情失败:', error);
    res.status(500).json({ message: '获取分公司详情失败' });
  }
}

// 创建分公司
async function createBranchCompany(req, res) {
  try {
    const { name, address, contactPerson, contactPhone } = req.body;

    // 检查分公司名称是否已存在
    const existingBranchCompany = await BranchCompany.findOne({ where: { name } });
    if (existingBranchCompany) {
      return res.status(400).json({ message: '分公司名称已存在' });
    }

    const branchCompany = await BranchCompany.create({
      name,
      address,
      contactPerson,
      contactPhone
    });

    res.status(201).json({ message: '分公司创建成功', branchCompany });
  } catch (error) {
    console.error('创建分公司失败:', error);
    res.status(500).json({ message: '创建分公司失败' });
  }
}

// 更新分公司
async function updateBranchCompany(req, res) {
  try {
    const branchCompany = await BranchCompany.findByPk(req.params.id);
    if (!branchCompany) {
      return res.status(404).json({ message: '分公司不存在' });
    }

    const { name, address, contactPerson, contactPhone } = req.body;

    // 检查分公司名称是否已存在（排除当前分公司）
    if (name !== branchCompany.name) {
      const existingBranchCompany = await BranchCompany.findOne({ where: { name } });
      if (existingBranchCompany) {
        return res.status(400).json({ message: '分公司名称已存在' });
      }
    }

    await branchCompany.update({
      name,
      address,
      contactPerson,
      contactPhone
    });

    res.status(200).json({ message: '分公司更新成功', branchCompany });
  } catch (error) {
    console.error('更新分公司失败:', error);
    res.status(500).json({ message: '更新分公司失败' });
  }
}

// 删除分公司
async function deleteBranchCompany(req, res) {
  try {
    const branchCompany = await BranchCompany.findByPk(req.params.id);
    if (!branchCompany) {
      return res.status(404).json({ message: '分公司不存在' });
    }

    await branchCompany.destroy();
    res.status(200).json({ message: '分公司删除成功' });
  } catch (error) {
    console.error('删除分公司失败:', error);
    res.status(500).json({ message: '删除分公司失败' });
  }
}

module.exports = {
  getAllBranchCompanies,
  getBranchCompanyById,
  createBranchCompany,
  updateBranchCompany,
  deleteBranchCompany
};