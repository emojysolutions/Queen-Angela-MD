const ytdl = require('ytdl-core');
const path = require('path');
const { searchYouTube, downloadMusic, getVideoInfo, cleanupTempFile } = require('../../utils/youtube');
const { bold, formatDivider } = require('../../utils/formatter');
const logger = require('../../utils/logger');

module.exports = {
  name: 'play',
  aliases: ['music', 'song', 'yt', 'youtube', 'dl'],
  category: 'Music',
  description: 'Download music by title or YouTube URL',
  usage: '!play <title or URL>',
  examples: ['!play Shape of You', '!play https://youtube.com/watch?v=...'],
  cooldown: 15,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage, sendAudio }) => {
    if (!args || args.length === 0) {
      return '🎵 *Music Player*\n\nUsage: !play <title or URL>\n\nExamples:\n• !play Shape of You\n• !play https://youtube.com/watch?v=...';
    }
    
    const query = args.join(' ');
    const tempDir = path.join(__dirname, '../../temp');
    
    try {
      let url = query;
      let isURL = ytdl.validateURL(query);
      
      // If not a URL, search YouTube
      if (!isURL) {
        await sendMessage(from, '🔍 Searching YouTube...');
        
        const results = await searchYouTube(query, 1);
        
        if (!results || results.length === 0) {
          return '❌ No results found!\n\nTry a different search term.';
        }
        
        url = results[0].url;
        await sendMessage(from, `✅ Found: *${results[0].title}*\n\n⬇️ Downloading...`);
      } else {
        await sendMessage(from, '⬇️ Downloading from URL...');
      }
      
      // Get video info
      const info = await getVideoInfo(url);
      
      // Download and convert
      const result = await downloadMusic(url, tempDir);
      
      // Send audio file
      // Note: In production, you'd need to upload the file to a CDN/server
      // and send the URL via sendAudio
      
      const response = `
👑 ${bold('Queen Angela MD - Music')}
${formatDivider()}

🎵 *Title:* ${result.title}
⏱️ *Duration:* ${result.duration}
👁️ *Views:* ${result.views}
🎤 *Artist:* ${info.author}

${formatDivider()}
_Downloaded successfully!_ ✨

_Note: Audio file saved as ${result.filename}_
_In production, this would be sent as WhatsApp audio message_
      `.trim();
      
      // Clean up temp file after a delay
      setTimeout(() => {
        cleanupTempFile(result.path);
      }, 60000); // 1 minute
      
      // In a real implementation:
      // 1. Upload the MP3 file to your server/CDN
      // 2. Get the public URL
      // 3. Use sendAudio(from, audioUrl) to send it
      // For now, we'll just send the info message
      
      return response;
      
    } catch (error) {
      logger.error('Play command error:', error);
      
      if (error.message.includes('too long')) {
        return `❌ ${error.message}`;
      }
      
      if (error.message.includes('Invalid')) {
        return '❌ Invalid YouTube URL!\n\nPlease provide a valid URL or search term.';
      }
      
      return '❌ Failed to download music!\n\nPossible reasons:\n• Video is unavailable\n• Copyright restrictions\n• Network error\n\nPlease try again or use a different video.';
    }
  }
};
