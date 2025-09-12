// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
// Adapted for Baileys 7.x (PAIRING CODE ONLY)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import connectToWhatsApp from "./auth/authHandler.js";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VARS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const REPO_URL = "https://github.com/Matsuno-chifuyu12/kurona-xmd"; 
const TEMP_DIR = path.join(process.cwd(), ".temp_bot_update");

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FS HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function copyRecursive(src, dest) {
    if (!fs.existsSync(src)) return;
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        if (["sessions.json","config.json","creds.json","prem.json","sessions","config.js",".git"].includes(entry.name)) continue;
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            if (!fs.existsSync(destPath)) fs.mkdirSync(destPath, { recursive: true });
            copyRecursive(srcPath, destPath);
        } else fs.copyFileSync(srcPath, destPath);
    }
}

function syncRepo() {
    try {
        if (fs.existsSync(TEMP_DIR)) {
            console.log("🔄 Updating...");
            execSync(`git -C ${TEMP_DIR} pull`, { stdio: "inherit" });
        } else {
            console.log("📥 Cloning...");
            execSync(`git clone ${REPO_URL} ${TEMP_DIR}`, { stdio: "inherit" });
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
    syncRepo();

    console.log("🔁 Copying new files...");
    copyRecursive(TEMP_DIR, process.cwd());
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });

    // 🔥 Lancement du handler principal
    connectToWhatsApp((sock, msg) => {
        console.log("📨 Nouveau message reçu :", msg.key.remoteJid);
    });
})();
