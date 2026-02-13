const { bold, formatDivider } = require('../../utils/formatter');
const config = require('../../config');

module.exports = {
  name: 'about',
  aliases: ['info', 'botinfo'],
  category: 'General',
  description: 'Learn about Queen Angela MD',
  usage: '!about',
  examples: ['!about'],
  cooldown: 5,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage, stats }) => {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    const memoryUsage = process.memoryUsage();
    const memoryMB = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);
    
    const response = `
👑 ${bold('About Queen Angela MD')} 👑
${formatDivider()}

✨ ${bold('The Royal WhatsApp Assistant')}

A powerful, AI-driven WhatsApp bot fit for royalty. Queen Angela MD brings you music, games, AI chat, and more!

🌟 ${bold('Features:')}
• 🎵 Music downloads & search
• 🤖 Multiple AI models (GPT, Claude, Gemini, DeepSeek)
• 🎮 Interactive games
• 🔧 Useful tools
• 🎉 Fun commands

📊 ${bold('Stats:')}
• Uptime: ${hours}h ${minutes}m ${seconds}s
• Memory: ${memoryMB} MB
• Version: ${config.VERSION}
• Commands: ${stats?.commandCount || 0}

👨‍💻 ${bold('Creator:')} emojysolutions
🔗 ${bold('GitHub:')} emojysolutions/Queen-Angela-MD

${formatDivider()}
_Serving you with royal excellence_ 💎
    `.trim();
    
    return response;
  }
};
