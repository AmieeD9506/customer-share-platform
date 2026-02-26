const sequelize = require('./db');
const { BranchCompany, User, Customer } = require('./models');
const bcrypt = require('bcryptjs');

async function initDatabase() {
  try {
    console.log('开始初始化数据库...');

    // 创建分公司
    const branches = await BranchCompany.bulkCreate([
      {
        name: '销售部',
        address: '苏州市工业园区',
        contactPerson: '张经理',
        contactPhone: '13800138000'
      },
      {
        name: '市场部',
        address: '苏州市高新区',
        contactPerson: '李经理',
        contactPhone: '13900139000'
      },
      {
        name: '技术部',
        address: '苏州市吴中区',
        contactPerson: '王经理',
        contactPhone: '13700137000'
      }
    ]);

    console.log('分公司创建成功');

    // 创建用户
    const hashedPassword = await bcrypt.hash('123456', 10);
    const users = await User.bulkCreate([
      {
        username: 'admin',
        password: hashedPassword,
        name: '管理员',
        branchCompanyId: branches[0].id,
        role: 'admin'
      },
      {
        username: 'zhangsan',
        password: hashedPassword,
        name: '张三',
        branchCompanyId: branches[0].id,
        role: 'employee'
      },
      {
        username: 'lisi',
        password: hashedPassword,
        name: '李四',
        branchCompanyId: branches[1].id,
        role: 'employee'
      },
      {
        username: 'wangwu',
        password: hashedPassword,
        name: '王五',
        branchCompanyId: branches[2].id,
        role: 'employee'
      }
    ]);

    console.log('用户创建成功');

    // 创建客户
    const customers = await Customer.bulkCreate([
      {
        name: '苏州科技有限公司',
        contactPerson: '张三',
        contactPhone: '13800138001',
        email: 'zhangsan@example.com',
        address: '苏州市工业园区',
        industry: '科技',
        requirements: '需要开发企业管理系统',
        status: 'following',
        ownerBranchId: branches[0].id,
        ownerUserId: users[1].id,
        shared: false
      },
      {
        name: '苏州贸易公司',
        contactPerson: '李四',
        contactPhone: '13900139001',
        email: 'lisi@example.com',
        address: '苏州市高新区',
        industry: '贸易',
        requirements: '需要进销存系统',
        status: 'potential',
        ownerBranchId: branches[1].id,
        ownerUserId: users[2].id,
        shared: true
      },
      {
        name: '苏州制造公司',
        contactPerson: '王五',
        contactPhone: '13700137001',
        email: 'wangwu@example.com',
        address: '苏州市吴中区',
        industry: '制造',
        requirements: '需要生产管理系统',
        status: 'potential',
        ownerBranchId: branches[2].id,
        ownerUserId: users[3].id,
        shared: true
      }
    ]);

    console.log('客户创建成功');
    console.log('数据库初始化完成！');
    process.exit(0);
  } catch (error) {
    console.error('数据库初始化失败:', error);
    process.exit(1);
  }
}

initDatabase();