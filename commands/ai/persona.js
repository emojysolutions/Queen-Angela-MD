const personas = require('../../data/personas.json');
const { bold, formatDivider } = require('../../utils/formatter');

module.exports = {
  name: 'persona',
  aliases: ['personality', 'character'],
  category: 'AI',
  description: 'Set AI personality/character',
  usage: '!persona [name] or !persona list',
  examples: ['!persona pirate', '!persona list', '!persona default'],
  cooldown: 5,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage, aiManager }) => {
    // Check if any AI is available
    const available = aiManager.getAvailableProviders();
    if (available.length === 0) {
      return '❌ No AI models configured!\n\nPersonas require at least one AI service to be set up.';
    }

    if (!args || args.length === 0 || args[0].toLowerCase() === 'list') {
      // List available personas
      let response = `
🎭 ${bold('Available Personas')}
${formatDivider()}

`;
      
      Object.entries(personas).forEach(([key, persona]) => {
        response += `${persona.emoji} *${persona.name}*\n   !persona ${key}\n\n`;
      });
      
      response += `${formatDivider()}\n_Choose a persona to customize AI responses!_`;
      
      return response;
    }

    const personaKey = args[0].toLowerCase();

    if (!personas[personaKey]) {
      const availableKeys = Object.keys(personas).join(', ');
      return `❌ Persona not found!\n\n*Available personas:*\n${availableKeys}\n\nUse !persona list for details.`;
    }

    try {
      aiManager.setPersona(from, personaKey);
      
      const persona = personas[personaKey];
      
      return `
${persona.emoji} *Persona Set!*

Now using: *${persona.name}*

All AI responses will match this personality!

_Test it with !ai, !gpt, !claude, etc._
      `.trim();
      
    } catch (error) {
      return '❌ Failed to set persona!\n\nPlease try again.';
    }
  }
};
