const triviaData = require('../../data/trivia.json');

module.exports = {
  name: 'trivia',
  aliases: ['quiz', 'question'],
  category: 'Games',
  description: 'Play trivia quiz game',
  usage: '!trivia [category]',
  examples: ['!trivia', '!trivia science', '!trivia history'],
  cooldown: 5,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage, sessionManager }) => {
    const categories = Object.keys(triviaData);
    
    // Check if user is answering a previous question
    const currentQuestion = sessionManager.get(from, 'trivia');
    if (currentQuestion && args && args.length > 0 && args[0].length === 1) {
      const answer = args[0].toUpperCase();
      
      if (answer === currentQuestion.answer) {
        sessionManager.delete(from, 'trivia');
        
        // Update score
        const score = sessionManager.get(from, 'triviaScore') || 0;
        sessionManager.set(from, 'triviaScore', score + 1, 3600);
        
        return `✅ *Correct!*\n\nThe answer is ${currentQuestion.answer}!\n\n🏆 Your score: ${score + 1}`;
      } else {
        sessionManager.delete(from, 'trivia');
        return `❌ *Wrong!*\n\nThe correct answer was ${currentQuestion.answer}.\n\nBetter luck next time!`;
      }
    }
    
    // Select category
    let category;
    if (args && args.length > 0) {
      const requestedCategory = args[0].toLowerCase();
      const matchedCategory = categories.find(cat => 
        cat.toLowerCase() === requestedCategory || 
        cat.toLowerCase().includes(requestedCategory)
      );
      
      if (!matchedCategory) {
        return `❌ Category not found!\n\n*Available categories:*\n${categories.join(', ')}`;
      }
      category = matchedCategory;
    } else {
      category = categories[Math.floor(Math.random() * categories.length)];
    }
    
    // Get random question from category
    const questions = triviaData[category];
    const question = questions[Math.floor(Math.random() * questions.length)];
    
    // Store question in session
    sessionManager.set(from, 'trivia', question, 60);
    
    const response = `
🎯 *Trivia Time!*

📚 *Category:* ${category}

❓ *Question:*
${question.question}

${question.options.join('\n')}

_Reply with A, B, C, or D within 60 seconds!_
    `.trim();
    
    return response;
  }
};
