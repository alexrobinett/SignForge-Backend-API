
const corsOptions = {
    origin: ['http://127.0.0.1:5173', 'http://127.0.0.1', 'http://127.0.0.1:5500', 'https://alexrobinett.github.io/SignForge-Player/', 'https://alexrobinett.github.io', 'https://digital-signage-message.netlify.app', 'https://signforge.netlify.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'authorization', 'Set-Cookie', '*'],
  exposedHeaders: ['*', 'Authorization', ]
  };
  
  module.exports = corsOptions;
  