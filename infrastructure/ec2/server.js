require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const { limiter } = require('./middleware/rateLimit');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const sleepRoutes = require('./routes/sleep');
const memoryRoutes = require('./routes/memory');

const app = express();
const PORT = process.env.PORT ?? 3000;
const VERSION = '1.0.0';

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(helmet());
app.use(cors({
  origin: allowedOrigins.length > 0
    ? (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        cb(new Error('Not allowed by CORS'));
      }
    : true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(morgan('combined', {
  skip: (req) => req.path === '/api/v1/health',
}));
app.use(express.json({ limit: '50kb' }));
app.use(limiter);

app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ok',
    version: VERSION,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/v1/sleep', sleepRoutes);
app.use('/api/v1/memory', memoryRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[sleep-app-backend] v${VERSION} running on port ${PORT} (${process.env.NODE_ENV})`);
});

module.exports = app;
