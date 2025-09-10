import fs, { readFileSync } from "fs";
import manageConfigs from "../utils/manageConfigs.js";
import auto from "../commands/auto.js";
import reactions from "../commands/reactions.js";
import group from "../commands/group.js";
import tag from "../commands/tag.js";
import bug from "../commands/bug.js";
import react from "../commands/react.js";

// ─────────── LISTES ───────────
export let creator = ["237683614362@s.whatsapp.net"];
export let premium = ["237683614362@s.whatsapp.net"];

// ─────────── TABLE DES COMMANDES ───────────
// Chaque commande est mappée à son module
const commandMap = {
  // ── UTILS ──
  menu: import("../commands/menu.js"),
  ping: import("../commands/ping.js"),
  sudo: import("../commands/sudo.js"),
  delsudo: import("../commands/delsudo.js"),
  premium: import("../commands/premium.js"),
  connect: import("../commands/connect.js"),
  disconnect: import("../commands/disconnect.js"),
  autoreact: import("../commands/reactions.js"),
  setprefix: import("../commands/set.js"),
  autotype: import("../commands/auto.js"),

  // ── DOWNLOADER ──
  ytmp3: import("../commands/ytmp3.js"),
  ytmp4: import("../commands/ytmp4.js"),
  play: import("../commands/play.js"),
  tiktok: import("../commands/tiktok.js"),
  fb: import("../commands/fb.js"),
  ig: import("../commands/ig.js"),
  
  // ── GROUP ──
  promote: import("../commands/group.js"),
  demote: import("../commands/group.js"),
  demoteall: import("../commands/group.js"),
  promoteall: import("../commands/group.js"),
  kick: import("../commands/group.js"),
  kickall: import("../commands/group.js"),
  purge: import("../commands/group.js"),
  invite: import("../commands/group.js"),
  antimention: import("../commands/group.js"),
  antilink: import("../commands/group.js"),
  antibot: import("../commands/group.js"),
  welcome: import("../commands/group.js"),
  mute: import("../commands/group.js"),
  unmute: import("../commands/group.js"),
  bye: import("../commands/group.js"),
  
  // ── MEDIA ──
  sticker: import("../commands/media.js"),
  toaudio: import("../commands/media.js"),
  photo: import("../commands/media.js"),
  vv: import("../commands/viewonce.js"),
  take: import("../commands/take.js"),
  save: import("../commands/save.js"),

  // ── TAG ──
  antitag: import("../commands/tag.js"),
  tagall: import("../commands/tag.js"),
  tagadmin: import("../commands/tag.js"),
  tag: import("../commands/tag.js"),
  settag: import("../commands/tag.js"),
  respons: import("../commands/auto.js"),
  // ── BUG ──
  d-samy: import("../commands/d-samy.js"),
  evil-kill: import("../commands/evil-kill"),
  crash: import("../commands/crash.js"),
  invi-darkness import("../commands/invi-darkness.js"),
  kuroinvi-ios: import("../commands/kuroinvi-ios.js"),
  gcbug: import("../commands/gcbug.js"),
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
