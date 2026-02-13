const words = [
  'programming', 'javascript', 'developer', 'computer', 'software',
  'algorithm', 'database', 'network', 'security', 'application',
  'framework', 'library', 'function', 'variable', 'technology',
  'internet', 'keyboard', 'machine', 'server', 'client'
];

const hangmanStages = [
  `
  ┌─────┐
  │     │
  │     
  │    
  │    
  │   
  └─────
  `,
  `
  ┌─────┐
  │     │
  │     O
  │    
  │    
  │   
  └─────
  `,
  `
  ┌─────┐
  │     │
  │     O
  │     │
  │    
  │   
  └─────
  `,
  `
  ┌─────┐
  │     │
  │     O
  │    /│
  │    
  │   
  └─────
  `,
  `
  ┌─────┐
  │     │
  │     O
  │    /│\\
  │    
  │   
  └─────
  `,
  `
  ┌─────┐
  │     │
  │     O
  │    /│\\
  │    / 
  │   
  └─────
  `,
  `
  ┌─────┐
  │     │
  │     O
  │    /│\\
  │    / \\
  │   
  └─────
  GAME OVER!
  `
];

function getDisplayWord(word, guessedLetters) {
  return word.split('').map(letter => 
    guessedLetters.includes(letter) ? letter : '_'
  ).join(' ');
}

module.exports = {
  name: 'hangman',
  aliases: ['hang'],
  category: 'Games',
  description: 'Play hangman game',
  usage: '!hangman [letter]',
  examples: ['!hangman', '!hangman e', '!hangman a'],
  cooldown: 2,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage, sessionManager }) => {
    // Check if there's an active game
    let game = sessionManager.get(from, 'hangman');
    
    if (!game) {
      // Start new game
      const word = words[Math.floor(Math.random() * words.length)];
      game = {
        word: word,
        guessedLetters: [],
        wrongGuesses: 0,
        started: Date.now()
      };
      sessionManager.set(from, 'hangman', game, 600); // 10 minutes TTL
      
      const display = getDisplayWord(word, []);
      
      return `
🎮 *Hangman Game Started!*

${hangmanStages[0]}

Word: ${display}
Letters: ${word.length}

Type !hangman <letter> to guess!

_Game expires in 10 minutes_
      `.trim();
    }
    
    // User is guessing
    if (!args || args.length === 0) {
      const display = getDisplayWord(game.word, game.guessedLetters);
      
      return `
🎮 *Hangman*

${hangmanStages[game.wrongGuesses]}

Word: ${display}
Guessed: ${game.guessedLetters.join(', ') || 'none'}
Wrong: ${game.wrongGuesses}/6

Type !hangman <letter> to guess!
      `.trim();
    }
    
    const letter = args[0].toLowerCase();
    
    if (letter.length !== 1 || !/[a-z]/.test(letter)) {
      return '❌ Please guess a single letter (a-z)!';
    }
    
    if (game.guessedLetters.includes(letter)) {
      return `❌ You already guessed "${letter}"!\n\nGuessed: ${game.guessedLetters.join(', ')}`;
    }
    
    game.guessedLetters.push(letter);
    
    if (!game.word.includes(letter)) {
      game.wrongGuesses++;
    }
    
    const display = getDisplayWord(game.word, game.guessedLetters);
    
    // Check if game is lost
    if (game.wrongGuesses >= 6) {
      sessionManager.delete(from, 'hangman');
      
      return `
${hangmanStages[6]}

The word was: *${game.word.toUpperCase()}*

Better luck next time!
Type !hangman to play again!
      `.trim();
    }
    
    // Check if game is won
    if (!display.includes('_')) {
      const timeSpent = Math.floor((Date.now() - game.started) / 1000);
      sessionManager.delete(from, 'hangman');
      
      return `
🎉 *Congratulations!*

${hangmanStages[game.wrongGuesses]}

You guessed the word: *${game.word.toUpperCase()}*

📊 Stats:
• Wrong guesses: ${game.wrongGuesses}/6
• Time: ${timeSpent}s

Type !hangman to play again!
      `.trim();
    }
    
    // Update session and continue game
    sessionManager.set(from, 'hangman', game, 600);
    
    const result = game.word.includes(letter) ? '✅ Correct!' : '❌ Wrong!';
    
    return `
${result}

${hangmanStages[game.wrongGuesses]}

Word: ${display}
Guessed: ${game.guessedLetters.join(', ')}
Wrong: ${game.wrongGuesses}/6
    `.trim();
  }
};
