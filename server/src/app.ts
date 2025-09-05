// Load environment variables FIRST, before any imports
import dotenv from 'dotenv';
import path from 'path';

// Try multiple paths for .env file
const envPath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

// Fallback: also try loading from current working directory
if (!process.env.MONGODB_URI) {
  dotenv.config();
}

import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import directionsRoutes from './routes/directionsRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Cycling App API',
    version: '1.0.0',
    status: 'running'
  });
});

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('❌ MONGODB_URI environment variable is not set!');
  console.error('Please create a .env file in the server directory with:');
  console.error('MONGODB_URI=mongodb://localhost:27017/cycling-app');
  process.exit(1);
}

console.log('🔌 Attempting to connect to MongoDB...');
console.log('📍 URI:', mongoUri);

mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    console.error('💡 Make sure MongoDB is running and accessible');
    process.exit(1);
  });

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/directions', directionsRoutes);

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚴 Cycling App Server Started Successfully!`);
  console.log(`📍 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🗺️  Directions API: http://localhost:${PORT}/api/directions`);
  console.log('='.repeat(50));
});

export default app; 