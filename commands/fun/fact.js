const facts = require('../../data/facts.json');

module.exports = {
  name: 'fact',
  aliases: ['randomfact', 'funfact', 'didyouknow'],
  category: 'Fun',
  description: 'Get a random fun fact',
  usage: '!fact',
  examples: ['!fact'],
  cooldown: 3,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage }) => {
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    
    return `🧠 *Did You Know?*\n\n${randomFact}\n\n_The more you know!_ ✨`;
  }
};
