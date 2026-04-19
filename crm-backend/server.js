const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const leadRoutes = require('./routes/leads');
const propertyRoutes = require('./routes/properties');
const clientRoutes = require('./routes/clients');
const dealRoutes = require('./routes/deals');
const followUpRoutes = require('./routes/followUps');
const analyticsRoutes = require('./routes/analytics');
const documentRoutes = require('./routes/documents');   // NEW
const webhookRoutes = require('./routes/webhook');       // NEW

connectDB();

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-webhook-secret'],
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Webhooks get a relaxed rate limit (n8n may send bursts)
const webhookLimiter = rateLimit({ windowMs: 1 * 60 * 1000, max: 60 });
app.use('/api/webhooks/', webhookLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'PropCRM API is running',
    version: '2.0.0',
    timestamp: new Date(),
    endpoints: {
      auth: '/api/auth',
      leads: '/api/leads',
      properties: '/api/properties',
      clients: '/api/clients',
      deals: '/api/deals',
      followups: '/api/followups',
      analytics: '/api/analytics',
      documents: '/api/documents',
      webhooks: '/api/webhooks',
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/followups', followUpRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/documents', documentRoutes);   // NEW
app.use('/api/webhooks', webhookRoutes);      // NEW

app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 PropCRM Server v2.0 running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 http://localhost:${PORT}/health`);
  console.log(`🪝 Webhook: http://localhost:${PORT}/api/webhooks/test\n`);
});

module.exports = app;