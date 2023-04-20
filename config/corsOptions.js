
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://127.0.0.1',
    'http://127.0.0.1:5500',
    'https://alexrobinett.github.io/SignForge-Player',
    'https://digital-signage-message.netlify.app',
    'https://signforge.netlify.app',
    'https://alexrobinett.github.io',
    'https://ds-cms.vercel.app',
    'https://sign-forge-player.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie','*'],
  exposedHeaders: ['*', 'Authorization', ]
  };
  
  module.exports = corsOptions;
  