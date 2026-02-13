const express = require('express');
const config = require('./config');
const logger = require('./utils/logger');
const { processMessage } = require('./bot');

const app = express();

// Middleware
app.use(express.json());

// Display banner
logger.banner();

// Health check endpoint
app.get('/health', (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  
  res.json({
    status: 'healthy',
    uptime: uptime,
    memory: {
      used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      total: Math.round(memoryUsage.heapTotal / 1024 / 1024)
    },
    timestamp: new Date().toISOString()
  });
});

// Root endpoint - status page
app.get('/', (req, res) => {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Queen Angela MD</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
        }
        .container {
          text-align: center;
          background: rgba(255, 255, 255, 0.1);
          padding: 40px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }
        h1 { font-size: 3em; margin: 0; }
        .status { color: #4ade80; font-size: 1.2em; }
        .info { margin-top: 20px; }
        .emoji { font-size: 4em; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="emoji">👑</div>
        <h1>Queen Angela MD</h1>
        <p class="status">🟢 Online</p>
        <div class="info">
          <p>Version: ${config.VERSION}</p>
          <p>Uptime: ${hours}h ${minutes}m</p>
          <p>Your Royal WhatsApp Assistant</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Webhook verification endpoint (GET)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  if (mode === 'subscribe' && token === config.VERIFY_TOKEN) {
    logger.success('Webhook verified!');
    res.status(200).send(challenge);
  } else {
    logger.error('Webhook verification failed');
    res.status(403).send('Forbidden');
  }
});

// Webhook endpoint for incoming messages (POST)
app.post('/webhook', async (req, res) => {
  try {
    const body = req.body;
    
    // Respond immediately to acknowledge receipt
    res.status(200).send('EVENT_RECEIVED');
    
    // Check if this is a WhatsApp webhook event
    if (body.object === 'whatsapp_business_account') {
      // Process the message asynchronously
      processMessage(body).catch(error => {
        logger.error('Message processing error:', error);
      });
    }
  } catch (error) {
    logger.error('Webhook error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Error handler
app.use((err, req, res, next) => {
  logger.error('Express error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const PORT = config.PORT;

app.listen(PORT, () => {
  logger.success(`Server running on port ${PORT}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
  logger.info(`Webhook: http://localhost:${PORT}/webhook`);
  logger.royal('Queen Angela MD is ready to serve! 👑');
  
  // Log configured services
  if (config.WHATSAPP_TOKEN) {
    logger.info('✅ WhatsApp configured');
  } else {
    logger.warn('❌ WhatsApp not configured');
  }
  
  const aiServices = [];
  if (config.OPENAI_API_KEY) aiServices.push('GPT');
  if (config.ANTHROPIC_API_KEY) aiServices.push('Claude');
  if (config.GOOGLE_AI_KEY) aiServices.push('Gemini');
  if (config.DEEPSEEK_API_KEY) aiServices.push('DeepSeek');
  
  if (aiServices.length > 0) {
    logger.info(`✅ AI Services: ${aiServices.join(', ')}`);
  } else {
    logger.warn('❌ No AI services configured');
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;
