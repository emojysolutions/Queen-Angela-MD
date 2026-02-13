class CooldownManager {
  constructor() {
    this.cooldowns = new Map();
  }

  check(userId, commandName, cooldownSeconds) {
    if (!cooldownSeconds || cooldownSeconds === 0) {
      return { allowed: true };
    }

    const key = `${userId}:${commandName}`;
    const now = Date.now();
    
    if (this.cooldowns.has(key)) {
      const cooldownEnd = this.cooldowns.get(key);
      
      if (now < cooldownEnd) {
        const remaining = Math.ceil((cooldownEnd - now) / 1000);
        return {
          allowed: false,
          remaining: remaining,
          message: `⏱️ Please wait ${remaining}s before using this command again.`
        };
      }
    }
    
    // Set new cooldown
    this.cooldowns.set(key, now + (cooldownSeconds * 1000));
    
    return { allowed: true };
  }

  reset(userId, commandName) {
    const key = `${userId}:${commandName}`;
    this.cooldowns.delete(key);
  }

  resetUser(userId) {
    for (const key of this.cooldowns.keys()) {
      if (key.startsWith(`${userId}:`)) {
        this.cooldowns.delete(key);
      }
    }
  }

  resetAll() {
    this.cooldowns.clear();
  }

  // Clean up expired cooldowns
  cleanup() {
    const now = Date.now();
    for (const [key, cooldownEnd] of this.cooldowns.entries()) {
      if (now >= cooldownEnd) {
        this.cooldowns.delete(key);
      }
    }
  }
}

// Create singleton instance
const cooldownManager = new CooldownManager();

// Run cleanup every 5 minutes
setInterval(() => {
  cooldownManager.cleanup();
}, 300000);

module.exports = cooldownManager;
