require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const ExpenseCategory = require('./models/ExpenseCategory');
const MonthlyBudget = require('./models/MonthlyBudget');
const MonthlyMember = require('./models/MonthlyMember');
const Payment = require('./models/Payment');
const Expense = require('./models/Expense');
const Adjustment = require('./models/Adjustment');

const defaultCategories = [
  'Electricity',
  'Water',
  'Gas',
  'Internet',
  'Cleaning',
  'Maintenance',
  'Groceries',
  'Room Supplies',
  'Repair',
  'Personal',
  'Other'
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/roommate_budget';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected.');

    // 1. Clear existing database collections
    console.log('Clearing database collections...');
    await User.deleteMany();
    await ExpenseCategory.deleteMany();
    await MonthlyBudget.deleteMany();
    await MonthlyMember.deleteMany();
    await Payment.deleteMany();
    await Expense.deleteMany();
    await Adjustment.deleteMany();

    // 2. Seed Default Expense Categories
    console.log('Seeding expense categories...');
    for (const name of defaultCategories) {
      await ExpenseCategory.create({ name, isActive: true });
    }

    // 3. Seed Users (1 Admin + 7 Members)
    console.log('Seeding users...');
    // Create Admin
    const adminUser = await User.create({
      name: 'Admin User',
      phone: '9999999999',
      password: 'adminpassword123', // Automatically hashed by User model pre-save hook
      role: 'admin',
      isActive: true
    });
    console.log(`- Seeded Admin: phone: ${adminUser.phone}, password: adminpassword123`);

    // Create 7 Members
    const membersData = [
      { name: 'Rahul', phone: '9876543210' },
      { name: 'Arun', phone: '9876543211' },
      { name: 'Kiran', phone: '9876543212' },
      { name: 'Ravi', phone: '9876543213' },
      { name: 'Ajay', phone: '9876543214' },
      { name: 'Manoj', phone: '9876543215' },
      { name: 'Suresh', phone: '9876543216' }
    ];

    const seededMembers = [];
    for (const member of membersData) {
      const u = await User.create({
        name: member.name,
        phone: member.phone,
        password: 'password123', // Automatically hashed by User model pre-save hook
        role: 'member',
        isActive: true
      });
      seededMembers.push(u);
      console.log(`- Seeded Member: ${u.name}, phone: ${u.phone}, password: password123`);
    }

    // 4. Seed Initial Month (August 2026, ₹2000 amount)
    console.log('Seeding initial month (August 2026)...');
    const budgetMonth = await MonthlyBudget.create({
      month: 8,
      year: 2026,
      monthlyAmount: 2000,
      status: 'OPEN'
    });

    // Enrolling active members in August 2026
    console.log('Enrolling members in August 2026...');
    for (const member of seededMembers) {
      await MonthlyMember.create({
        monthId: budgetMonth._id,
        memberId: member._id,
        memberNameSnapshot: member.name,
        baseAmount: 2000,
        additionAmount: 0,
        deductionAmount: 0,
        finalPayable: 2000
      });
    }

    console.log('Database successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
