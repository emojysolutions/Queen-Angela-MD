const translations = {
  hello: {
    spanish: 'hola',
    french: 'bonjour',
    german: 'hallo',
    italian: 'ciao',
    portuguese: 'olá'
  },
  goodbye: {
    spanish: 'adiós',
    french: 'au revoir',
    german: 'auf wiedersehen',
    italian: 'arrivederci',
    portuguese: 'adeus'
  },
  'thank you': {
    spanish: 'gracias',
    french: 'merci',
    german: 'danke',
    italian: 'grazie',
    portuguese: 'obrigado'
  },
  yes: {
    spanish: 'sí',
    french: 'oui',
    german: 'ja',
    italian: 'sì',
    portuguese: 'sim'
  },
  no: {
    spanish: 'no',
    french: 'non',
    german: 'nein',
    italian: 'no',
    portuguese: 'não'
  },
  please: {
    spanish: 'por favor',
    french: 's\'il vous plaît',
    german: 'bitte',
    italian: 'per favore',
    portuguese: 'por favor'
  },
  'i love you': {
    spanish: 'te amo',
    french: 'je t\'aime',
    german: 'ich liebe dich',
    italian: 'ti amo',
    portuguese: 'eu te amo'
  },
  good morning: {
    spanish: 'buenos días',
    french: 'bonjour',
    german: 'guten morgen',
    italian: 'buongiorno',
    portuguese: 'bom dia'
  },
  'good night': {
    spanish: 'buenas noches',
    french: 'bonne nuit',
    german: 'gute nacht',
    italian: 'buona notte',
    portuguese: 'boa noite'
  }
};

const languages = ['spanish', 'french', 'german', 'italian', 'portuguese'];

module.exports = {
  name: 'translate',
  aliases: ['trans', 'translation'],
  category: 'Tools',
  description: 'Translate common phrases to 5 languages',
  usage: '!translate <language> <phrase>',
  examples: ['!translate spanish hello', '!translate french thank you'],
  cooldown: 3,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage }) => {
    if (!args || args.length < 2) {
      const phrases = Object.keys(translations).join(', ');
      return `🌐 *Translator*\n\n*Usage:* !translate <language> <phrase>\n\n*Languages:* ${languages.join(', ')}\n\n*Common phrases:*\n${phrases}`;
    }
    
    const language = args[0].toLowerCase();
    const phrase = args.slice(1).join(' ').toLowerCase();
    
    if (!languages.includes(language)) {
      return `❌ Language not supported!\n\n*Available languages:*\n${languages.join(', ')}`;
    }
    
    if (!translations[phrase]) {
      const availablePhrases = Object.keys(translations).join(', ');
      return `❌ Phrase not found!\n\n*Available phrases:*\n${availablePhrases}`;
    }
    
    const translation = translations[phrase][language];
    
    const flags = {
      spanish: '🇪🇸',
      french: '🇫🇷',
      german: '🇩🇪',
      italian: '🇮🇹',
      portuguese: '🇵🇹'
    };
    
    return `${flags[language]} *Translation*\n\n*English:* ${phrase}\n*${language.charAt(0).toUpperCase() + language.slice(1)}:* ${translation}`;
  }
};
