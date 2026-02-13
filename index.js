const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const config = require('./config');

// Logger configuration
const logger = pino({ level: config.logLevel });

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState(config.sessionName);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: false,
    auth: state,
    browser: ['Queen Angela', 'Chrome', '20.0.04']
  });

  // QR Code generation
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('\n📱 Scan the QR code below to connect:\n');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error instanceof Boom) 
        ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
        : true;

      console.log('Connection closed due to:', lastDisconnect?.error?.message);

      if (shouldReconnect) {
        console.log('Reconnecting...');
        connectToWhatsApp();
      }
    } else if (connection === 'open') {
      console.log('\n✅ Connected successfully!');
      console.log(`🤖 ${config.botName} is now online!`);
      console.log(`📋 Prefix: ${config.prefix}`);
      console.log('Type /help to see available commands\n');
    }
  });

  // Save credentials
  sock.ev.on('creds.update', saveCreds);

  // Message handler
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    // Extract message text
    const messageText = msg.message.conversation 
      || msg.message.extendedTextMessage?.text
      || '';

    const from = msg.key.remoteJid;
    const isGroup = from.endsWith('@g.us');
    
    console.log(`📨 Message from ${isGroup ? 'Group' : 'User'}: ${messageText}`);

    // Check if message starts with prefix
    if (!messageText.startsWith(config.prefix)) return;

    const args = messageText.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    try {
      await handleCommand(sock, msg, command, args);
    } catch (error) {
      console.error('Error handling command:', error);
      await sock.sendMessage(from, { text: config.responses.error });
    }
  });

  return sock;
}

async function handleCommand(sock, msg, command, args) {
  const from = msg.key.remoteJid;

  switch (command) {
    case 'help':
      const helpText = `*${config.botName} - Help Menu* 📚\n\n` +
        Object.entries(config.commands).map(([cmd, desc]) => 
          `${config.prefix}${cmd} - ${desc}`
        ).join('\n') +
        `\n\n_Powered by Baileys_`;
      
      await sock.sendMessage(from, { text: helpText });
      break;

    case 'ping':
      const start = Date.now();
      const sent = await sock.sendMessage(from, { text: '🏓 Pinging...' });
      const end = Date.now();
      const latency = end - start;
      
      await sock.sendMessage(from, { 
        text: `🏓 Pong!\n⏱️ Response time: ${latency}ms`,
        edit: sent.key
      });
      break;

    case 'info':
      const infoText = `*${config.botName} - Bot Information* ℹ️\n\n` +
        `📝 Name: ${config.botName}\n` +
        `🔖 Version: 1.0.0\n` +
        `⚙️ Prefix: ${config.prefix}\n` +
        `👤 Owner: ${config.owner}\n` +
        `📦 Platform: WhatsApp\n` +
        `🚀 Library: Baileys\n\n` +
        `_A powerful WhatsApp bot_`;
      
      await sock.sendMessage(from, { text: infoText });
      break;

    case 'alive':
      const aliveText = `✨ *${config.botName} is alive and running!*\n\n` +
        `🟢 Status: Online\n` +
        `⏰ Uptime: ${Math.floor(process.uptime())}s\n` +
        `💻 Memory: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`;
      
      await sock.sendMessage(from, { text: aliveText });
      break;

    default:
      await sock.sendMessage(from, { text: config.responses.commandNotFound });
      break;
  }
}

// Start the bot
console.log('🚀 Starting Queen Angela WhatsApp Bot...\n');
connectToWhatsApp().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down bot...');
  process.exit(0);
});
