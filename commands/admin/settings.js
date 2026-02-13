const config = require('../../config');
const { bold, formatDivider } = require('../../utils/formatter');

module.exports = {
  name: 'settings',
  aliases: ['config', 'botsettings'],
  category: 'Admin',
  description: 'View bot settings',
  usage: '!settings',
  examples: ['!settings'],
  cooldown: 5,
  adminOnly: true,
  
  execute: async (from, args, { sendMessage }) => {
    const response = `
⚙️ ${bold('Bot Settings')}
${formatDivider()}

🤖 ${bold('General:')}
• Name: ${config.BOT_NAME}
• Version: ${config.VERSION}
• Prefix: ${config.PREFIX}
• Port: ${config.PORT}

🔐 ${bold('Security:')}
• Admin Password: ${config.ADMIN_PASSWORD ? '***' : 'Not Set'}
• Owner Number: ${config.OWNER_NUMBER || 'Not Set'}
• Verify Token: ${config.VERIFY_TOKEN ? '***' : 'Not Set'}

🌐 ${bold('WhatsApp:')}
• Token: ${config.WHATSAPP_TOKEN ? 'Configured ✅' : 'Not Set ❌'}
• Phone ID: ${config.PHONE_NUMBER_ID || 'Not Set'}

🤖 ${bold('AI Services:')}
• OpenAI: ${config.OPENAI_API_KEY ? 'Configured ✅' : 'Not Set ❌'}
• Anthropic: ${config.ANTHROPIC_API_KEY ? 'Configured ✅' : 'Not Set ❌'}
• Google AI: ${config.GOOGLE_AI_KEY ? 'Configured ✅' : 'Not Set ❌'}
• DeepSeek: ${config.DEEPSEEK_API_KEY ? 'Configured ✅' : 'Not Set ❌'}

⚡ ${bold('Limits:')}
• Max Message: ${config.MAX_MESSAGE_LENGTH} chars
• Max AI Input: ${config.MAX_AI_INPUT} chars
• Rate Limit: ${config.RATE_LIMIT.messages} msgs/${config.RATE_LIMIT.window}s
• AI Rate Limit: ${config.AI_RATE_LIMIT.messages} msgs/${config.AI_RATE_LIMIT.window}s

🎵 ${bold('Music:')}
• Max Duration: ${config.MAX_MUSIC_DURATION}s
• Quality: ${config.MUSIC_QUALITY}kbps

${formatDivider()}
_Modify settings in .env file_ 🔧
    `.trim();
    
    return response;
  }
};
