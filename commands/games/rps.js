module.exports = {
  name: 'rps',
  aliases: ['rockpaperscissors', 'rock'],
  category: 'Games',
  description: 'Play Rock, Paper, Scissors',
  usage: '!rps <rock|paper|scissors>',
  examples: ['!rps rock', '!rps paper', '!rps scissors'],
  cooldown: 3,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage }) => {
    if (!args || args.length === 0) {
      return '✋ *Rock, Paper, Scissors!*\n\nUsage: !rps <rock|paper|scissors>\n\nExample: !rps rock';
    }
    
    const choices = ['rock', 'paper', 'scissors'];
    const userChoice = args[0].toLowerCase();
    
    if (!choices.includes(userChoice)) {
      return '❌ Invalid choice! Choose rock, paper, or scissors.';
    }
    
    const botChoice = choices[Math.floor(Math.random() * choices.length)];
    
    const emojis = {
      rock: '🪨',
      paper: '📄',
      scissors: '✂️'
    };
    
    let result;
    if (userChoice === botChoice) {
      result = 'It\'s a tie!';
    } else if (
      (userChoice === 'rock' && botChoice === 'scissors') ||
      (userChoice === 'paper' && botChoice === 'rock') ||
      (userChoice === 'scissors' && botChoice === 'paper')
    ) {
      result = '🎉 You win!';
    } else {
      result = '😢 You lose!';
    }
    
    return `
✋ *Rock, Paper, Scissors!*

👤 You chose: ${emojis[userChoice]} ${userChoice}
🤖 I chose: ${emojis[botChoice]} ${botChoice}

${result}
    `.trim();
  }
};
