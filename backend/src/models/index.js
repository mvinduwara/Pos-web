import sequelize from '../config/database.js';
import User from './User.js';
import Product from './Product.js';
import Transaction from './Transaction.js';
import TransactionItem from './TransactionItem.js';

User.hasMany(Transaction, { foreignKey: 'user_id' });
Transaction.belongsTo(User, { foreignKey: 'user_id' });

Transaction.hasMany(TransactionItem, { foreignKey: 'transaction_id' });
TransactionItem.belongsTo(Transaction, { foreignKey: 'transaction_id' });

Product.hasMany(TransactionItem, { foreignKey: 'product_id' });
TransactionItem.belongsTo(Product, { foreignKey: 'product_id' });

export { sequelize, User, Product, Transaction, TransactionItem };