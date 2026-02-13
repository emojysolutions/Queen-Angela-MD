const config = require('../../config');
const logger = require('../../utils/logger');

module.exports = {
  name: 'claude',
  aliases: ['opus'],
  category: 'AI',
  description: 'Chat with Claude Opus',
  usage: '!claude <message> or !claude clear',
  examples: ['!claude Hello!', '!claude Explain AI', '!claude clear'],
  cooldown: 10,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage, aiManager }) => {
    if (!args || args.length === 0) {
      return '🤖 *Claude Opus*\n\nUsage: !claude <message>\n\nExample: !claude Write a poem\n\nUse !claude clear to reset conversation';
    }

    const input = args.join(' ');
    
    // Check for clear command
    if (input.toLowerCase() === 'clear') {
      aiManager.clearHistory(from, 'anthropic');
      return '✅ Conversation history cleared!';
    }

    // Check if Anthropic is available
    if (!aiManager.providers.has('anthropic')) {
      return '❌ Claude is not configured!\n\nAdd ANTHROPIC_API_KEY to .env file.';
    }

    // Validate input length
    if (input.length > config.MAX_AI_INPUT) {
      return `❌ Message too long! Maximum ${config.MAX_AI_INPUT} characters.`;
    }

    try {
      await sendMessage(from, '🤖 Claude is thinking...');
      
      const response = await aiManager.chat('anthropic', from, input);
      
      return `🤖 *Claude Opus*\n\n${response}`;
      
    } catch (error) {
      logger.error('Claude command error:', error);
      
      if (error.message.includes('API key') || error.message.includes('authentication')) {
        return '❌ Invalid API key! Check your Anthropic configuration.';
      }
      
      if (error.message.includes('rate')) {
        return '❌ Rate limit exceeded! Please try again later.';
      }
      
      return '❌ Failed to get response from Claude!\n\nPlease try again.';
    }
  }
};
