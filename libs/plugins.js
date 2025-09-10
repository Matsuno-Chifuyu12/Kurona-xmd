import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Logger } from "./logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pluginsDir = path.resolve(__dirname, "../plugins");

export const Plugins = {
  loaded: {},

  // Charger tous les plugins
  loadAll: async () => {
    if (!fs.existsSync(pluginsDir)) fs.mkdirSync(pluginsDir);

    const files = fs.readdirSync(pluginsDir).filter(f => f.endsWith(".js"));
    for (const file of files) {
      await Plugins.load(file);
    }
    Logger.info(`[PLUGINS] ${files.length} plugins chargés`);
  },

  // Charger un plugin spécifique
  load: async (file) => {
    try {
      const pluginPath = path.resolve(pluginsDir, file);
      const module = await import(`file://${pluginPath}?update=${Date.now()}`);
      Plugins.loaded[file] = module.default || module;
      Logger.info(`[PLUGIN] ${file} chargé`);
    } catch (err) {
      Logger.error(`[PLUGIN] Erreur lors du chargement de ${file} → ${err.message}`);
    }
  },

  // Recharger un plugin
  reload: async (file) => {
    delete Plugins.loaded[file];
    await Plugins.load(file);
  },

  // Exécuter une commande
  run: async (command, context) => {
    for (const [name, plugin] of Object.entries(Plugins.loaded)) {
      if (plugin.command === command || (plugin.aliases && plugin.aliases.includes(command))) {
        try {
          await plugin.run(context);
          return true;
        } catch (err) {
          Logger.error(`[PLUGIN] Erreur exécution ${command} → ${err.message}`);
          return false;
        }
      }
    }
    return false; // commande inconnue
  },
};
