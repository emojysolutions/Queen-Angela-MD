const quotes = require('../../data/quotes.json');

module.exports = {
  name: 'quote',
  aliases: ['inspire', 'inspiration', 'motivate'],
  category: 'Fun',
  description: 'Get an inspirational quote',
  usage: '!quote',
  examples: ['!quote'],
  cooldown: 3,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage }) => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    return `✨ *Quote of the Moment*\n\n"${randomQuote.quote}"\n\n— ${randomQuote.author} 💫`;
  }
};
