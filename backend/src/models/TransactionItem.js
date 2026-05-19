import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const TransactionItem = sequelize.define('TransactionItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  transaction_id: {
    type: DataTypes.INTEGER
  },
  product_id: {
    type: DataTypes.INTEGER
  },
  quantity: {
    type: DataTypes.INTEGER
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2)
  }
}, {
  tableName: 'transaction_items',
  timestamps: false
});

export default TransactionItem;