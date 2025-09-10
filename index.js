// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
//  The Ultimate WhatsApp Experience
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import fs from "fs";
import path from "path";
import { execSync, spawn } from "child_process";
import pino from "pino";
import NodeCache from "node-cache";
import qrcode from "qrcode-terminal";
import {
  useMultiFileAuthState,
  makeWASocket,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  isJidNewsletter
} from "@whiskeysockets/baileys";
import { parseCommand, handleCommand } from "./commande.js";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONFIGS DE BASE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const OWNER = "🎴 𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴";
const PREFIX = ".";
const VERSION = "v1.0.0";
const AUTH_FOLDER = "auth_baileys";
const REPO_URL = "https://github.com/Matsuno-chifuyu12/kurona-xmd";

const cacheDecrypt = new NodeCache();
let reconnectAttempts = 0;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MISE A JOUR AUTO DU CODE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const tempCloneDir = path.join(process.cwd(), ".temp_bot_update");
function syncRepo() {
  try {
    if (fs.existsSync(tempCloneDir)) {
      console.log("🔄 Pulling latest code...");
      execSync(`git -C ${tempCloneDir} pull`, { stdio: "inherit" });
    } else {
      console.log("📥 Cloning remote bot...");
      execSync(`git clone ${REPO_URL} ${tempCloneDir}`, { stdio: "inherit" });
    }
  } catch (err) {
    console.error("❌ Git sync failed:", err);
    process.exit(1);
  }
}

function copyFolderContents(src, dest) {
  if (!fs.existsSync(src)) return;
  const files = fs.readdirSync(src, { withFileTypes: true });
  for (const file of files) {
    if (["sessions.json", "config.json", "creds.json", "prem.json", "sessions", "config.js", ".git"].includes(file.name)) continue;
    const srcPath = path.join(src, file.name);
    const destPath = path.join(dest, file.name);
    if (file.isDirectory()) {
      if (!fs.existsSync(destPath)) fs.mkdirSync(destPath, { recursive: true });
      copyFolderContents(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DEMARRAGE DU BOT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function startBot() {
  try {
    const { version } = await fetchLatestBaileysVersion();
    console.log(`🔄 Utilisation de Baileys v${version.join(".")}`);

    const { state, saveCreds } = await useMultiFileAuthState(AUTH_FOLDER);

    const sock = makeWASocket({
      version,
      logger: pino({ level: "warn" }),
      printQRInTerminal: false,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" }))
      },
      msgRetryCounterCache: cacheDecrypt,
      syncFullHistory: false,
      generateHighQualityLinkPreview: true
    });

    // Sauvegarde des creds
    sock.ev.on("creds.update", saveCreds);

    // Gestion des connexions
    sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
      if (qr) {
        console.log("\n📲 Veuillez scanner ce QR dans WhatsApp mobile :");
        qrcode.generate(qr, { small: true });
      }
      if (connection === "open") {
        reconnectAttempts = 0;
        console.log("✅ Connexion WebSocket établie !");
      }
      if (connection === "close") {
        const code =
          lastDisconnect?.error?.output?.statusCode ||
          lastDisconnect?.error?.statusCode;
        const loggedOut = code === DisconnectReason.loggedOut;
        console.warn("⚠️ Déconnecté :", DisconnectReason[code] || code);

        if (!loggedOut) {
          const delay = Math.min(60000, 2 ** reconnectAttempts * 1000);
          reconnectAttempts++;
          console.log(`↻ Nouvelle tentative dans ${delay} ms…`);
          setTimeout(startBot, delay);
        } else {
          console.error(
            "🔒 Session invalidée (logged out). Supprimez le dossier auth_baileys et relancez : node index.js"
          );
        }
      }
    });

    // Gestion des messages
    sock.ev.on("messages.upsert", async ({ messages, type }) => {
      if (type !== "notify") return;
      for (const msg of messages) {
        try {
          const body =
            msg.message?.conversation ||
            msg.message?.extendedTextMessage?.text;
          if (!body) continue;

          const jid = msg.key.remoteJid;
          if (isJidNewsletter(jid)) continue;
          if (!body.startsWith(PREFIX)) continue;

          const { command, args } = parseCommand(body);
          if (command) {
            await handleCommand(
              sock,
              msg,
              jid,
              command,
              args,
              jid.includes("@g.us")
            );
          }
        } catch (err) {
          console.error("💥 Erreur traitement message :", err);
        }
      }
    });
  } catch (err) {
    console.error("🎴 Erreur fatale au démarrage :", err);
    process.exit(1);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXECUTION PRINCIPALE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
(async () => {
  console.log("⚠️ Vérification des mises à jour...");
  syncRepo();
  console.log("🔁 Copie des fichiers mis à jour...");
  copyFolderContents(tempCloneDir, process.cwd());
  fs.rmSync(tempCloneDir, { recursive: true, force: true });

  // Lance le bot
  startBot();
})();