const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const fs = require('fs');
const path = require('path');
const config = require('../config');
const logger = require('./logger');

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

/**
 * Search YouTube for videos
 */
async function searchYouTube(query, limit = 3) {
  try {
    const filters = await ytsr.getFilters(query);
    const filter = filters.get('Type').get('Video');
    
    const searchResults = await ytsr(filter.url, {
      limit: limit
    });
    
    return searchResults.items.map(item => ({
      title: item.title,
      url: item.url,
      duration: item.duration,
      views: item.views,
      thumbnail: item.bestThumbnail?.url || item.thumbnails?.[0]?.url,
      author: item.author?.name
    }));
  } catch (error) {
    logger.error('YouTube search error:', error);
    throw new Error('Failed to search YouTube');
  }
}

/**
 * Download and convert YouTube video to MP3
 */
async function downloadMusic(url, outputPath) {
  return new Promise(async (resolve, reject) => {
    try {
      // Validate URL
      if (!ytdl.validateURL(url)) {
        reject(new Error('Invalid YouTube URL'));
        return;
      }
      
      // Get video info
      const info = await ytdl.getInfo(url);
      const duration = parseInt(info.videoDetails.lengthSeconds);
      
      // Check duration limit
      if (duration > config.MAX_MUSIC_DURATION) {
        reject(new Error(`Video is too long! Maximum duration is ${config.MAX_MUSIC_DURATION / 60} minutes.`));
        return;
      }
      
      const title = info.videoDetails.title;
      const filename = sanitizeFilename(title) + '.mp3';
      const fullPath = path.join(outputPath, filename);
      
      // Download video
      const stream = ytdl(url, {
        quality: 'highestaudio',
        filter: 'audioonly'
      });
      
      // Convert to MP3
      ffmpeg(stream)
        .audioBitrate(config.MUSIC_QUALITY || 128)
        .format('mp3')
        .on('error', (error) => {
          logger.error('FFmpeg error:', error);
          reject(new Error('Failed to convert audio'));
        })
        .on('end', () => {
          logger.info(`Downloaded: ${filename}`);
          resolve({
            path: fullPath,
            filename: filename,
            title: title,
            duration: formatDuration(duration),
            views: formatViews(info.videoDetails.viewCount)
          });
        })
        .save(fullPath);
        
    } catch (error) {
      logger.error('Download error:', error);
      reject(error);
    }
  });
}

/**
 * Get video info without downloading
 */
async function getVideoInfo(url) {
  try {
    if (!ytdl.validateURL(url)) {
      throw new Error('Invalid YouTube URL');
    }
    
    const info = await ytdl.getInfo(url);
    
    return {
      title: info.videoDetails.title,
      duration: formatDuration(info.videoDetails.lengthSeconds),
      views: formatViews(info.videoDetails.viewCount),
      author: info.videoDetails.author.name,
      thumbnail: info.videoDetails.thumbnails?.[0]?.url
    };
  } catch (error) {
    logger.error('Get video info error:', error);
    throw error;
  }
}

/**
 * Format duration from seconds to MM:SS or HH:MM:SS
 */
function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format view count (e.g., 1.2M, 45K)
 */
function formatViews(views) {
  const num = parseInt(views);
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Sanitize filename
 */
function sanitizeFilename(filename) {
  return filename
    .replace(/[<>:"/\\|?*]/g, '') // Remove invalid chars
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .substring(0, 100); // Limit length
}

/**
 * Clean up temp files
 */
function cleanupTempFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logger.info(`Cleaned up temp file: ${filePath}`);
    }
  } catch (error) {
    logger.error('Cleanup error:', error);
  }
}

module.exports = {
  searchYouTube,
  downloadMusic,
  getVideoInfo,
  formatDuration,
  formatViews,
  sanitizeFilename,
  cleanupTempFile
};
