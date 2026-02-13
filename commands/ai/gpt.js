const config = require('../../config');
const logger = require('../../utils/logger');

module.exports = {
  name: 'gpt',
  aliases: ['chatgpt', 'gpt5', 'gpt4'],
  category: 'AI',
  description: 'Chat with GPT-4o',
  usage: '!gpt <message> or !gpt clear',
  examples: ['!gpt Hello!', '!gpt Explain quantum physics', '!gpt clear'],
  cooldown: 10,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage, aiManager }) => {
    if (!args || args.length === 0) {
      return '🤖 *GPT-4o*\n\nUsage: !gpt <message>\n\nExample: !gpt Tell me a story\n\nUse !gpt clear to reset conversation';
    }

    const input = args.join(' ');
    
    // Check for clear command
    if (input.toLowerCase() === 'clear') {
      aiManager.clearHistory(from, 'openai');
      return '✅ Conversation history cleared!';
    }

    // Check if OpenAI is available
    if (!aiManager.providers.has('openai')) {
      return '❌ GPT is not configured!\n\nAdd OPENAI_API_KEY to .env file.';
    }

    // Validate input length
    if (input.length > config.MAX_AI_INPUT) {
      return `❌ Message too long! Maximum ${config.MAX_AI_INPUT} characters.`;
    }

    try {
      await sendMessage(from, '🤖 GPT is thinking...');
      
      const response = await aiManager.chat('openai', from, input);
      
      return `🤖 *GPT-4o*\n\n${response}`;
      
    } catch (error) {
      logger.error('GPT command error:', error);
      
      if (error.message.includes('API key')) {
        return '❌ Invalid API key! Check your OpenAI configuration.';
      }
      
      if (error.message.includes('rate')) {
        return '❌ Rate limit exceeded! Please try again later.';
      }
      
      return '❌ Failed to get response from GPT!\n\nPlease try again.';
    }
  }
};
