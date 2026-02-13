module.exports = {
  name: 'numguess',
  aliases: ['guessnumber', 'numberguess'],
  category: 'Games',
  description: 'Guess a number between 1 and 100',
  usage: '!numguess [number]',
  examples: ['!numguess', '!numguess 50'],
  cooldown: 2,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage, sessionManager }) => {
    // Check if there's an active game
    let game = sessionManager.get(from, 'numguess');
    
    if (!game) {
      // Start new game
      game = {
        number: Math.floor(Math.random() * 100) + 1,
        attempts: 0,
        started: Date.now()
      };
      sessionManager.set(from, 'numguess', game, 600); // 10 minutes TTL
      
      return `
🎲 *Number Guessing Game*

I'm thinking of a number between 1 and 100!

Can you guess it? Type !numguess <number>

_Game expires in 10 minutes_
      `.trim();
    }
    
    // User is guessing
    if (!args || args.length === 0) {
      return `
🎲 *Active Game*

Attempts: ${game.attempts}

Type !numguess <number> to make a guess!
(Number is between 1 and 100)
      `.trim();
    }
    
    const guess = parseInt(args[0]);
    
    if (isNaN(guess) || guess < 1 || guess > 100) {
      return '❌ Please guess a number between 1 and 100!';
    }
    
    game.attempts++;
    
    if (guess === game.number) {
      const timeSpent = Math.floor((Date.now() - game.started) / 1000);
      sessionManager.delete(from, 'numguess');
      
      return `
🎉 *Congratulations!*

You guessed it! The number was ${game.number}!

📊 Stats:
• Attempts: ${game.attempts}
• Time: ${timeSpent}s

Type !numguess to play again!
      `.trim();
    }
    
    let hint;
    const diff = Math.abs(guess - game.number);
    
    if (diff <= 5) {
      hint = '🔥 Super hot!';
    } else if (diff <= 10) {
      hint = '♨️ Hot!';
    } else if (diff <= 20) {
      hint = '🌡️ Warm';
    } else if (diff <= 30) {
      hint = '❄️ Cool';
    } else {
      hint = '🧊 Cold!';
    }
    
    const direction = guess < game.number ? '⬆️ Higher!' : '⬇️ Lower!';
    
    // Update session
    sessionManager.set(from, 'numguess', game, 600);
    
    return `
${direction}

${hint}

Attempts: ${game.attempts}
    `.trim();
  }
};
