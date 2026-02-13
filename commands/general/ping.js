const { bold, formatDivider } = require('../../utils/formatter');
const config = require('../../config');

module.exports = {
  name: 'ping',
  aliases: ['latency', 'speed'],
  category: 'General',
  description: 'Check bot response time and status',
  usage: '!ping',
  examples: ['!ping'],
  cooldown: 3,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage }) => {
    const startTime = Date.now();
    
    await sendMessage(from, '🏓 Pinging...');
    
    const endTime = Date.now();
    const latency = endTime - startTime;
    
    const response = `
👑 ${bold('Queen Angela MD - Status')}
${formatDivider()}

🏓 Pong!
⚡ Response Time: ${latency}ms
✨ Status: Online
🔮 Version: ${config.VERSION}
💜 Serving royally!

${formatDivider()}
    `.trim();
    
    return response;
  }
};
