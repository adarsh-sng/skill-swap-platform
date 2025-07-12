import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/skillswap',
  jwtSecret: process.env.JWT_SECRET || 'skillswap-dev-secret-key-2024',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development'
};

// Log configuration (without sensitive data)
console.log('🔧 Configuration loaded:');
console.log(`   Port: ${config.port}`);
console.log(`   Environment: ${config.nodeEnv}`);
console.log(`   Client URL: ${config.clientUrl}`);
console.log(`   MongoDB: ${config.mongoUri.includes('localhost') ? 'Local' : 'Atlas'}`);

// If using Atlas but no .env file, show helpful message
if (!process.env.MONGODB_URI && !config.mongoUri.includes('localhost')) {
  console.log('⚠️  No .env file found. Using local MongoDB.');
  console.log('📝 To use Atlas, create .env file with MONGODB_URI');
}

export default config; 