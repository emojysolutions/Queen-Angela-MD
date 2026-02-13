# 👑 Queen Angela MD

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-purple)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green)

**Your Royal WhatsApp Assistant**

A powerful, AI-driven WhatsApp bot with music downloads, games, tools, and multiple AI integrations.

[Features](#features) • [Quick Start](#quick-start) • [Commands](#commands) • [Deployment](#deployment) • [Contributing](#contributing)

</div>

---

## ✨ Features

### 🎵 Music System
- Download music by title or YouTube URL
- YouTube search with interactive selection
- Automatic MP3 conversion (128kbps)
- 10-minute duration limit
- Smart filename sanitization

### 🤖 AI Integration
- **GPT-4o** - Latest OpenAI model
- **Claude Opus** - Anthropic's powerful AI
- **Gemini Pro** - Google's AI model
- **DeepSeek** - Advanced reasoning model
- **DALL-E 3** - AI image generation
- **GPT-4o Vision** - Image analysis
- Smart auto-routing to best available AI
- 10 customizable AI personalities
- Conversation history (20 messages per user)

### 🎮 Interactive Games
- **Trivia Quiz** - 50+ questions across 5 categories
- **Hangman** - Classic word guessing with ASCII art
- **Rock Paper Scissors** - Beat the bot!
- **Number Guess** - 1-100 with hot/cold hints
- **Word Scramble** - Unscramble tech words

### 🔧 Utility Tools
- **Calculator** - Safe math parser (NO eval)
- **World Clock** - Major cities & timezones
- **Todo List** - Per-user task management
- **Reminders** - Timed notifications
- **Translator** - 5 languages, common phrases
- **Weather** - Placeholder (needs API)
- **URL Shortener** - Placeholder (needs API)

### 🎉 Fun Commands
- 30+ jokes
- 50+ inspirational quotes
- 40+ fun facts
- Magic 8-ball
- Coin flip
- Dice roller (D&D notation)
- Daily horoscopes

### 🔐 Security & Admin
- Admin authentication system
- Rate limiting (10 msgs/30s, 5 AI/60s)
- Anti-spam protection
- Command cooldowns
- Per-user session management
- Environment-based secrets

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- WhatsApp Business API account
- (Optional) AI service API keys

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/emojysolutions/Queen-Angela-MD.git
cd Queen-Angela-MD
```

2. **Install dependencies**
```bash
npm install
```

3. **Run setup wizard**
```bash
npm run setup
```

4. **Start the bot**
```bash
npm start
```

### Manual Configuration

Create a `.env` file:

```env
# Required
WHATSAPP_TOKEN=your_whatsapp_token
PHONE_NUMBER_ID=your_phone_id
VERIFY_TOKEN=queen_angela_verify

# Optional AI Services
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_KEY=...
DEEPSEEK_API_KEY=...

# Admin
ADMIN_PASSWORD=your_secure_password
OWNER_NUMBER=your_whatsapp_number
```

---

## 📚 Commands

### 💜 General
| Command | Description |
|---------|-------------|
| `!menu` | Show all commands |
| `!help [command]` | Get help for specific command |
| `!ping` | Check bot latency |
| `!about` | About the bot |

### 🎵 Music
| Command | Description |
|---------|-------------|
| `!play <title or URL>` | Download music |
| `!search <query>` | Search YouTube |

### 🤖 AI
| Command | Description |
|---------|-------------|
| `!gpt <message>` | Chat with GPT-4o |
| `!claude <message>` | Chat with Claude |
| `!gemini <message>` | Chat with Gemini |
| `!deepseek <message>` | Chat with DeepSeek |
| `!ai <message>` | Smart auto-router |
| `!imagine <prompt>` | Generate image |
| `!vision <question>` | Analyze image |
| `!persona <name>` | Set AI personality |

### 🎮 Games
| Command | Description |
|---------|-------------|
| `!trivia [category]` | Play trivia quiz |
| `!hangman [letter]` | Play hangman |
| `!rps <choice>` | Rock Paper Scissors |
| `!numguess [number]` | Number guessing |
| `!wordgame [answer]` | Word scramble |

### 🔧 Tools
| Command | Description |
|---------|-------------|
| `!calc <expression>` | Calculator |
| `!time [city]` | World clock |
| `!todo <action>` | Manage tasks |
| `!remind <sec> <msg>` | Set reminder |
| `!translate <lang> <phrase>` | Translate |

### 🎉 Fun
| Command | Description |
|---------|-------------|
| `!joke` | Random joke |
| `!quote` | Inspirational quote |
| `!fact` | Fun fact |
| `!8ball <question>` | Magic 8-ball |
| `!flip` | Coin flip |
| `!roll [XdY]` | Dice roll |
| `!horoscope <sign>` | Daily horoscope |

### 🔐 Admin
| Command | Description |
|---------|-------------|
| `!admin <password>` | Authenticate as admin |
| `!stats` | Bot statistics |
| `!broadcast <msg>` | Message all users |
| `!settings` | View settings |

---

## 🐳 Deployment

See [DEPLOY.md](DEPLOY.md) for detailed deployment guides for:

- **BotHosting.net** (PRIMARY - most detailed)
- Railway
- Render
- Heroku
- VPS with PM2
- Docker

### Quick Deploy

**Docker:**
```bash
docker-compose up -d
```

**Railway:**
```bash
railway up
```

**PM2:**
```bash
pm2 start pm2.config.js
```

---

## 🛠️ Development

### Project Structure

```
Queen-Angela-MD/
├── commands/          # Auto-loaded commands
│   ├── general/       # Basic commands
│   ├── fun/          # Entertainment
│   ├── tools/        # Utilities
│   ├── games/        # Interactive games
│   ├── music/        # Music downloads
│   ├── ai/           # AI integrations
│   └── admin/        # Admin tools
├── utils/            # Utility functions
├── middleware/       # Auth, spam, errors
├── data/             # JSON data files
├── bot.js            # Message handler
└── index.js          # Express server
```

### Adding Custom Commands

Create a file in `commands/<category>/<name>.js`:

```javascript
module.exports = {
  name: 'mycommand',
  aliases: ['alias1', 'alias2'],
  category: 'Tools',
  description: 'What it does',
  usage: '!mycommand <args>',
  examples: ['!mycommand test'],
  cooldown: 3,
  adminOnly: false,
  
  execute: async (from, args, { sendMessage }) => {
    return 'Response text';
  }
};
```

The command auto-loader will detect and register it automatically!

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Creator

**emojysolutions**

- GitHub: [@emojysolutions](https://github.com/emojysolutions)
- Repository: [Queen-Angela-MD](https://github.com/emojysolutions/Queen-Angela-MD)

---

## 🙏 Acknowledgments

- WhatsApp Cloud API for messaging infrastructure
- OpenAI, Anthropic, Google, and DeepSeek for AI services
- ytdl-core for YouTube downloads
- The open-source community

---

<div align="center">

**Made with 💜 by emojysolutions**

_A royal bot, fit for a queen_ 👑

</div>