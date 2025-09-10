//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
// Commande START
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { isUserInChannel } from '../utils/checkmember.js';
import fs from 'fs';
import path from 'path';

export async function start(bot, msg) {
  const CHANNEL_USERNAME = '@kurona_tech_channel';
  const GROUP_USERNAME = '@kurona_tech';

  const chatId = msg.chat.id;
  const userId = msg.from.id;

  const date = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const user = msg.from.first_name || "Utilisateur";

  // Vérifier si l'utilisateur est abonné au channel
  const isMember = await isUserInChannel(bot, userId);

  const menu = `
╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
┃       🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴
┃   𝐓𝐡𝐞 𝐔𝐥𝐭𝐢𝐦𝐚𝐭𝐞 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 𝐄𝐱𝐩𝐞𝐫𝐢𝐞𝐧𝐜𝐞
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯

╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
│       🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝐼𝛮𝑭𝛩🎴
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
│ ❃ 𝗢𝘄𝗻𝗲𝗿 : 🎴 𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴
│ ❃ 𝗨𝘀𝗲𝗿 : ${user}
│ ❃ 𝗣𝗿𝗲𝗳𝗶𝘅 : [ / ]
│ ❃ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻 : v1.0.0
│ ❃ 𝗗𝗮𝘁𝗲 : ${date}
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
╭┅┅┅┅┅┅ 𝐂 𝐎 𝐌 𝐌 𝐀 𝐍 𝐃 𝐒 ┅┅┅┅┅┅┅┅╮
┃ Utilise /menu pour voir toutes les commandes disponibles !
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯

🎴 ℬ𝓎  𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥 🎴
`;

  // S'il est déjà membre
  if (isMember) {
    await bot.sendPhoto(chatId, fs.createReadStream(path.resolve('assets/images/logo.png')), {
      caption: menu,
      parse_mode: 'Markdown'
    });
  } else {
    // Sinon on demande de rejoindre le channel/groupe
    await bot.sendMessage(chatId,
      `👋🏾 *Bienvenue ${user}!*\n\nPour utiliser ce bot, rejoins notre channel et groupe :\n\n➳ [Join Channel](https://t.me/${CHANNEL_USERNAME.replace('@', '')})\n➳ [Join Group](https://t.me/${GROUP_USERNAME.replace('@', '')})\n\nPuis clique sur le bouton ci-dessous.`,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: "✅ J'ai rejoint", callback_data: 'check_join' }]
          ]
        }
      }
    );
  }
}

export default start;