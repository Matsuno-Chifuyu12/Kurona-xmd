import fs, { readFileSync } from "fs";
import manageConfigs from "../utils/manageConfigs.js";
import auto from "../tools/auto.js";
import reactions from "../tools/reactions.js";
import group from "../tools/group.js";
import tag from "../tools/tag.js";
import bug from "../tools/bug.js";
import react from "../tools/react.js";

// ─────────── LISTES ───────────
export let creator = ["237683614362@s.whatsapp.net"];
export let premium = ["237683614362@s.whatsapp.net"];

// ─────────── TABLE DES COMMANDES ───────────
// Chaque commande est mappée à son module d'outils
const commandMap = {
  // ── UTILS ──
  menu: import("../tools/menu.js"),
  ping: import("../tools/ping.js"),
  sudo: import("../tools/sudo.js"),
  delsudo: import("../tools/delsudo.js"),
  premium: import("../tools/premium.js"),
  connect: import("../tools/connect.js"),
  disconnect: import("../tools/disconnect.js"),
  autoreact: import("../tools/reactions.js"),
  setprefix: import("../tools/set.js"),
  autotype: import("../tools/auto.js"),

  // ── DOWNLOADER ──
  ytmp3: import("../tools/ytmp3.js"),
  ytmp4: import("../tools/ytmp4.js"),
  play: import("../tools/play.js"),
  tiktok: import("../tools/tiktok.js"),
  fb: import("../tools/fb.js"),
  ig: import("../tools/ig.js"),
  
  // ── GROUP ──
  promote: import("../tools/group.js"),
  demote: import("../tools/group.js"),
  demoteall: import("../tools/group.js"),
  promoteall: import("../tools/group.js"),
  kick: import("../tools/group.js"),
  kickall: import("../tools/group.js"),
  purge: import("../tools/group.js"),
  invite: import("../tools/group.js"),
  antimention: import("../tools/group.js"),
  antilink: import("../tools/group.js"),
  antibot: import("../tools/group.js"),
  welcome: import("../tools/group.js"),
  mute: import("../tools/group.js"),
  unmute: import("../tools/group.js"),
  bye: import("../tools/group.js"),
  
  // ── MEDIA ──
  sticker: import("../tools/media.js"),
  toaudio: import("../tools/media.js"),
  photo: import("../tools/media.js"),
  vv: import("../tools/viewonce.js"),
  take: import("../tools/take.js"),
  save: import("../tools/save.js"),

  // ── TAG ──
  antitag: import("../tools/tag.js"),
  tagall: import("../tools/tag.js"),
  tagadmin: import("../tools/tag.js"),
  tag: import("../tools/tag.js"),
  settag: import("../tools/tag.js"),
  respons: import("../tools/auto.js"),
  
  // ── BUG ──
  "d-samy": import("../tools/d-samy.js"),
  "evil-kill": import("../tools/evil-kill.js"),
  crash: import("../tools/crash.js"),
  "invi-darkness": import("../tools/invi-darkness.js"),
  "kuroinvi-ios": import("../tools/kuroinvi-ios.js"),
  gcbug: import("../tools/gcbug.js"),
};

// ─────────── HANDLE MESSAGES ───────────
export async function handleIncomingMessage(sock, m) {
  const userId = m.user?.id ? m.user.id.split(":")[0] : "";
  let lid = "";

  try {
    const creds = JSON.parse(
      readFileSync(`sessions/${userId}/creds.json`, "utf8")
    );
    lid = creds?.me?.lid || m.user?.lid || "";
  } catch {
    lid = m.user?.lid || "";
  }

  const me = lid ? [lid.split(":")[0] + "@s.whatsapp.net"] : [];
  const messages = sock.messages;
  const prefix = manageConfigs.config?.users[userId]?.prefix || ".";

  for (const msg of messages) {
    const textMsg =
      msg.message?.extendedTextMessage?.text ||
      msg.message?.conversation ||
      "";

    const from = msg.key.remoteJid;
    const sender = msg.key.participant?.split("@")[0];

    if (!textMsg || !from) continue;

    // auto features
    auto.respons(msg, sock);
    auto.autotype(msg, sock);
    tag.settag(msg, sock, me);
    group.sGroup(msg, sock, me);
    reactions.reaction(
      msg,
      sock,
      manageConfigs.config?.users[userId]?.emoji,
      manageConfigs.config?.users[userId]?.autoreact
    );

    // check prefix
    if (
      textMsg.toLowerCase().startsWith(prefix) &&
      (msg.key.fromMe ||
        premium.includes(sender + "@s.whatsapp.net") ||
        me.includes(from))
    ) {
      const args = textMsg.slice(prefix.length).trim().split(/\s+/);
      const command = args.shift().toLowerCase();

      try {
        if (commandMap[command]) {
          await react(msg, sock); // ✅ petite réaction automatique
          const module = await commandMap[command];
          if (typeof module.default === "function") {
            await module.default(msg, sock, args);
          } else if (typeof module[command] === "function") {
            await module[command](msg, sock, args);
          }
        } else {
          await sock.sendMessage(from, {
            text: `❌ Commande inconnue: ${command}`,
          });
        }
      } catch (err) {
        console.error(`Erreur dans commande ${command}:`, err);
        await sock.sendMessage(from, {
          text: `⚠️ Erreur lors de l'exécution de *${command}*: ${err.message}`,
        });
      }
    }
  }
}import fs, { readFileSync } from "fs";
import manageConfigs from "../utils/manageConfigs.js";
import auto from "../tools/auto.js";
import reactions from "../tools/reactions.js";
import group from "../tools/group.js";
import tag from "../tools/tag.js";
import bug from "../tools/bug.js";
import react from "../tools/react.js";

// ─────────── LISTES ───────────
export let creator = ["237683614362@s.whatsapp.net"];
export let premium = ["237683614362@s.whatsapp.net"];

// ─────────── TABLE DES COMMANDES ───────────
// Chaque commande est mappée à son module d'outils
const commandMap = {
  // ── UTILS ──
  menu: import("../tools/menu.js"),
  ping: import("../tools/ping.js"),
  sudo: import("../tools/sudo.js"),
  delsudo: import("../tools/delsudo.js"),
  premium: import("../tools/premium.js"),
  connect: import("../tools/connect.js"),
  disconnect: import("../tools/disconnect.js"),
  autoreact: import("../tools/reactions.js"),
  setprefix: import("../tools/set.js"),
  autotype: import("../tools/auto.js"),

  // ── DOWNLOADER ──
  ytmp3: import("../tools/ytmp3.js"),
  ytmp4: import("../tools/ytmp4.js"),
  play: import("../tools/play.js"),
  tiktok: import("../tools/tiktok.js"),
  fb: import("../tools/fb.js"),
  ig: import("../tools/ig.js"),
  
  // ── GROUP ──
  promote: import("../tools/group.js"),
  demote: import("../tools/group.js"),
  demoteall: import("../tools/group.js"),
  promoteall: import("../tools/group.js"),
  kick: import("../tools/group.js"),
  kickall: import("../tools/group.js"),
  purge: import("../tools/group.js"),
  invite: import("../tools/group.js"),
  antimention: import("../tools/group.js"),
  antilink: import("../tools/group.js"),
  antibot: import("../tools/group.js"),
  welcome: import("../tools/group.js"),
  mute: import("../tools/group.js"),
  unmute: import("../tools/group.js"),
  bye: import("../tools/group.js"),
  
  // ── MEDIA ──
  sticker: import("../tools/media.js"),
  toaudio: import("../tools/media.js"),
  photo: import("../tools/media.js"),
  vv: import("../tools/viewonce.js"),
  take: import("../tools/take.js"),
  save: import("../tools/save.js"),

  // ── TAG ──
  antitag: import("../tools/tag.js"),
  tagall: import("../tools/tag.js"),
  tagadmin: import("../tools/tag.js"),
  tag: import("../tools/tag.js"),
  settag: import("../tools/tag.js"),
  respons: import("../tools/auto.js"),
  
  // ── BUG ──
  "d-samy": import("../tools/d-samy.js"),
  "evil-kill": import("../tools/evil-kill.js"),
  crash: import("../tools/crash.js"),
  "invi-darkness": import("../tools/invi-darkness.js"),
  "kuroinvi-ios": import("../tools/kuroinvi-ios.js"),
  gcbug: import("../tools/gcbug.js"),
};

// ─────────── HANDLE MESSAGES ───────────
export async function handleIncomingMessage(sock, m) {
  const userId = m.user?.id ? m.user.id.split(":")[0] : "";
  let lid = "";

  try {
    const creds = JSON.parse(
      readFileSync(`sessions/${userId}/creds.json`, "utf8")
    );
    lid = creds?.me?.lid || m.user?.lid || "";
  } catch {
    lid = m.user?.lid || "";
  }

  const me = lid ? [lid.split(":")[0] + "@s.whatsapp.net"] : [];
  const messages = sock.messages;
  const prefix = manageConfigs.config?.users[userId]?.prefix || ".";

  for (const msg of messages) {
    const textMsg =
      msg.message?.extendedTextMessage?.text ||
      msg.message?.conversation ||
      "";

    const from = msg.key.remoteJid;
    const sender = msg.key.participant?.split("@")[0];

    if (!textMsg || !from) continue;

    // auto features
    auto.respons(msg, sock);
    auto.autotype(msg, sock);
    tag.settag(msg, sock, me);
    group.sGroup(msg, sock, me);
    reactions.reaction(
      msg,
      sock,
      manageConfigs.config?.users[userId]?.emoji,
      manageConfigs.config?.users[userId]?.autoreact
    );

    // check prefix
    if (
      textMsg.toLowerCase().startsWith(prefix) &&
      (msg.key.fromMe ||
        premium.includes(sender + "@s.whatsapp.net") ||
        me.includes(from))
    ) {
      const args = textMsg.slice(prefix.length).trim().split(/\s+/);
      const command = args.shift().toLowerCase();

      try {
        if (commandMap[command]) {
          await react(msg, sock); // ✅ petite réaction automatique
          const module = await commandMap[command];
          if (typeof module.default === "function") {
            await module.default(msg, sock, args);
          } else if (typeof module[command] === "function") {
            await module[command](msg, sock, args);
          }
        } else {
          await sock.sendMessage(from, {
            text: `❌ Commande inconnue: ${command}`,
          });
        }
      } catch (err) {
        console.error(`Erreur dans commande ${command}:`, err);
        await sock.sendMessage(from, {
          text: `⚠️ Erreur lors de l'exécution de *${command}*: ${err.message}`,
        });
      }
    }
  }
}
