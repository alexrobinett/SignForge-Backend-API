
// Define different origins for development and production
const developmentOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1',
  'http://127.0.0.1:5500'
];

const productionOrigins = [
  'https://alexrobinett.github.io/SignForge-Player',
  'https://digital-signage-message.netlify.app',
  'https://signforge.netlify.app',
  'https://alexrobinett.github.io',
  'https://ds-cms.vercel.app',
  'https://sign-forge-player.vercel.app'
];

// Use environment-based origin configuration
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? productionOrigins 
  : [...developmentOrigins, ...productionOrigins];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie'],
  exposedHeaders: ['Authorization']
  };
  
  module.exports = corsOptions;
  