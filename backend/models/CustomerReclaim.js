const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Customer = require('./Customer');
const BranchCompany = require('./BranchCompany');
const User = require('./User');

const CustomerReclaim = sequelize.define('CustomerReclaim', {
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
  reclaimFromBranchId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: BranchCompany,
      key: 'id'
    }
  },
  reclaimFromUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  reclaimReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending'
  }
}, {
  tableName: 'customer_reclaims',
  timestamps: true,
  createdAt: 'reclaim_time',
  updatedAt: 'updated_at'
});

// 关联关系
CustomerReclaim.belongsTo(Customer, { foreignKey: 'customerId' });
CustomerReclaim.belongsTo(BranchCompany, { foreignKey: 'reclaimFromBranchId', as: 'reclaimFromBranch' });
CustomerReclaim.belongsTo(User, { foreignKey: 'reclaimFromUserId', as: 'reclaimFromUser' });

module.exports = CustomerReclaim;