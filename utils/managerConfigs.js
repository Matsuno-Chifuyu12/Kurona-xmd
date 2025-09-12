import fs from "fs";
import fsp from "fs/promises";
import path from "path";

const CONFIG_PATH = path.resolve("config.json");

const defaultConfig = {
  bot: { name:"🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴", version:"1.0.0", mode:"public", owner:"🎴 𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴", prefix:"." },
  users: {},
};

function loadConfig() {
  if (fs.existsSync(CONFIG_PATH)) {
    try { return JSON.parse(fs.readFileSync(CONFIG_PATH,"utf8")); } 
    catch { console.warn("⚠️ config.json illisible, réinitialisation..."); return {...defaultConfig}; }
  } else { fs.writeFileSync(CONFIG_PATH, JSON.stringify(defaultConfig,null,2)); return {...defaultConfig}; }
}

async function saveConfig(config) {
  try {
    const tmp = CONFIG_PATH+".tmp";
    await fsp.writeFile(tmp, JSON.stringify(config,null,2), "utf8");
    await fsp.rename(tmp, CONFIG_PATH);
  } catch (err) { console.error("❌ Erreur sauvegarde config:", err); throw err; }
}

const configManager = {
  config: loadConfig(),

  async save() { await saveConfig(this.config); console.log("💾 Configuration sauvegardée."); },

  getUser(userId) {
    if (!this.config.users[userId]) return this.ensureUser(userId);
    return this.config.users[userId];
  },

  ensureUser(userId) {
    if (!this.config.users[userId]) this.config.users[userId] = {
      sudoList:[], prefix:this.config.bot.prefix, antilink:false, response:true,
      autoreact:false, autotype:false, welcome:false, antibot:false, record:false, like:false,
      tagAudioPath:"./assets/audio/tag.mp3"
    };
    return this.config.users[userId];
  },

  updateUser(userId, updates) {
    const user = this.ensureUser(userId);
    this.config.users[userId] = {...user,...updates};
    return this.save();
  },

  removeUser(userId) {
    if (this.config.users[userId]) { delete this.config.users[userId]; return this.save(); }
    return Promise.resolve();
  },

  reload() { this.config = loadConfig(); console.log("♻️ Config rechargée."); return this.config; },
  reset() { this.config = {...defaultConfig}; console.log("🗿 Config réinitialisée."); return this.save(); },
};

// Auto-save on exit
process.on("SIGINT", async () => { console.log("🛑 Sauvegarde config avant arrêt..."); await configManager.save(); process.exit(0); });

export default configManager;
