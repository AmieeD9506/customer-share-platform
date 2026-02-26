const bcrypt = require('bcryptjs');
const { User } = require('../models');

// 获取所有用户
async function getAllUsers(req, res) {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'name', 'branchCompanyId', 'role', 'created_at']
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('获取用户列表失败:', error);
    res.status(500).json({ message: '获取用户列表失败' });
  }
}

// 获取单个用户
async function getUserById(req, res) {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'username', 'name', 'branchCompanyId', 'role', 'created_at']
    });
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('获取用户详情失败:', error);
    res.status(500).json({ message: '获取用户详情失败' });
  }
}

// 创建用户
async function createUser(req, res) {
  try {
    const { username, password, name, branchCompanyId, role } = req.body;

    // 检查用户名是否已存在
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: '用户名已存在' });
    }

    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      name,
      branchCompanyId,
      role: role || 'employee'
    });

    res.status(201).json({ message: '用户创建成功', user: {
      id: user.id,
      username: user.username,
      name: user.name,
      branchCompanyId: user.branchCompanyId,
      role: user.role
    }});
  } catch (error) {
    console.error('创建用户失败:', error);
    res.status(500).json({ message: '创建用户失败' });
  }
}

// 更新用户
async function updateUser(req, res) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    const { username, password, name, branchCompanyId, role } = req.body;

    // 检查用户名是否已存在（排除当前用户）
    if (username !== user.username) {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ message: '用户名已存在' });
      }
    }

    // 构建更新对象
    const updateData = {
      username,
      name,
      branchCompanyId,
      role
    };

    // 如果提供了新密码，则加密更新
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await user.update(updateData);

    res.status(200).json({ message: '用户更新成功', user: {
      id: user.id,
      username: user.username,
      name: user.name,
      branchCompanyId: user.branchCompanyId,
      role: user.role
    }});
  } catch (error) {
    console.error('更新用户失败:', error);
    res.status(500).json({ message: '更新用户失败' });
  }
}

// 删除用户
async function deleteUser(req, res) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    await user.destroy();
    res.status(200).json({ message: '用户删除成功' });
  } catch (error) {
    console.error('删除用户失败:', error);
    res.status(500).json({ message: '删除用户失败' });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};