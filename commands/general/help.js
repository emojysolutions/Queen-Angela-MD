const { bold, formatDivider } = require('../../utils/formatter');
const config = require('../../config');

module.exports = {
  name: 'help',
  aliases: ['h', 'command'],
  category: 'General',
  description: 'Get help for commands',
  usage: '!help [command]',
  examples: ['!help', '!help ping', '!help play'],
  cooldown: 3,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage, commandLoader }) => {
    // If no command specified, show general help
    if (!args || args.length === 0) {
      const categories = commandLoader.getCategories();
      const commandCount = commandLoader.getAllCommands().length;
      
      const response = `
👑 ${bold('Queen Angela MD - Help')}
${formatDivider()}

🌟 I have ${commandCount} commands at your service!

📚 ${bold('Categories:')}
${categories.map(cat => `  • ${cat}`).join('\n')}

💡 ${bold('Usage:')}
• !help <command> - Get help for specific command
• !menu - See all commands
• ${config.PREFIX} is the command prefix

✨ ${bold('Examples:')}
• !help play - Learn about music
• !help gpt - Learn about AI chat
• !menu - See full command list

${formatDivider()}
_Your royal assistant is ready!_ 💜
      `.trim();
      
      return response;
    }
    
    // Get help for specific command
    const commandName = args[0].toLowerCase();
    const command = commandLoader.getCommand(commandName);
    
    if (!command) {
      return `❌ Command "${commandName}" not found.\n\nUse !help to see all commands.`;
    }
    
    const response = `
👑 ${bold(`Command: ${command.name}`)}
${formatDivider()}

📝 ${bold('Description:')}
${command.description}

💡 ${bold('Usage:')}
${command.usage}

${command.examples && command.examples.length > 0 ? `✨ ${bold('Examples:')}\n${command.examples.map(ex => `  • ${ex}`).join('\n')}` : ''}

${command.aliases && command.aliases.length > 0 ? `🔗 ${bold('Aliases:')}\n${command.aliases.join(', ')}` : ''}

⏱️ ${bold('Cooldown:')} ${command.cooldown || 0}s
🔐 ${bold('Admin Only:')} ${command.adminOnly ? 'Yes' : 'No'}
📂 ${bold('Category:')} ${command.category}

${formatDivider()}
    `.trim();
    
    return response;
  }
};
