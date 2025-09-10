//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
// 📂 Config Manager
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import fs from "fs";
import fsp from "fs/promises";
import path from "path";

const CONFIG_PATH = path.resolve("config.json");

// ⚙️ Structure par défaut
const defaultConfig = {
    bot: {
        name: "🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴",
        version: "1.0.0",
        mode: "public",
        owner: "🎴 𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴",
        prefix: ".",
    },
    users: {},
};

//━━━━━━━━━━━━━━━━━━━━━━━
// 📂 Gestion Fichier
//━━━━━━━━━━━━━━━━━━━━━━━
function loadConfig() {
    try {
        if (fs.existsSync(CONFIG_PATH)) {
            const data = fs.readFileSync(CONFIG_PATH, "utf8");
            return JSON.parse(data);
        }
        return { ...defaultConfig };
    } catch (err) {
        console.error("⚠️ [🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴] Erreur chargement config:", err);
        return { ...defaultConfig };
    }
}

async function saveConfig(config) {
    try {
        const tempPath = CONFIG_PATH + ".tmp";
        await fsp.writeFile(tempPath, JSON.stringify(config, null, 2), "utf8");
        await fsp.rename(tempPath, CONFIG_PATH);
    } catch (err) {
        console.error("⚠️ [🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴] Erreur sauvegarde config:", err);
        throw err;
    }
}

//━━━━━━━━━━━━━━━━━━━━━━━
// 👤 Gestion Utilisateurs
//━━━━━━━━━━━━━━━━━━━━━━━
function ensureUser(userId) {
    if (!configManager.config.users[userId]) {
        configManager.config.users[userId] = {
            sudoList: [],
            prefix: configManager.config.bot.prefix,
            antilink: false,
            response: true,
            autoreact: false,
            autotype: false,
            welcome: false,
            antibot: false,
            record: false,
            like: false,
            online: false,
            tagAudioPath: "./assets/audio/tag.mp3",
        };
    }
    return configManager.config.users[userId];
}

function getUser(userId) {
    return configManager.config.users[userId] || ensureUser(userId);
}

function updateUser(userId, updates) {
    const user = ensureUser(userId);
    configManager.config.users[userId] = {
        ...user,
        ...updates,
    };
    return configManager.save();
}

function removeUser(userId) {
    if (configManager.config.users[userId]) {
        delete configManager.config.users[userId];
        return configManager.save();
    }
    return Promise.resolve();
}

//━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 Config Manager
//━━━━━━━━━━━━━━━━━━━━━━━
let config = loadConfig();

const configManager = {
    config,

    async save() {
        try {
            await saveConfig(this.config);
            console.log("💾 [🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴] Configuration sauvegardée.");
        } catch (err) {
            console.error("⚠️ [🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴] Erreur configManager.save:", err);
            throw err;
        }
    },

    getUser,
    updateUser,
    removeUser,
    ensureUser,

    reload() {
        this.config = loadConfig();
        console.log("♻️ [🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴] Configuration rechargée.");
        return this.config;
    },

    reset() {
        this.config = { ...defaultConfig };
        console.log("🌀 [🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴] Configuration réinitialisée.");
        return this.save();
    },
};

//━━━━━━━━━━━━━━━━━━━━━━━
// 💾 Sauvegarde Auto Exit
//━━━━━━━━━━━━━━━━━━━━━━━
process.on("SIGINT", async () => {
    console.log("🛑 [🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴] Sauvegarde config avant arrêt...");
    try {
        await configManager.save();
        process.exit(0);
    } catch (err) {
        console.error("❌ [🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴] Erreur sauvegarde en sortie:", err);
        process.exit(1);
    }
});

export default configManager;