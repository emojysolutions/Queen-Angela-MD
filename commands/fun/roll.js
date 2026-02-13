module.exports = {
  name: 'roll',
  aliases: ['dice', 'rolldice', 'd20'],
  category: 'Fun',
  description: 'Roll dice (supports D&D notation)',
  usage: '!roll [XdY]',
  examples: ['!roll', '!roll 2d6', '!roll 3d20', '!roll d100'],
  cooldown: 2,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage }) => {
    let numDice = 1;
    let numSides = 6;
    
    if (args && args.length > 0) {
      const input = args[0].toLowerCase();
      const match = input.match(/^(\d*)d(\d+)$/);
      
      if (match) {
        numDice = match[1] ? parseInt(match[1]) : 1;
        numSides = parseInt(match[2]);
        
        if (numDice < 1 || numDice > 100) {
          return '❌ Number of dice must be between 1 and 100!';
        }
        
        if (numSides < 2 || numSides > 1000) {
          return '❌ Number of sides must be between 2 and 1000!';
        }
      } else {
        return '❌ Invalid format! Use: !roll XdY (e.g., !roll 2d6)';
      }
    }
    
    const rolls = [];
    let total = 0;
    
    for (let i = 0; i < numDice; i++) {
      const roll = Math.floor(Math.random() * numSides) + 1;
      rolls.push(roll);
      total += roll;
    }
    
    let response = `🎲 *Dice Roll*\n\nRolling ${numDice}d${numSides}...\n\n`;
    
    if (numDice === 1) {
      response += `*Result:* ${rolls[0]}`;
    } else {
      response += `*Rolls:* ${rolls.join(', ')}\n*Total:* ${total}`;
    }
    
    return response;
  }
};
