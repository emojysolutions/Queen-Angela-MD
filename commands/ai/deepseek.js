const config = require('../../config');
const logger = require('../../utils/logger');

module.exports = {
  name: 'deepseek',
  aliases: ['ds'],
  category: 'AI',
  description: 'Chat with DeepSeek',
  usage: '!deepseek <message> or !deepseek clear',
  examples: ['!deepseek Hello!', '!deepseek Code a function', '!deepseek clear'],
  cooldown: 10,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage, aiManager }) => {
    if (!args || args.length === 0) {
      return '🤖 *DeepSeek*\n\nUsage: !deepseek <message>\n\nExample: !deepseek Help me code\n\nUse !deepseek clear to reset conversation';
    }

    const input = args.join(' ');
    
    // Check for clear command
    if (input.toLowerCase() === 'clear') {
      aiManager.clearHistory(from, 'deepseek');
      return '✅ Conversation history cleared!';
    }

    // Check if DeepSeek is available
    if (!aiManager.providers.has('deepseek')) {
      return '❌ DeepSeek is not configured!\n\nAdd DEEPSEEK_API_KEY to .env file.';
    }

    // Validate input length
    if (input.length > config.MAX_AI_INPUT) {
      return `❌ Message too long! Maximum ${config.MAX_AI_INPUT} characters.`;
    }

    try {
      await sendMessage(from, '🤖 DeepSeek is thinking...');
      
      const response = await aiManager.chat('deepseek', from, input);
      
      return `🤖 *DeepSeek*\n\n${response}`;
      
    } catch (error) {
      logger.error('DeepSeek command error:', error);
      
      if (error.message.includes('API key')) {
        return '❌ Invalid API key! Check your DeepSeek configuration.';
      }
      
      if (error.message.includes('rate')) {
        return '❌ Rate limit exceeded! Please try again later.';
      }
      
      return '❌ Failed to get response from DeepSeek!\n\nPlease try again.';
    }
  }
};
