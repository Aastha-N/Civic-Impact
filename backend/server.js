const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const { setupDatabase, getDbType } = require('./config/db');

// Import Route Handlers
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const pickupRoutes = require('./routes/pickupRoutes');
const listingRoutes = require('./routes/listingRoutes');
const recyclingRoutes = require('./routes/recyclingRoutes');
const educationRoutes = require('./routes/educationRoutes');
const assistantRoutes = require('./routes/assistantRoutes');
const greenPointsRoutes = require('./routes/greenPointsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Static files for user-uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health & System Diagnostic Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    application: 'Civic Impact API',
    databaseType: getDbType(),
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Mount Feature API Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/recycling', recyclingRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/points', greenPointsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// 404 Route Handler
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start Server after database setup
async function startServer() {
  try {
    await setupDatabase();
    app.listen(PORT, () => {
      console.log(`=================================================`);
      console.log(`🚀 Civic Impact Backend Server running on port ${PORT}`);
      console.log(`🌐 Base API URL: http://localhost:${PORT}/api`);
      console.log(`🗄️ Database Connected: ${getDbType()}`);
      console.log(`=================================================`);
    });
  } catch (error) {
    console.error('Fatal: Server startup failed:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
