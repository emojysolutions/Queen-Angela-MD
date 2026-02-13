const timezones = {
  'new york': 'America/New_York',
  'los angeles': 'America/Los_Angeles',
  'chicago': 'America/Chicago',
  'london': 'Europe/London',
  'paris': 'Europe/Paris',
  'berlin': 'Europe/Berlin',
  'tokyo': 'Asia/Tokyo',
  'hong kong': 'Asia/Hong_Kong',
  'singapore': 'Asia/Singapore',
  'dubai': 'Asia/Dubai',
  'sydney': 'Australia/Sydney',
  'moscow': 'Europe/Moscow',
  'mumbai': 'Asia/Kolkata',
  'beijing': 'Asia/Shanghai',
  'toronto': 'America/Toronto',
  'utc': 'UTC'
};

function getTimeInTimezone(timezone) {
  try {
    const now = new Date();
    return now.toLocaleString('en-US', { 
      timeZone: timezone,
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  } catch (error) {
    return null;
  }
}

module.exports = {
  name: 'time',
  aliases: ['clock', 'timezone', 'worldclock'],
  category: 'Tools',
  description: 'Get current time in major cities',
  usage: '!time [city]',
  examples: ['!time', '!time london', '!time tokyo'],
  cooldown: 3,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage }) => {
    if (!args || args.length === 0) {
      // Show time in all major cities
      const cities = ['new york', 'london', 'tokyo', 'dubai', 'sydney'];
      let response = '🌍 *World Clock*\n\n';
      
      cities.forEach(city => {
        const time = getTimeInTimezone(timezones[city]);
        const emoji = {
          'new york': '🗽',
          'london': '🇬🇧',
          'tokyo': '🗼',
          'dubai': '🏜️',
          'sydney': '🏖️'
        };
        response += `${emoji[city]} *${city.charAt(0).toUpperCase() + city.slice(1)}*\n${time}\n\n`;
      });
      
      response += `\n_Use !time <city> for specific timezone_\n*Available:* ${Object.keys(timezones).join(', ')}`;
      
      return response;
    }
    
    const cityName = args.join(' ').toLowerCase();
    
    if (!timezones[cityName]) {
      return `❌ City not found!\n\n*Available cities:*\n${Object.keys(timezones).join(', ')}`;
    }
    
    const time = getTimeInTimezone(timezones[cityName]);
    
    if (!time) {
      return '❌ Error getting time for this timezone.';
    }
    
    return `🕐 *Time in ${cityName.charAt(0).toUpperCase() + cityName.slice(1)}*\n\n${time}`;
  }
};
