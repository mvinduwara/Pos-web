import bcrypt from 'bcryptjs';
import { sequelize, User, Product } from './src/models/index.js';

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // This resets the database tables!

    console.log('Database synced. Seeding data...');

    // 1. Create a Test Admin User
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash('password123', salt);
    
    await User.create({
      name: 'Admin User',
      email: 'admin@pos.com',
      password_hash,
      role: 'admin'
    });

    // 2. Create Test Products
    await Product.bulkCreate([
      { sku: 'ITEM-001', name: 'Wireless Mouse', price: 25.99, stock: 50, category: 'Electronics' },
      { sku: 'ITEM-002', name: 'Mechanical Keyboard', price: 89.50, stock: 30, category: 'Electronics' },
      { sku: 'ITEM-003', name: 'Coffee Mug', price: 12.00, stock: 100, category: 'Home' },
      { sku: 'ITEM-004', name: 'Notebook', price: 5.50, stock: 200, category: 'Stationery' },
      { sku: 'ITEM-005', name: 'Desk Lamp', price: 34.99, stock: 15, category: 'Home' },
      { sku: 'ITEM-006', name: 'USB-C Cable', price: 9.99, stock: 150, category: 'Electronics' }
    ]);

    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();