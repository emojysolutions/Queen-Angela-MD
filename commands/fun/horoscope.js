const horoscopes = {
  aries: "Today brings exciting opportunities, Aries! Your natural leadership will shine. A creative project may surprise you with its success.",
  taurus: "Patience pays off today, Taurus. Focus on building something lasting. Financial matters look promising.",
  gemini: "Communication is your superpower today, Gemini! Connect with others and share your ideas. Social opportunities abound.",
  cancer: "Trust your intuition, Cancer. Home and family matters need your attention. Emotional clarity brings peace.",
  leo: "Your charisma is magnetic today, Leo! Take center stage and let your creativity flow. Recognition is coming your way.",
  virgo: "Organization leads to success, Virgo. Your attention to detail impresses others. Health and wellness are favored.",
  libra: "Balance is key today, Libra. Relationships flourish when you're authentic. Artistic pursuits bring joy.",
  scorpio: "Intensity works in your favor, Scorpio. Deep conversations reveal truth. Transform challenges into opportunities.",
  sagittarius: "Adventure calls, Sagittarius! Expand your horizons through learning. Optimism attracts positive outcomes.",
  capricorn: "Ambition drives you forward, Capricorn. Your hard work is noticed. Professional goals are within reach.",
  aquarius: "Innovation is your strength, Aquarius. Think outside the box. Community connections bring unexpected benefits.",
  pisces: "Your creativity flows freely, Pisces. Trust your dreams and imagination. Compassion opens doors."
};

const zodiacSigns = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

module.exports = {
  name: 'horoscope',
  aliases: ['zodiac', 'astrology'],
  category: 'Fun',
  description: 'Get your daily horoscope',
  usage: '!horoscope <sign>',
  examples: ['!horoscope aries', '!horoscope leo', '!horoscope'],
  cooldown: 5,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage }) => {
    if (!args || args.length === 0) {
      return `🔮 *Horoscope*\n\nPlease specify your zodiac sign!\n\n*Available signs:*\n${zodiacSigns.join(', ')}\n\nExample: !horoscope leo`;
    }
    
    const sign = args[0].toLowerCase();
    
    if (!zodiacSigns.includes(sign)) {
      return `❌ Invalid zodiac sign!\n\n*Available signs:*\n${zodiacSigns.join(', ')}`;
    }
    
    const horoscope = horoscopes[sign];
    const emoji = {
      aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋',
      leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏',
      sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓'
    };
    
    return `${emoji[sign]} *${sign.charAt(0).toUpperCase() + sign.slice(1)} Horoscope*\n\n${horoscope}\n\n_May the stars guide you!_ ✨`;
  }
};
