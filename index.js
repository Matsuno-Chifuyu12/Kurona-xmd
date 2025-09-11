// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ //
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴 //
// The Ultimate WhatsApp Experience //
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ //

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import pino from "pino";
import NodeCache from "node-cache";
import { 
    useMultiFileAuthState, 
    makeWASocket, 
    DisconnectReason, 
    fetchLatestBaileysVersion, 
    makeCacheableSignalKeyStore
} from "@whiskeysockets/baileys";

// Configuration intégrée directement (remplace l'import manquant)
const configManager = {
    config: {
        bot: {
            name: "KURONA - XMD",
            version: "1.0.0",
            mode: "public",
            prefix: "."
        }
    }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ //
// CONFIGS DE BASE //
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ //
const OWNER = "🎴 𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴";
const PREFIX = ".";
const VERSION = "1.0.0";
const AUTH_FOLDER = "auth_baileys";
const REPO_URL = "https://github.com/Matsuno-chifuyu12/kurona-xmd";

const cacheDecrypt = new NodeCache();
let reconnectAttempts = 0;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ //
// MISE A JOUR AUTO DU CODE //
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ //
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
        if (["sessions.json", "config.json", "creds.json", "prem.json", "sessions", "config.js", ".git"].includes(file.name)) 
            continue;
        
        const srcPath = path.join(src, file.name);
        const destPath = path.join(dest, file.name);
        
        if (file.isDirectory()) {
            if (!fs.existsSync(destPath)) 
                fs.mkdirSync(destPath, { recursive: true });
            copyFolderContents(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ //
// GESTIONNAIRE DE MESSAGES //
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ //
async function handleMessage(update) {
    try {
        if (update.messages) {
            for (const message of update.messages) {
                if (message.key && message.key.remoteJid && message.message) {
                    console.log("📨 Message reçu:", message.key.remoteJid);
                    // Ici vous ajouterez votre logique de traitement des messages
                }
            }
        }
    } catch (error) {
        console.error("❌ Erreur dans handleMessage:", error);
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ //
// DEMARRAGE DU BOT //
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ //
async function startBot() {
    try {
        const { version } = await fetchLatestBaileysVersion();
        console.log(`🔄 Utilisation de Baileys v${version.join(".")}`);

        // Affichage des informations de configuration
        console.log(`🤖 Bot: ${configManager.config.bot.name}`);
        console.log(`📍 Version: ${configManager.config.bot.version}`);
        console.log(`📍 Mode: ${configManager.config.bot.mode}`);
        console.log(`📍 Prefix: ${configManager.config.bot.prefix}`);

        // Note: La fonction connectToWhatsApp doit être définie dans authHandler.js
        // Si ce fichier n'existe pas non plus, vous aurez une autre erreur
        console.log("⚠️ Tentative de connexion à WhatsApp...");
        
        // Solution temporaire si authHandler.js n'existe pas encore
        try {
            // Essayez d'importer authHandler
            const { connectToWhatsApp } = await import("./auth/authHandler.js");
            await connectToWhatsApp(handleMessage);
        } catch (authError) {
            console.error("❌ Erreur lors de l'import de authHandler:", authError);
            console.log("🔄 Création d'une connexion de base...");
            
            // Création d'une connexion basique de secours
            const { state, saveCreds } = await useMultiFileAuthState(AUTH_FOLDER);
            const sock = makeWASocket({
                version: (await fetchLatestBaileysVersion()).version,
                printQRInTerminal: true,
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" })),
                },
            });
            
            sock.ev.on("connection.update", (update) => {
                const { connection, lastDisconnect } = update;
                if (connection === "close") {
                    const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
                    console.log(shouldReconnect ? "🔄 Reconnexion..." : "❌ Déconnecté");
                    if (shouldReconnect) {
                        startBot();
                    }
                } else if (connection === "open") {
                    console.log("✅ Connecté à WhatsApp!");
                }
            });
            
            sock.ev.on("creds.update", saveCreds);
            sock.ev.on("messages.upsert", handleMessage);
        }

    } catch (err) {
        console.error("🎴 Erreur fatale au démarrage :", err);
        process.exit(1);
    }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ //
// EXECUTION PRINCIPALE //
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ //
(async () => {
    console.log("⚠️ Vérification des mises à jour...");
    syncRepo();
    console.log("🔁 Copie des fichiers mis à jour...");
    copyFolderContents(tempCloneDir, process.cwd());
    
    // Nettoyage du dossier temporaire
    if (fs.existsSync(tempCloneDir)) {
        fs.rmSync(tempCloneDir, { recursive: true, force: true });
    }

    // Lance le bot
    startBot();
})();
