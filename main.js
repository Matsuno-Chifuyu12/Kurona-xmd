import connectToWhatsApp from './auth/authHandler.js';
import handleIncomingMessage from './events/messageHandler.js';
import { startBot } from './events/bot.js';
import { MODE } from './config.js';
import isValidCode from './utils/validator.js';

async function initializeApp() {
  if (MODE === "Default") {
    await connectToWhatsApp(handleIncomingMessage);
  } else {
    const duration = isValidCode(MODE);
    
    if (!duration) {
      console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ❌ 🎴Invalid license key. Contact @dev_kurona 🎴\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
      process.exit(1);
    }

    console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ✅ Valid key. Duration: " + Math.ceil(duration / (1000 * 60 * 60 * 24)) + " days\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
    startBot(duration);
  }
}

initializeApp().catch(console.error);