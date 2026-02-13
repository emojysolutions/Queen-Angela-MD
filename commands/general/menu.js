const { bold, formatDivider } = require('../../utils/formatter');

module.exports = {
  name: 'menu',
  aliases: ['commands', 'list'],
  category: 'General',
  description: 'Display the royal command menu',
  usage: '!menu',
  examples: ['!menu'],
  cooldown: 3,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage }) => {
    const response = `
👑 ${bold('Queen Angela MD — Royal Menu')} 👑
${formatDivider()}

💜 ${bold('General')}
  !menu • !help • !ping • !about

🎵 ${bold('Music')}
  !play • !search

🤖 ${bold('AI')}
  !gpt • !claude • !gemini • !deepseek
  !ai • !imagine • !vision • !persona

🎮 ${bold('Games')}
  !trivia • !rps • !hangman • !wordgame • !numguess

🔧 ${bold('Tools')}
  !calc • !time • !todo • !remind • !translate

🎉 ${bold('Fun')}
  !joke • !quote • !8ball • !flip • !roll • !fact • !horoscope

🔐 ${bold('Admin')}
  !stats • !broadcast • !settings

${formatDivider()}
_A royal bot, fit for a queen_ 💎

Type !help <command> for details
    `.trim();
    
    return response;
  }
};
