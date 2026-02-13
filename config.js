require('dotenv').config();

module.exports = {
  // Bot Identity
  BOT_NAME: process.env.BOT_NAME || 'Queen Angela MD',
  PREFIX: process.env.PREFIX || '!',
  VERSION: '1.0.0',
  
  // Server Configuration
  PORT: parseInt(process.env.PORT) || 3000,
  
  // WhatsApp Cloud API
  WHATSAPP_TOKEN: process.env.WHATSAPP_TOKEN,
  PHONE_NUMBER_ID: process.env.PHONE_NUMBER_ID,
  VERIFY_TOKEN: process.env.VERIFY_TOKEN || 'queen_angela_verify',
  
  // Admin Settings
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '11223344',
  OWNER_NUMBER: process.env.OWNER_NUMBER || '',
  
  // AI API Keys
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  GOOGLE_AI_KEY: process.env.GOOGLE_AI_KEY,
  DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
  
  // Message Limits
  MAX_MESSAGE_LENGTH: parseInt(process.env.MAX_MESSAGE_LENGTH) || 4000,
  MAX_AI_INPUT: parseInt(process.env.MAX_AI_INPUT) || 2000,
  
  // Rate Limiting
  RATE_LIMIT: {
    messages: 10,
    window: 30 // seconds
  },
  
  AI_RATE_LIMIT: {
    messages: 5,
    window: 60 // seconds
  },
  
  // Music Settings
  MAX_MUSIC_DURATION: 600, // 10 minutes in seconds
  MUSIC_QUALITY: '128', // kbps
  
  // Session Settings
  SESSION_TTL: 60, // seconds
};
