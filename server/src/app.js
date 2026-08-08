const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Establish database connection (singleton pooled)
connectDB();

const authRoutes = require('./routes/authRoutes');
const memberRoutes = require('./routes/memberRoutes');
const monthRoutes = require('./routes/monthRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const adjustmentRoutes = require('./routes/adjustmentRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

// Middleware to parse incoming JSON bodies
app.use(express.json());

// Enable CORS for client dashboard integration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Mount REST API routes
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/months', monthRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/adjustments', adjustmentRoutes);
app.use('/api/expense-categories', categoryRoutes);

// Basic health check route
app.get('/api/test', (req, res) => {
  return res.status(200).json({ success: true, message: 'API is running successfully' });
});

// Centralized JSON error responder
app.use(errorHandler);

module.exports = app;
