import crypto from "crypto";
import moment from "moment-timezone";
import { botSettings } from "../config/settings.js";

export const Utils = {
  // Générer un ID unique
  uid: (len = 8) => crypto.randomBytes(len).toString("hex"),

  // Mise en forme du temps
  now: (format = "DD/MM/YYYY HH:mm:ss") =>
    moment().tz(botSettings.timezone).format(format),

  // Convertir secondes → HH:MM:SS
  toTime: (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map(v => String(v).padStart(2, "0")).join(":");
  },

  // Pause async
  sleep: (ms) => new Promise(res => setTimeout(res, ms)),

  // Vérifier si texte = URL
  isUrl: (str) => /https?:\/\/[^\s]+/i.test(str),

  // Format taille fichier
  formatBytes: (bytes, decimals = 2) => {
    if (!+bytes) return "0 Bytes";
    const k = 1024,
      sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
  },
};
