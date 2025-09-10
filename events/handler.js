import fs from 'fs';
import start from '../tools/start.js';
import handleCheckJoin from '../utils/checkJoin.js';
import { isUserInChannel } from '../utils/checkmember.js';
import sessionCount from '../utils/sessionCount.js';
import redirect from '../utils/redirect.js';
import { OWNER_ID, LIMIT } from '../config.js';
import connect from '../utils/connect.js';
import disconnect from '../utils/disconnect.js';
import { getCreds } from '../credits.js';

// Vérifier premium
function isPremium(userId) {
  const data = JSON.parse(fs.readFileSync('./prem.json', 'utf-8'));
  return data.users.includes(userId.toString());
}

// Ajouter premium
function addPremium(userId) {
  const data = JSON.parse(fs.readFileSync('./prem.json', 'utf-8'));
  if (!data.users.includes(userId.toString())) {
    data.users.push(userId.toString());
    fs.writeFileSync('./prem.json', JSON.stringify(data, null, 2));
  }
}

// Retirer premium
function removePremium(userId) {
  const data = JSON.parse(fs.readFileSync('./prem.json', 'utf-8'));
  data.users = data.users.filter(id => id !== userId.toString());
  fs.writeFileSync('./prem.json', JSON.stringify(data, null, 2));
}

// Générer un code encodé avec durée
function encode(id, dur) {
  const expiry = Date.now() + dur * 24 * 60 * 60 * 1000;
  const raw = `${id}|${expiry}`;
  return Buffer.from(raw).toString("base64");
}

export function messageHandler(bot) {
  console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴 | Handler lancé avec succès...\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");

  bot.onText(/\/start/, async (msg) => await start(bot, msg));

  bot.onText(/\/myid/, async (msg) => {
    return bot.sendMessage(msg.chat.id, "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ Your telegram id is : " + msg.from.id + "\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
  });

  bot.onText(/\/menu/, async (msg) => {
    const userId = msg.from.id;
    const isMember = await isUserInChannel(bot, userId);
    if (!isMember) return await start(bot, msg);
    if (!isPremium(userId)) {
      return bot.sendMessage(msg.chat.id, "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ❌ You're not a premium user.\n│ Contact 🎴𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴.\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
    }
    const date = new Date().toLocaleString();
    const user = msg.from.first_name || msg.from.username || "Unknown";
    await bot.sendMessage(msg.chat.id, menuTemplate(user, date));
  });

  bot.onText(/\/connect(?: (.+))?/, async (msg, match) => {
    const userId = msg.from.id;
    const isMember = await isUserInChannel(bot, userId);
    if (!isMember) return await start(bot, msg);
    if (!isPremium(userId)) {
      return bot.sendMessage(msg.chat.id, "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ❌ You're not a premium user.\n│ Contact 🎴𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴.\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
    }
    const session = sessionCount();
    if (session >= LIMIT) return await redirect(bot, msg);
    await connect.connect(bot, msg, match);
  });

  bot.onText(/\/disconnect(?: (.+))?/, async (msg, match) => {
    const userId = msg.from.id;
    const isMember = await isUserInChannel(bot, userId);
    if (!isMember) return await start(bot, msg);
    if (!isPremium(userId)) {
      return bot.sendMessage(msg.chat.id, "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ❌ You're not a premium user.\n│ Contact 🎴𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴.\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
    }
    const session = sessionCount();
    if (session >= LIMIT) return await redirect(bot, msg);
    await disconnect(bot, msg, match);
  });

  bot.on('callback_query', async (callbackQuery) => {
    if (callbackQuery.data === 'check_join') {
      await handleCheckJoin(bot, callbackQuery);
    }
  });

  // Gestion premium
  bot.onText(/\/addprem(?: (.+))?/, async (msg, match) => {
    if (msg.from.id.toString() !== OWNER_ID) return bot.sendMessage(msg.chat.id, "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ❌ Skids lol.\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
    const targetId = match[1];
    if (!targetId) return bot.sendMessage(msg.chat.id, "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ❌ Please provide a user ID.\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
    addPremium(targetId);
    bot.sendMessage(msg.chat.id, "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ✅ 🎴User " + targetId + " added to premium list.🎴\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
  });

  bot.onText(/\/delprem(?: (.+))?/, async (msg, match) {
    if (msg.from.id.toString() !== OWNER_ID) return bot.sendMessage(msg.chat.id, "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ❌ Skids lol.\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
    const targetId = match[1];
    if (!targetId) return bot.sendMessage(msg.chat.id, "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ❌ Please provide a user ID.\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
    removePremium(targetId);
    bot.sendMessage(msg.chat.id, "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ✅ 🎴User " + targetId + " removed from premium list.🎴\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
  });

  // Génération de clé premium
  bot.onText(/\/keygen(?: (.+))?/, async (msg, match) => {
    const creds = getCreds();
    const su = creds.telegram_id;
    if (msg.from.id.toString() !== su) return;
    if (!match[1]) return bot.sendMessage(msg.chat.id, "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ❌ Usage: /keygen <duration_days> <userId>\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
    const args = match[1].trim().split(/\s+/);
    const dur = Number(args[0]);
    const id = args[1];
    if (!id || isNaN(dur)) {
      return bot.sendMessage(msg.chat.id, "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ❌ Usage: /keygen <duration_days> <userId>\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
    }
    const code = encode(id, dur);
    bot.sendMessage(msg.chat.id,
      "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ✅ 🎴The code for user " + id + " is:\n│ ```" + code + "```\n│ \n│ 🕒 It will last for " + dur + " day(s).🎴\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯",
      { parse_mode: "Markdown" }
    );
  });
}
