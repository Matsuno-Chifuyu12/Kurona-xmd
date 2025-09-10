// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
//  The Ultimate WhatsApp Experience
// Handle "check join" button for Telegram users
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { isUserInChannel } from '../utils/checkmember.js';

export async function handleCheckJoin(bot, callbackQuery) {
  const chatId = callbackQuery.message.chat.id;
  const messageId = callbackQuery.message.message_id;
  const userId = callbackQuery.from.id;
  const userName = callbackQuery.from.first_name || "unknown";

  // Acknowledge the button press
  await bot.answerCallbackQuery(callbackQuery.id);

  try {
    await bot.deleteMessage(chatId, messageId);
    console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴 | Deleted check_join button message for user " + userId + "\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
  } catch (e) {
    console.warn("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴 | Couldn't delete message for user " + userId + ":\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯", e.message);
  }

  try {
    const isMember = await isUserInChannel(bot, userId);
    console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴 | Membership check for user " + userId + ": " + isMember + "\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");

    if (isMember) {
      await bot.sendPhoto(chatId, 'menu.jpg', {
        caption: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 👋🏾 *Welcome back, " + userName + "!*\n│ \n│ You're all set. Use /menu to explore\n│ available options.\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯",
        parse_mode: 'Markdown'
      });
    } else {
      await bot.sendPhoto(chatId, 'menu.jpg', {
        caption: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🚫 *You're not in the required groups yet!*\n│ \n│ Please make sure you've joined both\n│ the channel and group:\n│ \n│ ➺ [Join Channel](https://t.me/senku_tech_channel)\n│ ➺ [Join Group](https://t.me/senku_tech)\n│ \n│ Then press the button again.\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯",
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: "✅ I've Joined", callback_data: 'check_join' }]
          ]
        }
      });
    }

  } catch (err) {
    console.error("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴 | Error handling check_join for user " + userId + ":\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯", err.message);
  }
}

export default handleCheckJoin;
