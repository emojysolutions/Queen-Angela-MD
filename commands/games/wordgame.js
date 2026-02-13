const words = [
  'javascript', 'python', 'computer', 'keyboard', 'internet', 'software',
  'programming', 'algorithm', 'database', 'developer', 'application',
  'function', 'variable', 'machine', 'technology', 'network', 'security',
  'encryption', 'server', 'client', 'responsive', 'framework', 'library'
];

function scrambleWord(word) {
  const arr = word.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}

module.exports = {
  name: 'wordgame',
  aliases: ['scramble', 'unscramble', 'wordscramble'],
  category: 'Games',
  description: 'Unscramble the word',
  usage: '!wordgame [answer]',
  examples: ['!wordgame', '!wordgame computer'],
  cooldown: 3,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage, sessionManager }) => {
    // Check if there's an active game
    let game = sessionManager.get(from, 'wordgame');
    
    if (!game) {
      // Start new game
      const word = words[Math.floor(Math.random() * words.length)];
      let scrambled = scrambleWord(word);
      
      // Make sure scrambled is different from original
      let attempts = 0;
      while (scrambled === word && attempts < 10) {
        scrambled = scrambleWord(word);
        attempts++;
      }
      
      game = {
        word: word,
        scrambled: scrambled,
        started: Date.now()
      };
      sessionManager.set(from, 'wordgame', game, 300); // 5 minutes TTL
      
      return `
🔤 *Word Scramble!*

Unscramble this word:

*${scrambled.toUpperCase()}*

Hint: ${word.length} letters

Type !wordgame <answer> to guess!

_Game expires in 5 minutes_
      `.trim();
    }
    
    // User is guessing
    if (!args || args.length === 0) {
      return `
🔤 *Active Game*

Word: *${game.scrambled.toUpperCase()}*
Letters: ${game.word.length}

Type !wordgame <answer> to guess!
      `.trim();
    }
    
    const guess = args[0].toLowerCase();
    
    if (guess === game.word) {
      const timeSpent = Math.floor((Date.now() - game.started) / 1000);
      sessionManager.delete(from, 'wordgame');
      
      return `
🎉 *Correct!*

The word was: *${game.word.toUpperCase()}*

⏱️ Time: ${timeSpent}s

Type !wordgame to play again!
      `.trim();
    } else {
      return `
❌ *Incorrect!*

Try again!
Word: *${game.scrambled.toUpperCase()}*

Hint: The word has ${game.word.length} letters
      `.trim();
    }
  }
};
