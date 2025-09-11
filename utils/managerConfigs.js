//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
// 📂 Config Manager (VERSION STABLE)
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
        } else {
            console.warn("⚠️ Aucun config.json trouvé, création par défaut...");
            saveConfigSync(defaultConfig);
            return { ...defaultConfig };
        }
    } catch (err) {
        console.error("⚠️ Erreur chargement config:", err);
        return { ...defaultConfig };
    }
}

async function saveConfig(config) {
    try {
        const tempPath = CONFIG_PATH + ".tmp";
        await fsp.writeFile(tempPath, JSON.stringify(config, null, 2), "utf8");

        try {
            await fsp.rename(tempPath, CONFIG_PATH);
        } catch (err) {
            console.warn("⚠️ Rename échoué, tentative écriture directe...");
            await fsp.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), "utf8");
        }
    } catch (err) {
        console.error("❌ Erreur sauvegarde config:", err);
        throw err;
    }
}

// Sauvegarde synchrone (fallback pour init)
function saveConfigSync(config) {
    try {
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf8");
    } catch (err) {
        console.error("❌ Erreur saveConfigSync:", err);
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
        await saveConfig(this.config);
        console.log("💾 Configuration sauvegardée.");
    },

    getUser,
    updateUser,
    removeUser,
    ensureUser,

    reload() {
        this.config = loadConfig();
        console.log("♻️ Configuration rechargée.");
        return this.config;
    },

    reset() {
        this.config = { ...defaultConfig };
        console.log("🗿 Configuration réinitialisée.");
        return this.save();
    },
};

//━━━━━━━━━━━━━━━━━━━━━━━
// 💾 Sauvegarde Auto Exit
//━━━━━━━━━━━━━━━━━━━━━━━
process.on("SIGINT", async () => {
    console.log("🛑 Sauvegarde config avant arrêt...");
    try {
        await configManager.save();
        process.exit(0);
    } catch (err) {
        console.error("❌ Erreur sauvegarde en sortie:", err);
        process.exit(1);
    }
});

export default configManager;
