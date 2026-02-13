const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  
  // Colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  // Background colors
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
};

function getTimestamp() {
  const now = new Date();
  return now.toISOString();
}

const logger = {
  info: (message, ...args) => {
    console.log(`${colors.cyan}[INFO]${colors.reset} ${colors.dim}${getTimestamp()}${colors.reset} ${message}`, ...args);
  },
  
  success: (message, ...args) => {
    console.log(`${colors.green}[SUCCESS]${colors.reset} ${colors.dim}${getTimestamp()}${colors.reset} ${message}`, ...args);
  },
  
  warn: (message, ...args) => {
    console.log(`${colors.yellow}[WARN]${colors.reset} ${colors.dim}${getTimestamp()}${colors.reset} ${message}`, ...args);
  },
  
  error: (message, ...args) => {
    console.log(`${colors.red}[ERROR]${colors.reset} ${colors.dim}${getTimestamp()}${colors.reset} ${message}`, ...args);
  },
  
  debug: (message, ...args) => {
    if (process.env.DEBUG) {
      console.log(`${colors.magenta}[DEBUG]${colors.reset} ${colors.dim}${getTimestamp()}${colors.reset} ${message}`, ...args);
    }
  },
  
  command: (message, ...args) => {
    console.log(`${colors.blue}[COMMAND]${colors.reset} ${colors.dim}${getTimestamp()}${colors.reset} ${message}`, ...args);
  },
  
  royal: (message, ...args) => {
    console.log(`${colors.magenta}${colors.bright}[👑 QUEEN]${colors.reset} ${colors.dim}${getTimestamp()}${colors.reset} ${message}`, ...args);
  },
  
  banner: () => {
    console.log(`
${colors.magenta}╔══════════════════════════════════════════════╗
║     👑 Queen Angela MD v1.0.0 👑              ║
║     Your Royal WhatsApp Assistant             ║
╠══════════════════════════════════════════════╣
║  Status:   🟢 Online                          ║
║  Creator:  emojysolutions                     ║
╚══════════════════════════════════════════════╝${colors.reset}
    `);
  }
};

module.exports = logger;
