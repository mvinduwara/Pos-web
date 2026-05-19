import { sequelize, Transaction, TransactionItem, Product } from '../models/index.js';

export const createTransaction = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { items, payment_method } = req.body;
    const user_id = req.user.id;
    let total = 0;
    for (const item of items) {
      const product = await Product.findByPk(item.product_id, { transaction: t });
      if (!product || product.stock < item.quantity) {
        await t.rollback();
        return res.status(400).json({ message: `Product ID ${item.product_id} is unavailable or out of stock` });
      }
      total += parseFloat(product.price) * item.quantity;
    }
    const transaction = await Transaction.create({
      user_id,
      total,
      payment_method,
      status: 'completed'
    }, { transaction: t });
    for (const item of items) {
      const product = await Product.findByPk(item.product_id, { transaction: t });
      await TransactionItem.create({
        transaction_id: transaction.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: product.price
      }, { transaction: t });
      await product.update({ stock: product.stock - item.quantity }, { transaction: t });
    }
    await t.commit();
    res.status(201).json(transaction);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Transaction failed', error: error.message });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: [{ model: TransactionItem }]
    });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
};