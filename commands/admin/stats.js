const { bold, formatDivider } = require('../../utils/formatter');

module.exports = {
  name: 'stats',
  aliases: ['statistics', 'botstats'],
  category: 'Admin',
  description: 'View bot statistics',
  usage: '!stats',
  examples: ['!stats'],
  cooldown: 5,
  adminOnly: true,
  
  execute: async (from, args, { sendMessage, stats, commandLoader }) => {
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    const memoryUsage = process.memoryUsage();
    const memoryMB = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);
    const memoryTotalMB = (memoryUsage.heapTotal / 1024 / 1024).toFixed(2);
    
    const commandCount = commandLoader.getAllCommands().length;
    const categoryCount = commandLoader.getCategories().length;
    
    const response = `
👑 ${bold('Queen Angela MD - Statistics')}
${formatDivider()}

⏱️ ${bold('Uptime:')}
${days}d ${hours}h ${minutes}m ${seconds}s

💾 ${bold('Memory:')}
Used: ${memoryMB} MB
Total: ${memoryTotalMB} MB

🤖 ${bold('Bot Info:')}
Commands: ${commandCount}
Categories: ${categoryCount}
Node Version: ${process.version}
Platform: ${process.platform}

📊 ${bold('Performance:')}
CPU: ${process.cpuUsage().user / 1000}ms
PID: ${process.pid}

${formatDivider()}
_Royal performance metrics_ 💎
    `.trim();
    
    return response;
  }
};
