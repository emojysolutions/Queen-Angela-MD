module.exports = {
  name: 'shorten',
  aliases: ['shorturl', 'tinyurl'],
  category: 'Tools',
  description: 'URL shortener (requires API key)',
  usage: '!shorten <url>',
  examples: ['!shorten https://example.com/very/long/url'],
  cooldown: 5,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage }) => {
    // This is a placeholder. To implement real URL shortening:
    // 1. Sign up for a URL shortening service (bit.ly, tinyurl, etc.)
    // 2. Add API key to .env
    // 3. Implement API call using axios
    
    return `🔗 *URL Shortener*\n\nURL shortener requires configuration!\n\n*To enable URL shortening:*\n1. Get API key from bit.ly or similar service\n2. Add URL_SHORTENER_KEY to .env file\n3. Implement API integration in commands/tools/shorten.js\n\n_This is a placeholder command_ 🔧`;
  }
};
