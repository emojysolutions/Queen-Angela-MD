const config = require('../config');
const logger = require('../utils/logger');

class Auth {
  constructor() {
    this.adminSessions = new Map();
  }

  isAdmin(userId) {
    return this.adminSessions.has(userId) && this.adminSessions.get(userId) > Date.now();
  }

  authenticate(userId, password) {
    if (password === config.ADMIN_PASSWORD) {
      // Admin session valid for 1 hour
      this.adminSessions.set(userId, Date.now() + (3600 * 1000));
      logger.info(`Admin authenticated: ${userId}`);
      return {
        success: true,
        message: '👑 Admin access granted! Session valid for 1 hour.'
      };
    }
    
    logger.warn(`Failed admin authentication attempt: ${userId}`);
    return {
      success: false,
      message: '❌ Invalid admin password.'
    };
  }

  logout(userId) {
    this.adminSessions.delete(userId);
    return {
      success: true,
      message: '👋 Admin session ended.'
    };
  }

  requireAdmin(userId) {
    if (!this.isAdmin(userId)) {
      return {
        allowed: false,
        message: '🔐 This command requires admin privileges.\n\nSend: !admin <password>'
      };
    }
    return { allowed: true };
  }

  // Check if user is the bot owner
  isOwner(userId) {
    if (!config.OWNER_NUMBER) {
      return false;
    }
    return userId === config.OWNER_NUMBER;
  }

  // Clean up expired sessions
  cleanup() {
    const now = Date.now();
    for (const [userId, expiresAt] of this.adminSessions.entries()) {
      if (now >= expiresAt) {
        this.adminSessions.delete(userId);
      }
    }
  }
}

// Create singleton instance
const auth = new Auth();

// Run cleanup every 10 minutes
setInterval(() => {
  auth.cleanup();
}, 600000);

module.exports = auth;
