const config = require('../config');
const logger = require('./logger');

class RateLimiter {
  constructor() {
    this.users = new Map();
    this.aiUsers = new Map();
  }

  checkRateLimit(userId, isAI = false) {
    const limitMap = isAI ? this.aiUsers : this.users;
    const limits = isAI ? config.AI_RATE_LIMIT : config.RATE_LIMIT;
    
    const now = Date.now();
    
    if (!limitMap.has(userId)) {
      limitMap.set(userId, {
        messages: [],
        blocked: false,
        blockedUntil: 0
      });
    }
    
    const userData = limitMap.get(userId);
    
    // Check if user is blocked
    if (userData.blocked && now < userData.blockedUntil) {
      const remainingTime = Math.ceil((userData.blockedUntil - now) / 1000);
      return {
        allowed: false,
        message: `You're sending messages too fast! Please wait ${remainingTime} seconds.`
      };
    } else if (userData.blocked && now >= userData.blockedUntil) {
      // Unblock user
      userData.blocked = false;
      userData.messages = [];
    }
    
    // Remove old messages outside the window
    const windowStart = now - (limits.window * 1000);
    userData.messages = userData.messages.filter(timestamp => timestamp > windowStart);
    
    // Check if user exceeds rate limit
    if (userData.messages.length >= limits.messages) {
      userData.blocked = true;
      userData.blockedUntil = now + (limits.window * 1000);
      logger.warn(`Rate limit exceeded for user ${userId}`);
      
      return {
        allowed: false,
        message: `You're sending messages too fast! Please wait ${limits.window} seconds.`
      };
    }
    
    // Add current message
    userData.messages.push(now);
    
    return {
      allowed: true,
      remaining: limits.messages - userData.messages.length
    };
  }

  reset(userId) {
    this.users.delete(userId);
    this.aiUsers.delete(userId);
  }

  resetAll() {
    this.users.clear();
    this.aiUsers.clear();
  }
}

module.exports = new RateLimiter();
