import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const settingsPath = path.resolve(__dirname, "../config/settings.js");

// Charge dynamiquement la config
export async function loadConfig() {
  try {
    const { botSettings, users, autoFeatures, groupSettings } = await import(settingsPath);
    return {
      botSettings,
      users,
      autoFeatures,
      groupSettings,
    };
  } catch (err) {
    console.error("[CONFIG] Impossible de charger settings.js :", err);
    process.exit(1);
  }
}