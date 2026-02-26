const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Customer = require('./Customer');
const BranchCompany = require('./BranchCompany');
const User = require('./User');

const CustomerShare = sequelize.define('CustomerShare', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Customer,
      key: 'id'
    }
  },
  shareFromBranchId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: BranchCompany,
      key: 'id'
    }
  },
  shareFromUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  shareReason: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'customer_shares',
  timestamps: true,
  createdAt: 'share_time',
  updatedAt: false
});

// 关联关系
CustomerShare.belongsTo(Customer, { foreignKey: 'customerId' });
CustomerShare.belongsTo(BranchCompany, { foreignKey: 'shareFromBranchId', as: 'shareFromBranch' });
CustomerShare.belongsTo(User, { foreignKey: 'shareFromUserId', as: 'shareFromUser' });

module.exports = CustomerShare;