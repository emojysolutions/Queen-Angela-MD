const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

class CommandLoader {
  constructor() {
    this.commands = new Map();
    this.aliases = new Map();
    this.categories = new Map();
  }

  /**
   * Recursively load all command files from subdirectories
   */
  loadCommands(directory = __dirname) {
    let loadedCount = 0;

    const loadDirectory = (dir) => {
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          // Recursively load subdirectories
          loadDirectory(fullPath);
        } else if (item.endsWith('.js') && item !== 'index.js') {
          try {
            const command = require(fullPath);
            
            // Validate command structure
            if (!command.name || !command.execute) {
              logger.warn(`Invalid command file: ${fullPath}`);
              continue;
            }

            // Register command
            this.commands.set(command.name, command);
            loadedCount++;

            // Register aliases
            if (command.aliases && Array.isArray(command.aliases)) {
              command.aliases.forEach(alias => {
                this.aliases.set(alias, command.name);
              });
            }

            // Register category
            const category = command.category || 'General';
            if (!this.categories.has(category)) {
              this.categories.set(category, []);
            }
            this.categories.get(category).push(command);

            logger.debug(`Loaded command: ${command.name} from ${path.relative(__dirname, fullPath)}`);
          } catch (error) {
            logger.error(`Failed to load command from ${fullPath}:`, error);
          }
        }
      }
    };

    loadDirectory(directory);
    logger.success(`Loaded ${loadedCount} commands`);
    return loadedCount;
  }

  /**
   * Get a command by name or alias
   */
  getCommand(nameOrAlias) {
    // Check if it's a direct command name
    if (this.commands.has(nameOrAlias)) {
      return this.commands.get(nameOrAlias);
    }

    // Check if it's an alias
    if (this.aliases.has(nameOrAlias)) {
      const commandName = this.aliases.get(nameOrAlias);
      return this.commands.get(commandName);
    }

    return null;
  }

  /**
   * Get all commands
   */
  getAllCommands() {
    return Array.from(this.commands.values());
  }

  /**
   * Get commands by category
   */
  getCommandsByCategory(category) {
    return this.categories.get(category) || [];
  }

  /**
   * Get all categories
   */
  getCategories() {
    return Array.from(this.categories.keys());
  }

  /**
   * Get commands grouped by category
   */
  getCommandsGrouped() {
    const grouped = {};
    for (const [category, commands] of this.categories.entries()) {
      grouped[category] = commands;
    }
    return grouped;
  }
}

// Create and export singleton
const loader = new CommandLoader();
loader.loadCommands(__dirname);

module.exports = loader;
