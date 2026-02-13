module.exports = {
  name: 'weather',
  aliases: ['temp', 'forecast'],
  category: 'Tools',
  description: 'Get weather information (requires API key)',
  usage: '!weather <city>',
  examples: ['!weather London', '!weather New York'],
  cooldown: 5,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage }) => {
    // This is a placeholder. To implement real weather:
    // 1. Sign up for OpenWeatherMap API (free tier available)
    // 2. Add WEATHER_API_KEY to .env
    // 3. Implement API call using axios
    
    return `🌤️ *Weather Service*\n\nWeather service requires configuration!\n\n*To enable weather:*\n1. Get free API key from openweathermap.org\n2. Add WEATHER_API_KEY to .env file\n3. Implement API integration in commands/tools/weather.js\n\n_This is a placeholder command_ 🔧`;
  }
};
