#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  console.log(`
╔══════════════════════════════════════════════╗
║     👑 Queen Angela MD Setup Wizard 👑        ║
╠══════════════════════════════════════════════╣
║  Welcome! Let's configure your royal bot     ║
╚══════════════════════════════════════════════╝

Let's set up your WhatsApp bot. Press Enter to skip optional fields.
  `);

  const config = {};

  // Bot Settings
  console.log('\n📱 Bot Settings\n');
  config.BOT_NAME = await question('Bot Name (Queen Angela MD): ') || 'Queen Angela MD';
  config.PREFIX = await question('Command Prefix (!): ') || '!';
  config.PORT = await question('Server Port (3000): ') || '3000';

  // WhatsApp Configuration
  console.log('\n💬 WhatsApp Cloud API (Required)\n');
  console.log('Get these from: https://developers.facebook.com/apps/\n');
  config.WHATSAPP_TOKEN = await question('WhatsApp Access Token: ');
  config.PHONE_NUMBER_ID = await question('Phone Number ID: ');
  config.VERIFY_TOKEN = await question('Webhook Verify Token (queen_angela_verify): ') || 'queen_angela_verify';

  // Admin Settings
  console.log('\n🔐 Admin Settings\n');
  config.ADMIN_PASSWORD = await question('Admin Password (11223344): ') || '11223344';
  config.OWNER_NUMBER = await question('Owner WhatsApp Number (optional): ') || '';

  // AI Services
  console.log('\n🤖 AI Services (Optional - configure the ones you want)\n');
  console.log('OpenAI (GPT-4o): https://platform.openai.com/api-keys');
  config.OPENAI_API_KEY = await question('OpenAI API Key: ') || '';
  
  console.log('\nAnthropic (Claude): https://console.anthropic.com/');
  config.ANTHROPIC_API_KEY = await question('Anthropic API Key: ') || '';
  
  console.log('\nGoogle AI (Gemini): https://makersuite.google.com/app/apikey');
  config.GOOGLE_AI_KEY = await question('Google AI Key: ') || '';
  
  console.log('\nDeepSeek: https://platform.deepseek.com/');
  config.DEEPSEEK_API_KEY = await question('DeepSeek API Key: ') || '';

  // Generate .env file
  console.log('\n📝 Generating .env file...\n');

  const envContent = `# 👑 Queen Angela MD Configuration

# Bot Settings
BOT_NAME=${config.BOT_NAME}
PREFIX=${config.PREFIX}

# Server
PORT=${config.PORT}

# WhatsApp Cloud API (Required)
WHATSAPP_TOKEN=${config.WHATSAPP_TOKEN}
PHONE_NUMBER_ID=${config.PHONE_NUMBER_ID}
VERIFY_TOKEN=${config.VERIFY_TOKEN}

# Admin Settings
ADMIN_PASSWORD=${config.ADMIN_PASSWORD}
OWNER_NUMBER=${config.OWNER_NUMBER}

# AI API Keys (Optional)
OPENAI_API_KEY=${config.OPENAI_API_KEY}
ANTHROPIC_API_KEY=${config.ANTHROPIC_API_KEY}
GOOGLE_AI_KEY=${config.GOOGLE_AI_KEY}
DEEPSEEK_API_KEY=${config.DEEPSEEK_API_KEY}

# Rate Limiting
MAX_MESSAGE_LENGTH=4000
MAX_AI_INPUT=2000
`;

  const envPath = path.join(__dirname, '.env');
  fs.writeFileSync(envPath, envContent);

  console.log('✅ .env file created successfully!\n');

  // Summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Configuration Summary');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log(`✅ WhatsApp: ${config.WHATSAPP_TOKEN ? 'Configured' : 'Not configured'}`);
  
  const aiConfigured = [];
  if (config.OPENAI_API_KEY) aiConfigured.push('GPT');
  if (config.ANTHROPIC_API_KEY) aiConfigured.push('Claude');
  if (config.GOOGLE_AI_KEY) aiConfigured.push('Gemini');
  if (config.DEEPSEEK_API_KEY) aiConfigured.push('DeepSeek');
  
  if (aiConfigured.length > 0) {
    console.log(`✅ AI Services: ${aiConfigured.join(', ')}`);
  } else {
    console.log('⚠️  No AI services configured (optional)');
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('🎉 Setup complete! Ready to deploy!\n');
  console.log('Next steps:');
  console.log('1. npm install');
  console.log('2. npm start');
  console.log('3. Configure webhook in Facebook Developer Console');
  console.log('   Webhook URL: https://your-domain.com/webhook');
  console.log(`   Verify Token: ${config.VERIFY_TOKEN}\n`);
  
  console.log('For deployment guides, see DEPLOY.md\n');

  rl.close();
}

setup().catch(error => {
  console.error('Setup error:', error);
  rl.close();
  process.exit(1);
});
