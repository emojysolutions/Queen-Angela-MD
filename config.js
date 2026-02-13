module.exports = {
  botName: 'Queen Angela',
  prefix: '/',
  owner: 'Queen Angela Bot',
  sessionName: 'auth_info_baileys',
  
  // Bot responses
  responses: {
    welcome: '👋 Hello! I am Queen Angela, your WhatsApp assistant!',
    commandNotFound: '❌ Command not found. Use /help to see available commands.',
    error: '⚠️ An error occurred while processing your request.'
  },
  
  // Available commands
  commands: {
    help: 'Display available commands',
    ping: 'Check bot response time',
    info: 'Get bot information',
    alive: 'Check if bot is running'
  }
};
