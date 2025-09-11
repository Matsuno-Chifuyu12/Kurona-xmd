//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
// MessageHandler.js
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import fs, { readFileSync } from "fs";
import managerConfigs from "../utils/managerConfigs.js";
import auto from "../tools/auto.js";
import reactions from "../tools/reactions.js";
import group from "../tools/group.js";
import tag from "../tools/tag.js";
import bug from "../tools/bug-menu.js"; 
import react from "../tools/react.js";

// ─────────── LISTES ───────────
export let creator = ["237683614362@s.whatsapp.net"];
export let premium = ["237683614362@s.whatsapp.net"];

// ─────────── TABLE DES COMMANDES ───────────
const commandMap = {
  // ── UTILS ──
  menu: { module: "../tools/menu.js", func: "default" },
  ping: { module: "../tools/ping.js", func: "default" },
  sudo: { module: "../tools/sudo.js", func: "default" },
  delsudo: { module: "../tools/delsudo.js", func: "default" },
  premium: { module: "../tools/premium.js", func: "default" },
  connect: { module: "../tools/connect.js", func: "default" },
  disconnect: { module: "../tools/disconnect.js", func: "default" },
  autoreact: { module: "../tools/reactions.js", func: "default" },
  setprefix: { module: "../tools/set.js", func: "default" },
  autotype: { module: "../tools/auto.js", func: "default" },

  // ── DOWNLOADER ──
  ytmp3: { module: "../tools/ytmp3.js", func: "default" },
  ytmp4: { module: "../tools/ytmp4.js", func: "default" },
  play: { module: "../tools/play.js", func: "default" },
  tiktok: { module: "../tools/tiktok.js", func: "default" },
  fb: { module: "../tools/fb.js", func: "default" },
  ig: { module: "../tools/ig.js", func: "default" },
  
  // ── GROUP ──
  promote: { module: "../tools/group.js", func: "promote" },
  demote: { module: "../tools/group.js", func: "demote" },
  demoteall: { module: "../tools/group.js", func: "demoteall" },
  promoteall: { module: "../tools/group.js", func: "promoteall" },
  kick: { module: "../tools/group.js", func: "kick" },
  kickall: { module: "../tools/group.js", func: "kickall" },
  purge: { module: "../tools/group.js", func: "purge" },
  invite: { module: "../tools/group.js", func: "invite" },
  antimention: { module: "../tools/group.js", func: "antimention" },
  antilink: { module: "../tools/group.js", func: "antilink" },
  antibot: { module: "../tools/group.js", func: "antibot" },
  welcome: { module: "../tools/group.js", func: "welcome" },
  mute: { module: "../tools/group.js", func: "mute" },
  unmute: { module: "../tools/group.js", func: "unmute" },
  bye: { module: "../tools/group.js", func: "bye" },
  
  // ── MEDIA ──
  sticker: { module: "../tools/media.js", func: "sticker" },
  toaudio: { module: "../tools/media.js", func: "toaudio" },
  photo: { module: "../tools/media.js", func: "photo" },
  vv: { module: "../tools/viewonce.js", func: "default" },
  take: { module: "../tools/take.js", func: "default" },
  save: { module: "../tools/save.js", func: "default" },

  // ── TAG ──
  antitag: { module: "../tools/tag.js", func: "antitag" },
  tagall: { module: "../tools/tag.js", func: "tagall" },
  tagadmin: { module: "../tools/tag.js", func: "tagadmin" },
  tag: { module: "../tools/tag.js", func: "tag" },
  settag: { module: "../tools/tag.js", func: "settag" },
  respons: { module: "../tools/auto.js", func: "respons" },
  
  // ── BUG ──
  "d-samy": { module: "../tools/d-samy.js", func: "default" },
  "evil-kill": { module: "../tools/evil-kill.js", func: "default" },
  crash: { module: "../tools/crash.js", func: "default" },
  "invi-darkness": { module: "../tools/invi-darkness.js", func: "default" },
  "kuroinvi-ios": { module: "../tools/kuroinvi-ios.js", func: "default" },
  gcbug: { module: "../tools/gcbug.js", func: "default" },
};

// Cache pour les modules
const moduleCache = new Map();

async function loadModule(modulePath) {
  if (moduleCache.has(modulePath)) {
    return moduleCache.get(modulePath);
  }
  
  try {
    const module = await import(modulePath);
    moduleCache.set(modulePath, module);
    return module;
  } catch (error) {
    console.error(`Erreur chargement module ${modulePath}:`, error);
    throw error;
  }
}

// ─────────── HANDLE MESSAGES ───────────
export async function handleIncomingMessage(sock, m) {
  if (!m?.messages?.length) return;
  
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
  const messages = m.messages;
  const prefix = manageConfigs.config?.users[userId]?.prefix || ".";

  for (const msg of messages) {
    const textMsg =
      msg.message?.extendedTextMessage?.text ||
      msg.message?.conversation ||
      "";

    const from = msg.key.remoteJid;
    const sender = msg.key.participant ? msg.key.participant.split("@")[0] : msg.key.remoteJid.split("@")[0];

    if (!textMsg || !from) continue;

    try {
      // Fonctions automatiques
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

      // Vérification préfixe commande
      if (
        textMsg.toLowerCase().startsWith(prefix) &&
        (msg.key.fromMe ||
          premium.includes(sender + "@s.whatsapp.net") ||
          me.includes(from))
      ) {
        const args = textMsg.slice(prefix.length).trim().split(/\s+/);
        const command = args.shift().toLowerCase();

        if (commandMap[command]) {
          try {
            await react(msg, sock);
            const { module: modulePath, func: functionName } = commandMap[command];
            const module = await loadModule(modulePath);
            
            const commandFunction = functionName === "default" ? module.default : module[functionName];
            
            if (typeof commandFunction === "function") {
              await commandFunction(msg, sock, args);
            } else {
              throw new Error(`Fonction ${functionName} introuvable`);
            }
          } catch (err) {
            console.error(`Erreur commande ${command}:`, err);
            await sock.sendMessage(from, {
              text: `⚠️ Erreur avec *${command}*: ${err.message}`,
            });
          }
        } else {
          await sock.sendMessage(from, {
            text: `❌ Commande inconnue: ${command}`,
          });
        }
      }
    } catch (error) {
      console.error("Erreur traitement message:", error);
    }
  }
        }
