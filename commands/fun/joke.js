const jokes = require('../../data/jokes.json');

module.exports = {
  name: 'joke',
  aliases: ['funny', 'laugh'],
  category: 'Fun',
  description: 'Get a random joke to brighten your day',
  usage: '!joke',
  examples: ['!joke'],
  cooldown: 3,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage }) => {
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    
    return `😂 *Joke Time!*\n\n${randomJoke}\n\n_Hope that made you smile!_ 😊`;
  }
};
