import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER
  },
  total: {
    type: DataTypes.DECIMAL(10, 2)
  },
  payment_method: {
    type: DataTypes.ENUM('cash', 'card', 'digital')
  },
  status: {
    type: DataTypes.ENUM('completed', 'pending', 'refunded')
  }
}, {
  tableName: 'transactions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

export default Transaction;