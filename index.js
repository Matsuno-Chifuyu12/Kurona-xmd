// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
//  Adapted for Baileys 7.x (PAIRING CODE ONLY)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import f from "fs";
import p from "path";
import { execSync as eS } from "child_process";
import { 
  makeWASocket, 
  useMultiFileAuthState, 
  makeCacheableSignalKeyStore, 
  DisconnectReason, 
  fetchLatestBaileysVersion 
} from "@whiskeysockets/baileys";
import Pino from "pino";

// Gestion d'erreur pour l'importation de configManager
let configManager;
try {
  configManager = (await import("./utils/managerConfigs.js")).default;
} catch (e) {
  console.log("⚠️ Using default configuration");
  configManager = { config: { bot: { name: "Kurona-XMD", version: "1.0.0" } } };
}

import connectToWhatsApp from "./auth/authHandler.js";  

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VARS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const _s = (x) => Buffer.from(x, "base64").toString("utf8");
const R = _s("aHR0cHM6Ly9naXRodWIuY29tL01hdHN1bm8tY2hpZnV5dTEyL2t1cm9uYS14bWQ="); 
const T = p.join(process.cwd(), _s("LnRlbXBfYm90X3VwZGF0ZQ==")); // ".temp_bot_update"
const AUTH_FOLDER = p.join(process.cwd(), "auth_baileys"); // Chemin absolu
let reconnectAttempts = 0;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FS HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function C(S, D) {
  if (!f.existsSync(S)) return;
  const E = f.readdirSync(S, { withFileTypes: true });
  for (const I of E) {
    if (["sessions.json", "config.json", "creds.json", "prem.json", "sessions", "config.js", ".git"].includes(I.name)) continue;
    const sPth = p.join(S, I.name), dPth = p.join(D, I.name);
    if (I.isDirectory()) {
      if (!f.existsSync(dPth)) f.mkdirSync(dPth, { recursive: true });
      C(sPth, dPth);
    } else f.copyFileSync(sPth, dPth);
  }
}

function S() {
  try {
    if (f.existsSync(T)) {
      console.log("🔄 Updating...");
      eS(`git -C ${T} pull`, { stdio: "inherit" });
    } else {
      console.log("📥 Cloning...");
      eS(`git clone ${R} ${T}`, { stdio: "inherit" });
    }
  } catch (err) {
    console.error("❌ Git sync failed:", err);
    process.exit(1);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
(async () => {
  console.log("⚠️  Syncing bot code...");
  S();
  console.log("🔁 Copying new files...");
  C(T, process.cwd());
  f.rmSync(T, { recursive: true, force: true });

  // 🔥 Ici on lance directement ton handler d'authentification
  connectToWhatsApp((sock, msg) => {
    console.log("📨 Nouveau message reçu :", msg.key.remoteJid);
  });
})();
