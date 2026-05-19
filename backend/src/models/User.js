import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true
  },
  password_hash: {
    type: DataTypes.STRING(255)
  },
  role: {
    type: DataTypes.ENUM('admin', 'cashier', 'manager'),
    defaultValue: 'cashier'
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

export default User;