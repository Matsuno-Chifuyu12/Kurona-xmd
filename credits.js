// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
//  Gestion des crédits
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import fetch from "global fetch"; //
import dayjs from "dayjs"; // pour formater la date facilement

const API_CREDITS = "https://raw.githubusercontent.com/Matsuno-Chifuyu12/kurona-xmd/refs/heads/main/credits.json";

// Cache interne pour éviter de re-fetch inutilement
let credsCache = null;

/**
 * Récupère les crédits depuis le dépôt GitHub ou cache
 * @returns {Promise<Object|null>} JSON des crédits
 */
export async function getCreds() {
  if (credsCache) return credsCache;

  try {
    const res = await fetch(API_CREDITS);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    credsCache = data;
    return data;
  } catch (err) {
    console.error("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ Erreur lors du fetch des crédits :\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯", err.message);
    return null;
  }
}