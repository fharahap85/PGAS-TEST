const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { testConnection } = require('./config/database');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const spendingRoutes = require('./routes/spendingRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ───────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Swagger Documentation ───────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'PGAS Solution - API Docs'
}));

// Serve swagger spec as JSON
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ─── API Routes ──────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/spendings', spendingRoutes);
app.use('/api/reports', reportRoutes);

// ─── Health Check ────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'PGAS Solution API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ─── 404 Handler ─────────────────────────────────────────
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// ─── Error Handler ───────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// ─── Start Server ────────────────────────────────────────
async function startServer() {
  // Test database connection
  const dbConnected = await testConnection();

  if (!dbConnected) {
    console.error('⚠️  Starting server without database connection. Some features may not work.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔══════════════════════════════════════════════╗
║      PGAS Solution - API Server              ║
║──────────────────────────────────────────────║
║  🚀 Server:    http://localhost:${PORT}         ║
║  📚 Swagger:   http://localhost:${PORT}/api-docs ║
║  🏥 Health:    http://localhost:${PORT}/api/health║
║  📋 Env:       ${(process.env.NODE_ENV || 'development').padEnd(30)}║
╚══════════════════════════════════════════════╝
    `);
  });
}

startServer();

module.exports = app;
