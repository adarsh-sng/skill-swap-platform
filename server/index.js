import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import config from './config/config.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import swapRoutes from './routes/swaps.js';

const app = express();

// Connect to MongoDB
mongoose.connect(config.mongoUri)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });

// Middleware
app.use(cors({
  origin: config.clientUrl,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/swaps', swapRoutes);

// Health check
app.get('/', function (req, res) {
    res.json({ 
      message: 'Welcome to SkillSwap API', 
      status: 'running',
      version: '1.0.0',
      environment: config.nodeEnv
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: config.nodeEnv === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(config.port, () => {
    console.log(`🚀 Server started on port ${config.port}`);
    console.log(`📡 API available at http://localhost:${config.port}`);
    console.log(`🌍 Environment: ${config.nodeEnv}`);
});