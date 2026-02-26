const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const BranchCompany = require('./BranchCompany');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  branchCompanyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: BranchCompany,
      key: 'id'
    }
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'employee'
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// 关联关系
User.belongsTo(BranchCompany, { foreignKey: 'branchCompanyId' });
BranchCompany.hasMany(User, { foreignKey: 'branchCompanyId' });

module.exports = User;