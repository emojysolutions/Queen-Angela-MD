/**
 * WhatsApp message formatting helpers
 */

function bold(text) {
  return `*${text}*`;
}

function italic(text) {
  return `_${text}_`;
}

function strikethrough(text) {
  return `~${text}~`;
}

function monospace(text) {
  return `\`\`\`${text}\`\`\``;
}

function quote(text) {
  return `> ${text}`;
}

function formatList(items, numbered = false) {
  return items.map((item, index) => {
    if (numbered) {
      return `${index + 1}. ${item}`;
    }
    return `• ${item}`;
  }).join('\n');
}

function formatSection(title, content) {
  return `${bold(title)}\n${content}`;
}

function formatDivider() {
  return '━━━━━━━━━━━━━━━━━━━━━━━━━';
}

function truncateText(text, maxLength = 4000) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
}

function formatError(message) {
  return `❌ ${bold('Error')}\n${message}`;
}

function formatSuccess(message) {
  return `✅ ${bold('Success')}\n${message}`;
}

function formatRoyalResponse(message) {
  return `👑 ${message}`;
}

module.exports = {
  bold,
  italic,
  strikethrough,
  monospace,
  quote,
  formatList,
  formatSection,
  formatDivider,
  truncateText,
  formatError,
  formatSuccess,
  formatRoyalResponse
};
