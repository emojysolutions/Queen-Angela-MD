const config = require('./config');
const logger = require('./utils/logger');
const api = require('./utils/api');
const rateLimiter = require('./utils/rateLimiter');
const antiSpam = require('./middleware/antiSpam');
const auth = require('./middleware/auth');
const cooldown = require('./utils/cooldown');
const sessionManager = require('./utils/sessionManager');
const aiManager = require('./utils/aiManager');
const errorHandler = require('./middleware/errorHandler');
const commandLoader = require('./commands');

/**
 * Parse incoming WhatsApp messages
 */
function parseMessage(webhookData) {
  try {
    const entry = webhookData.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;
    
    if (!messages || messages.length === 0) {
      return null;
    }
    
    const message = messages[0];
    const from = message.from;
    const messageId = message.id;
    const timestamp = message.timestamp;
    
    // Extract message content based on type
    let text = '';
    let messageType = message.type;
    let imageUrl = null;
    
    if (messageType === 'text') {
      text = message.text?.body || '';
    } else if (messageType === 'image') {
      imageUrl = message.image?.id; // You'd need to download this
      text = message.image?.caption || '';
    }
    
    return {
      from,
      messageId,
      timestamp,
      text,
      type: messageType,
      imageUrl
    };
  } catch (error) {
    logger.error('Parse message error:', error);
    return null;
  }
}

/**
 * Process and route messages to appropriate handlers
 */
async function processMessage(webhookData) {
  const message = parseMessage(webhookData);
  
  if (!message) {
    return;
  }
  
  const { from, messageId, text, type, imageUrl } = message;
  
  logger.info(`Message from ${from}: ${text}`);
  
  // Mark message as read
  try {
    await api.markAsRead(messageId);
  } catch (error) {
    logger.warn('Failed to mark as read:', error.message);
  }
  
  // Anti-spam check
  const spamCheck = antiSpam.check(from);
  if (!spamCheck.allowed) {
    await api.sendMessage(from, spamCheck.message);
    return;
  }
  if (spamCheck.warning) {
    await api.sendMessage(from, spamCheck.warning);
  }
  
  // Rate limiting check
  const rateCheck = rateLimiter.checkRateLimit(from, false);
  if (!rateCheck.allowed) {
    await api.sendMessage(from, rateCheck.message);
    return;
  }
  
  // Helper functions for commands
  const sendMessage = async (to, text) => {
    return await api.sendMessage(to, text);
  };
  
  const sendImage = async (to, imageUrl, caption = '') => {
    return await api.sendImage(to, imageUrl, caption);
  };
  
  const sendAudio = async (to, audioUrl) => {
    return await api.sendAudio(to, audioUrl);
  };
  
  const sendDocument = async (to, documentUrl, filename, caption = '') => {
    return await api.sendDocument(to, documentUrl, filename, caption);
  };
  
  // Check if message starts with prefix
  if (!text.startsWith(config.PREFIX)) {
    return;
  }
  
  // Parse command and arguments
  const args = text.slice(config.PREFIX.length).trim().split(/\s+/);
  const commandName = args.shift().toLowerCase();
  
  // Special handling for admin authentication
  if (commandName === 'admin') {
    if (args.length === 0) {
      await api.sendMessage(from, '🔐 Admin authentication\n\nUsage: !admin <password>');
      return;
    }
    
    const password = args[0];
    const result = auth.authenticate(from, password);
    await api.sendMessage(from, result.message);
    return;
  }
  
  // Get command from loader
  const command = commandLoader.getCommand(commandName);
  
  if (!command) {
    // Command not found
    return;
  }
  
  // Check if command requires admin
  if (command.adminOnly) {
    const adminCheck = auth.requireAdmin(from);
    if (!adminCheck.allowed) {
      await api.sendMessage(from, adminCheck.message);
      return;
    }
  }
  
  // AI rate limiting for AI commands
  if (command.category === 'AI') {
    const aiRateCheck = rateLimiter.checkRateLimit(from, true);
    if (!aiRateCheck.allowed) {
      await api.sendMessage(from, aiRateCheck.message);
      return;
    }
  }
  
  // Cooldown check
  if (command.cooldown) {
    const cooldownCheck = cooldown.check(from, command.name, command.cooldown);
    if (!cooldownCheck.allowed) {
      await api.sendMessage(from, cooldownCheck.message);
      return;
    }
  }
  
  // Execute command
  try {
    logger.command(`${from}: !${command.name} ${args.join(' ')}`);
    
    const context = {
      sendMessage,
      sendImage,
      sendAudio,
      sendDocument,
      sessionManager,
      aiManager,
      commandLoader,
      messageContext: { image: { url: imageUrl } },
      stats: {
        commandCount: commandLoader.getAllCommands().length
      }
    };
    
    const response = await command.execute(from, args, context);
    
    if (response) {
      await api.sendMessage(from, response);
    }
  } catch (error) {
    logger.error(`Command execution error (${command.name}):`, error);
    errorHandler(error, from, sendMessage);
  }
}

module.exports = {
  parseMessage,
  processMessage
};
