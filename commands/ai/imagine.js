const logger = require('../../utils/logger');

module.exports = {
  name: 'imagine',
  aliases: ['dalle', 'generate', 'createimage'],
  category: 'AI',
  description: 'Generate images with DALL-E 3',
  usage: '!imagine <prompt>',
  examples: ['!imagine A royal queen in a purple gown', '!imagine Futuristic city at night'],
  cooldown: 30,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage, sendImage, aiManager }) => {
    if (!args || args.length === 0) {
      return '🎨 *DALL-E 3 Image Generator*\n\nUsage: !imagine <prompt>\n\nExample: !imagine A majestic lion in the savanna\n\n_Be descriptive for best results!_';
    }

    // Check if OpenAI is available
    if (!aiManager.providers.has('openai')) {
      return '❌ Image generation not configured!\n\nAdd OPENAI_API_KEY to .env file.';
    }

    const prompt = args.join(' ');

    if (prompt.length > 1000) {
      return '❌ Prompt too long! Maximum 1000 characters.';
    }

    try {
      await sendMessage(from, '🎨 Generating image...\n\n_This may take 10-30 seconds_');
      
      const imageUrl = await aiManager.generateImage(prompt);
      
      // Send image
      // Note: In production, you'd use sendImage(from, imageUrl, prompt)
      
      return `🎨 *Image Generated!*\n\n*Prompt:* ${prompt}\n\n*Image URL:* ${imageUrl}\n\n_In production, the image would be sent directly to WhatsApp_`;
      
    } catch (error) {
      logger.error('Imagine command error:', error);
      
      if (error.message.includes('API key')) {
        return '❌ Invalid API key! Check your OpenAI configuration.';
      }
      
      if (error.message.includes('content policy') || error.message.includes('safety')) {
        return '❌ Your prompt was rejected by safety filters!\n\nPlease use a different, appropriate prompt.';
      }
      
      if (error.message.includes('rate')) {
        return '❌ Rate limit exceeded! Please try again later.';
      }
      
      return '❌ Failed to generate image!\n\nPlease try again with a different prompt.';
    }
  }
};
