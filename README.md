# Queen Angela - WhatsApp Bot 🤖

A powerful and easy-to-use WhatsApp bot built with Node.js and Baileys library.

## Features ✨

- 📱 Multi-device support
- 🔐 Secure QR code authentication
- ⚡ Fast and lightweight
- 🎯 Command-based system
- 🔄 Auto-reconnect functionality
- 📊 Real-time message handling

## Prerequisites 📋

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v20 or higher)
- npm (comes with Node.js)

## Installation 🚀

1. Clone this repository:
```bash
git clone https://github.com/emojysolutions/Queen-Angela-MD.git
cd Queen-Angela-MD
```

2. Install dependencies:
```bash
npm install
```

3. Start the bot:
```bash
npm start
```

4. Scan the QR code with WhatsApp:
   - Open WhatsApp on your phone
   - Go to Settings > Linked Devices
   - Tap "Link a Device"
   - Scan the QR code displayed in your terminal

## Available Commands 📚

Once the bot is connected, you can use these commands:

| Command | Description |
|---------|-------------|
| `/help` | Display all available commands |
| `/ping` | Check bot response time |
| `/info` | Get bot information |
| `/alive` | Check if bot is running |

## Configuration ⚙️

You can customize the bot by editing `config.js`:

```javascript
module.exports = {
  botName: 'Queen Angela',      // Bot name
  prefix: '/',                   // Command prefix
  owner: 'Queen Angela Bot',     // Owner name
  // ... other settings
};
```

## Project Structure 📁

```
Queen-Angela-MD/
├── index.js           # Main bot file
├── config.js          # Configuration settings
├── package.json       # Dependencies
├── .gitignore         # Git ignore rules
└── README.md          # Documentation
```

## How It Works 🔧

1. The bot connects to WhatsApp Web using the Baileys library
2. On first run, it generates a QR code for authentication
3. Authentication credentials are saved locally for subsequent runs
4. The bot listens for incoming messages
5. Commands starting with `/` are processed and responded to

## Security Notes 🔒

- Authentication files are stored locally in `auth_info_baileys/`
- Never share your authentication files
- The `.gitignore` file ensures sensitive data isn't committed
- Use this bot responsibly and comply with WhatsApp's Terms of Service

## Troubleshooting 🛠️

**Bot won't connect:**
- Make sure you have a stable internet connection
- Delete the `auth_info_baileys` folder and scan QR code again
- Ensure you're using Node.js v20 or higher

**QR code not displaying:**
- Try running in a terminal that supports UTF-8
- Check if `qrcode-terminal` is installed correctly

**Commands not working:**
- Verify you're using the correct prefix (default is `/`)
- Check that messages aren't from yourself (bot ignores own messages)

## Development 👨‍💻

To add new commands:

1. Add the command to `config.js` in the `commands` object
2. Add a new case in the `handleCommand` function in `index.js`
3. Implement your command logic

Example:
```javascript
case 'mycommand':
  await sock.sendMessage(from, { text: 'My custom response!' });
  break;
```

## Contributing 🤝

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## License 📄

This project is licensed under the MIT License.

## Disclaimer ⚠️

This bot is for educational purposes. Using automated systems with WhatsApp may violate their Terms of Service. Use at your own risk.

## Support 💬

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Made with ❤️ using Baileys**