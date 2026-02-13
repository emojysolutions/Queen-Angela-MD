const config = require('../../config');
const logger = require('../../utils/logger');

module.exports = {
  name: 'ai',
  aliases: ['chat', 'ask'],
  category: 'AI',
  description: 'Smart AI router - auto-selects best available AI',
  usage: '!ai <message> or !ai clear or !ai models',
  examples: ['!ai Hello!', '!ai Explain AI', '!ai clear', '!ai models'],
  cooldown: 10,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage, aiManager }) => {
    if (!args || args.length === 0) {
      return '🤖 *Smart AI Router*\n\nUsage: !ai <message>\n\nI\'ll automatically use the best available AI!\n\n• !ai models - Show available AIs\n• !ai clear - Reset conversation\n\nExample: !ai Tell me a joke';
    }

    const input = args.join(' ');
    
    // Check for clear command
    if (input.toLowerCase() === 'clear') {
      aiManager.clearHistory(from);
      return '✅ All conversation histories cleared!';
    }

    // Check for models command
    if (input.toLowerCase() === 'models') {
      const available = aiManager.getAvailableProviders();
      
      if (available.length === 0) {
        return '❌ No AI models configured!\n\nAdd API keys to .env file:\n• OPENAI_API_KEY\n• ANTHROPIC_API_KEY\n• GOOGLE_AI_KEY\n• DEEPSEEK_API_KEY';
      }

      const modelNames = {
        openai: 'GPT-4o (OpenAI)',
        anthropic: 'Claude Opus (Anthropic)',
        gemini: 'Gemini Pro (Google)',
        deepseek: 'DeepSeek'
      };

      let response = '🤖 *Available AI Models*\n\n';
      available.forEach((provider, index) => {
        response += `${index + 1}. ✅ ${modelNames[provider]}\n`;
      });

      response += '\n_Auto-routing to the best available model!_';
      
      return response;
    }

    // Validate input length
    if (input.length > config.MAX_AI_INPUT) {
      return `❌ Message too long! Maximum ${config.MAX_AI_INPUT} characters.`;
    }

    // Check if any AI is available
    const available = aiManager.getAvailableProviders();
    if (available.length === 0) {
      return '❌ No AI models configured!\n\nAdd at least one API key to .env:\n• OPENAI_API_KEY\n• ANTHROPIC_API_KEY\n• GOOGLE_AI_KEY\n• DEEPSEEK_API_KEY';
    }

    try {
      await sendMessage(from, '🤖 AI is thinking...');
      
      const response = await aiManager.smartChat(from, input);
      
      // Determine which AI was used
      const usedProvider = available[0]; // Smart chat uses priority order
      const modelNames = {
        openai: 'GPT-4o',
        anthropic: 'Claude',
        gemini: 'Gemini',
        deepseek: 'DeepSeek'
      };
      
      return `🤖 *${modelNames[usedProvider]}*\n\n${response}`;
      
    } catch (error) {
      logger.error('AI command error:', error);
      
      if (error.message.includes('No AI providers')) {
        return '❌ No AI providers available!\n\nPlease configure at least one AI service.';
      }
      
      return '❌ Failed to get AI response!\n\nPlease try again.';
    }
  }
};
