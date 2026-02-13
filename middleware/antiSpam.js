const logger = require('../utils/logger');

class AntiSpam {
  constructor() {
    this.spamScores = new Map();
    this.blockedUsers = new Map();
  }

  check(userId) {
    const now = Date.now();
    
    // Check if user is blocked
    if (this.blockedUsers.has(userId)) {
      const blockEnd = this.blockedUsers.get(userId);
      if (now < blockEnd) {
        const remainingMinutes = Math.ceil((blockEnd - now) / 60000);
        return {
          allowed: false,
          message: `🚫 You have been temporarily blocked for spam. Wait ${remainingMinutes} minute(s).`
        };
      } else {
        // Unblock user
        this.blockedUsers.delete(userId);
        this.spamScores.delete(userId);
      }
    }
    
    // Get or initialize spam score
    if (!this.spamScores.has(userId)) {
      this.spamScores.set(userId, {
        score: 0,
        lastUpdate: now,
        violations: []
      });
    }
    
    const userScore = this.spamScores.get(userId);
    
    // Decay spam score over time (reduce by 1 every 10 seconds)
    const timeSinceLastUpdate = now - userScore.lastUpdate;
    const decay = Math.floor(timeSinceLastUpdate / 10000);
    userScore.score = Math.max(0, userScore.score - decay);
    userScore.lastUpdate = now;
    
    // Increment spam score
    userScore.score += 1;
    
    // Check for spam threshold
    if (userScore.score > 20) {
      // Block user for 5 minutes
      this.blockedUsers.set(userId, now + (5 * 60000));
      logger.warn(`User ${userId} blocked for spam (score: ${userScore.score})`);
      
      return {
        allowed: false,
        message: '🚫 Spam detected! You have been blocked for 5 minutes.'
      };
    }
    
    // Warning threshold
    if (userScore.score > 15) {
      return {
        allowed: true,
        warning: '⚠️ Slow down! You\'re sending messages too quickly.'
      };
    }
    
    return { allowed: true };
  }

  reset(userId) {
    this.spamScores.delete(userId);
    this.blockedUsers.delete(userId);
  }

  resetAll() {
    this.spamScores.clear();
    this.blockedUsers.clear();
  }

  // Clean up old data
  cleanup() {
    const now = Date.now();
    
    // Clean up expired blocks
    for (const [userId, blockEnd] of this.blockedUsers.entries()) {
      if (now >= blockEnd) {
        this.blockedUsers.delete(userId);
        this.spamScores.delete(userId);
      }
    }
    
    // Clean up old spam scores
    for (const [userId, userScore] of this.spamScores.entries()) {
      if (now - userScore.lastUpdate > 300000) { // 5 minutes
        this.spamScores.delete(userId);
      }
    }
  }
}

// Create singleton instance
const antiSpam = new AntiSpam();

// Run cleanup every 5 minutes
setInterval(() => {
  antiSpam.cleanup();
}, 300000);

module.exports = antiSpam;
