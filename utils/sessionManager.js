const config = require('../config');

class SessionManager {
  constructor() {
    this.sessions = new Map();
  }

  get(userId, key) {
    if (!this.sessions.has(userId)) {
      return null;
    }
    
    const userSession = this.sessions.get(userId);
    
    if (!userSession[key]) {
      return null;
    }
    
    const session = userSession[key];
    
    // Check if session expired
    if (session.expiresAt && Date.now() > session.expiresAt) {
      delete userSession[key];
      return null;
    }
    
    return session.data;
  }

  set(userId, key, data, ttl = config.SESSION_TTL) {
    if (!this.sessions.has(userId)) {
      this.sessions.set(userId, {});
    }
    
    const userSession = this.sessions.get(userId);
    userSession[key] = {
      data: data,
      expiresAt: ttl ? Date.now() + (ttl * 1000) : null
    };
  }

  delete(userId, key) {
    if (!this.sessions.has(userId)) {
      return;
    }
    
    const userSession = this.sessions.get(userId);
    delete userSession[key];
  }

  clear(userId) {
    this.sessions.delete(userId);
  }

  clearAll() {
    this.sessions.clear();
  }

  // Clean up expired sessions periodically
  cleanup() {
    const now = Date.now();
    
    for (const [userId, userSession] of this.sessions.entries()) {
      for (const [key, session] of Object.entries(userSession)) {
        if (session.expiresAt && now > session.expiresAt) {
          delete userSession[key];
        }
      }
      
      // Remove user session if empty
      if (Object.keys(userSession).length === 0) {
        this.sessions.delete(userId);
      }
    }
  }
}

// Create singleton instance
const sessionManager = new SessionManager();

// Run cleanup every minute
setInterval(() => {
  sessionManager.cleanup();
}, 60000);

module.exports = sessionManager;
