const logger = require('../../utils/logger');

module.exports = {
  name: 'vision',
  aliases: ['analyze', 'describe', 'whatisthis'],
  category: 'AI',
  description: 'Analyze images with GPT-4o Vision',
  usage: '!vision <question> (send with image)',
  examples: ['!vision What is in this image?', '!vision Describe this scene'],
  cooldown: 20,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage, aiManager, messageContext }) => {
    // Check if OpenAI is available
    if (!aiManager.providers.has('openai')) {
      return '❌ Vision analysis not configured!\n\nAdd OPENAI_API_KEY to .env file.';
    }

    // In a real implementation, you'd extract the image URL from messageContext
    // For now, this is a placeholder
    
    const imageUrl = messageContext?.image?.url;
    
    if (!imageUrl) {
      return '🖼️ *GPT-4o Vision*\n\nUsage: Send an image with the caption:\n!vision <question>\n\nExamples:\n• !vision What is in this image?\n• !vision Describe this scene\n• !vision What colors do you see?\n\n_Send this command with an image!_';
    }

    const prompt = args && args.length > 0 
      ? args.join(' ') 
      : 'What is in this image? Describe it in detail.';

    try {
      await sendMessage(from, '👁️ Analyzing image...');
      
      const analysis = await aiManager.analyzeImage(imageUrl, prompt);
      
      return `🖼️ *GPT-4o Vision Analysis*\n\n${analysis}`;
      
    } catch (error) {
      logger.error('Vision command error:', error);
      
      if (error.message.includes('API key')) {
        return '❌ Invalid API key! Check your OpenAI configuration.';
      }
      
      if (error.message.includes('rate')) {
        return '❌ Rate limit exceeded! Please try again later.';
      }
      
      return '❌ Failed to analyze image!\n\nPlease try again.';
    }
  }
};
