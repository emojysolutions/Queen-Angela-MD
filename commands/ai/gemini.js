const config = require('../../config');
const logger = require('../../utils/logger');

module.exports = {
  name: 'gemini',
  aliases: ['bard', 'google'],
  category: 'AI',
  description: 'Chat with Google Gemini Pro',
  usage: '!gemini <message> or !gemini clear',
  examples: ['!gemini Hello!', '!gemini What is AI?', '!gemini clear'],
  cooldown: 10,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage, aiManager }) => {
    if (!args || args.length === 0) {
      return '🤖 *Gemini Pro*\n\nUsage: !gemini <message>\n\nExample: !gemini Explain the universe\n\nUse !gemini clear to reset conversation';
    }

    const input = args.join(' ');
    
    // Check for clear command
    if (input.toLowerCase() === 'clear') {
      aiManager.clearHistory(from, 'gemini');
      return '✅ Conversation history cleared!';
    }

    // Check if Gemini is available
    if (!aiManager.providers.has('gemini')) {
      return '❌ Gemini is not configured!\n\nAdd GOOGLE_AI_KEY to .env file.';
    }

    // Validate input length
    if (input.length > config.MAX_AI_INPUT) {
      return `❌ Message too long! Maximum ${config.MAX_AI_INPUT} characters.`;
    }

    try {
      await sendMessage(from, '🤖 Gemini is thinking...');
      
      const response = await aiManager.chat('gemini', from, input);
      
      return `🤖 *Gemini Pro*\n\n${response}`;
      
    } catch (error) {
      logger.error('Gemini command error:', error);
      
      if (error.message.includes('API key')) {
        return '❌ Invalid API key! Check your Google AI configuration.';
      }
      
      if (error.message.includes('rate')) {
        return '❌ Rate limit exceeded! Please try again later.';
      }
      
      return '❌ Failed to get response from Gemini!\n\nPlease try again.';
    }
  }
};
