const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const BranchCompany = require('./BranchCompany');
const User = require('./User');

const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contactPerson: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contactPhone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  industry: {
    type: DataTypes.STRING,
    allowNull: true
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'potential'
  },
  ownerBranchId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: BranchCompany,
      key: 'id'
    }
  },
  ownerUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  shared: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'customers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// 关联关系
Customer.belongsTo(BranchCompany, { foreignKey: 'ownerBranchId', as: 'ownerBranch' });
Customer.belongsTo(User, { foreignKey: 'ownerUserId', as: 'ownerUser' });

module.exports = Customer;