const { searchYouTube } = require('../../utils/youtube');
const { bold, formatDivider } = require('../../utils/formatter');
const logger = require('../../utils/logger');

module.exports = {
  name: 'search',
  aliases: ['ytsearch', 'find', 'findsong'],
  category: 'Music',
  description: 'Search YouTube and pick from results',
  usage: '!search <query>',
  examples: ['!search Ed Sheeran', '!search Coldplay yellow'],
  cooldown: 10,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage, sessionManager }) => {
    // Check if user is selecting from previous results
    const searchSession = sessionManager.get(from, 'search');
    
    if (searchSession && args && args.length === 1 && /^[1-3]$/.test(args[0])) {
      const selection = parseInt(args[0]) - 1;
      const selectedVideo = searchSession.results[selection];
      
      if (!selectedVideo) {
        return '❌ Invalid selection! Choose 1, 2, or 3.';
      }
      
      // Clear session
      sessionManager.delete(from, 'search');
      
      // Return play command instruction
      return `
✅ *Selected:*
${selectedVideo.title}

To download this, use:
!play ${selectedVideo.url}

_Use !play command to download the music_ 🎵
      `.trim();
    }
    
    // New search
    if (!args || args.length === 0) {
      return '🔍 *YouTube Search*\n\nUsage: !search <query>\n\nExample: !search Shape of You';
    }
    
    const query = args.join(' ');
    
    try {
      await sendMessage(from, '🔍 Searching YouTube...');
      
      const results = await searchYouTube(query, 3);
      
      if (!results || results.length === 0) {
        return '❌ No results found!\n\nTry a different search term.';
      }
      
      // Store results in session
      sessionManager.set(from, 'search', { results }, 60);
      
      let response = `
🎵 ${bold('YouTube Search Results')}
${formatDivider()}

`;
      
      results.forEach((video, index) => {
        response += `
${index + 1}. *${video.title}*
   👤 ${video.author}
   ⏱️ ${video.duration || 'N/A'}
   👁️ ${video.views || '0'} views

`;
      });
      
      response += `
${formatDivider()}

Reply with *1*, *2*, or *3* to select
_Selection expires in 60 seconds_
      `.trim();
      
      return response;
      
    } catch (error) {
      logger.error('Search command error:', error);
      return '❌ Search failed!\n\nPlease try again with a different query.';
    }
  }
};
