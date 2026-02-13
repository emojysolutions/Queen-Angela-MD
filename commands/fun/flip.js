module.exports = {
  name: 'flip',
  aliases: ['coin', 'coinflip', 'toss'],
  category: 'Fun',
  description: 'Flip a coin',
  usage: '!flip',
  examples: ['!flip'],
  cooldown: 2,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage }) => {
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
    const emoji = result === 'Heads' ? '👑' : '🎯';
    
    return `🪙 *Coin Flip*\n\n_Flipping..._\n_Spinning..._\n_Landing..._\n\n${emoji} *${result}!*`;
  }
};
