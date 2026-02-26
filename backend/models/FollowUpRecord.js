const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Customer = require('./Customer');
const BranchCompany = require('./BranchCompany');
const User = require('./User');

const FollowUpRecord = sequelize.define('FollowUpRecord', {
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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: BranchCompany,
      key: 'id'
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  nextFollowUp: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'follow_up_records',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// 关联关系
FollowUpRecord.belongsTo(Customer, { foreignKey: 'customerId' });
FollowUpRecord.belongsTo(User, { foreignKey: 'userId' });
FollowUpRecord.belongsTo(BranchCompany, { foreignKey: 'branchId' });

module.exports = FollowUpRecord;