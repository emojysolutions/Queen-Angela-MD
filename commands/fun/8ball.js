const responses = require('../../data/8ball.json');

module.exports = {
  name: '8ball',
  aliases: ['eightball', 'ask', 'oracle'],
  category: 'Fun',
  description: 'Ask the magic 8-ball a yes/no question',
  usage: '!8ball <question>',
  examples: ['!8ball Will I be successful?', '!8ball Should I learn programming?'],
  cooldown: 3,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage }) => {
    if (!args || args.length === 0) {
      return '❌ Please ask a question!\n\nExample: !8ball Will I succeed?';
    }
    
    const question = args.join(' ');
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return `🔮 *Magic 8-Ball*\n\n*Question:* ${question}\n\n*Answer:* ${randomResponse}\n\n_The oracle has spoken!_ ✨`;
  }
};
