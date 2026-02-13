const reminders = new Map();

function setReminder(userId, message, seconds) {
  const timerId = setTimeout(() => {
    // In a real implementation, you'd send the message here
    // For now, we just remove it from the map
    reminders.delete(userId);
  }, seconds * 1000);
  
  reminders.set(userId, {
    message,
    timerId,
    expiresAt: Date.now() + (seconds * 1000)
  });
}

module.exports = {
  name: 'remind',
  aliases: ['reminder', 'remindme'],
  category: 'Tools',
  description: 'Set a timed reminder',
  usage: '!remind <seconds> <message>',
  examples: ['!remind 60 Check the oven', '!remind 300 Meeting starts'],
  cooldown: 5,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage }) => {
    if (!args || args.length < 2) {
      return '❌ Please specify time and message!\n\nExample: !remind 60 Check the oven\n\nTime is in seconds.';
    }
    
    const seconds = parseInt(args[0]);
    
    if (isNaN(seconds) || seconds < 1 || seconds > 86400) {
      return '❌ Time must be between 1 second and 24 hours (86400 seconds)!';
    }
    
    const message = args.slice(1).join(' ');
    
    // Clear any existing reminder for this user
    if (reminders.has(from)) {
      const existing = reminders.get(from);
      clearTimeout(existing.timerId);
    }
    
    // Set new reminder
    setReminder(from, message, seconds);
    
    // Send the reminder after the time expires
    setTimeout(async () => {
      try {
        await sendMessage(from, `⏰ *Reminder!*\n\n${message}\n\n_Set ${seconds} seconds ago_`);
        reminders.delete(from);
      } catch (error) {
        console.error('Failed to send reminder:', error);
      }
    }, seconds * 1000);
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const timeStr = minutes > 0 
      ? `${minutes}m ${remainingSeconds}s` 
      : `${seconds}s`;
    
    return `⏰ *Reminder Set!*\n\n*Message:* ${message}\n*Time:* ${timeStr}\n\nI'll remind you in ${timeStr}! ⏱️`;
  }
};
