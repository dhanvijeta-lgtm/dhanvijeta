require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const errorHandler = require('./middleware/error');

const app = express();

// Custom lightweight cookie parser middleware
app.use((req, res, next) => {
  req.cookies = {};
  if (req.headers.cookie) {
    try {
      const rawCookies = req.headers.cookie.split(';');
      rawCookies.forEach(cookie => {
        const parts = cookie.split('=');
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        req.cookies[key] = decodeURIComponent(value);
      });
    } catch (e) {
      console.error('Error parsing cookies:', e);
    }
  }
  next();
});

// Security headers
app.use(helmet({
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  crossOriginResourcePolicy: false // Allows loading local image previews if needed
}));

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://dhanvijeta.vercel.app',
  ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL.replace(/\/$/, '')] : [])
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
        callback(null, true);
      } else {
        console.warn(`[CORS Debug] Blocked request from origin: ${origin}`);
        callback(null, false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads if using local storage fallback
app.use('/uploads', express.static('uploads'));

// Health check handler helper
const getHealthStatus = () => ({
  success: true,
  message: 'Dhan Vijeta Backend API is Running',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  timestamp: new Date().toISOString()
});

// Root & Health Check Endpoints
app.get('/', (req, res) => res.status(200).json(getHealthStatus()));
app.get('/health', (req, res) => res.status(200).json(getHealthStatus()));
app.get('/api/health', (req, res) => res.status(200).json(getHealthStatus()));

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false
});

// Apply API Limiter
app.use('/api/', apiLimiter);

// API Routes (mount on both /api and root / for resilience)
app.use('/api', routes);
app.use('/', routes);

// 404 Route Handler for unmatched endpoints
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route Not Found',
    error: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
