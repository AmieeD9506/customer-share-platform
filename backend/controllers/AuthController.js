const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const config = require('../config');

// 登录
async function login(req, res) {
  try {
    const { username, password } = req.body;

    // 查找用户
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 生成JWT令牌
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, branchCompanyId: user.branchCompanyId },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.status(200).json({ token, user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      branchCompanyId: user.branchCompanyId
    }});
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ message: '登录失败' });
  }
}

// 注册
async function register(req, res) {
  try {
    const { username, password, name, branchCompanyId, role } = req.body;

    // 检查用户名是否已存在
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: '用户名已存在' });
    }

    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await User.create({
      username,
      password: hashedPassword,
      name,
      branchCompanyId,
      role: role || 'employee'
    });

    res.status(201).json({ message: '注册成功', user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      branchCompanyId: user.branchCompanyId
    }});
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({ message: '注册失败' });
  }
}

// 获取当前用户信息
async function getCurrentUser(req, res) {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'name', 'role', 'branchCompanyId']
    });
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({ message: '获取用户信息失败' });
  }
}

module.exports = {
  login,
  register,
  getCurrentUser
};