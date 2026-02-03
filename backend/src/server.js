import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Security middleware
app.use(helmet());

// CORS configuration - Allow both www and non-www versions of production domain
const allowedOrigins = [
  FRONTEND_URL,
  'https://osrstldr.com',
  'https://www.osrstldr.com',
  'http://localhost:5173',
  'http://localhost:5175'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// API routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'Buyables API',
    version: '1.0.0',
    description: 'OSRS Grand Exchange buyables tracker with price per XP calculations',
    endpoints: {
      health: '/api/health',
      skills: '/api/skills',
      buyables: '/api/buyables/:skill'
    }
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log('=================================');
  console.log('  Buyables API Server');
  console.log('=================================');
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Server running on port: ${PORT}`);
  console.log(`Frontend URL: ${FRONTEND_URL}`);
  console.log(`Cache TTL: ${process.env.CACHE_TTL_SECONDS || 300}s`);
  console.log('=================================');
  console.log(`API available at: http://localhost:${PORT}/api`);
  console.log('=================================');
});
