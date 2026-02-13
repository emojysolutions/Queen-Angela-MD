const logger = require('../utils/logger');
const { formatError } = require('../utils/formatter');

function errorHandler(error, from, sendMessage) {
  logger.error('Error occurred:', error);
  
  let userMessage = '';
  
  // Handle specific error types
  if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
    userMessage = formatError('Network error. Please try again later.');
  } else if (error.response) {
    // API error response
    const status = error.response.status;
    if (status === 429) {
      userMessage = formatError('Rate limit exceeded. Please slow down.');
    } else if (status === 401 || status === 403) {
      userMessage = formatError('Authentication error. Please contact the bot owner.');
    } else if (status >= 500) {
      userMessage = formatError('External service error. Please try again later.');
    } else {
      userMessage = formatError('An error occurred. Please try again.');
    }
  } else if (error.message) {
    // Generic error with message
    if (error.message.includes('Invalid') || error.message.includes('invalid')) {
      userMessage = formatError(error.message);
    } else {
      userMessage = formatError('An unexpected error occurred. Please try again.');
    }
  } else {
    userMessage = formatError('An unexpected error occurred. Please try again.');
  }
  
  // Send error message to user
  if (sendMessage) {
    sendMessage(from, userMessage).catch(err => {
      logger.error('Failed to send error message:', err);
    });
  }
}

module.exports = errorHandler;
