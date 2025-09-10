//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
// main.js — Point d’entrée du bot
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import connectToWhatsApp from './auth/authHandler.js';
import handleIncomingMessage from './events/messageHandler.js';
import reconnect from './events/reconnection.js';
import { loadPlugins } from './libs/plugins.js';
import logger from './libs/logger.js';

(async () => {
    try {
        logger.info("🎴 Initialisation du bot 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫...");

        // Chargement dynamique des plugins/commandes
        await loadPlugins();
        logger.success("📂 Commandes et plugins chargés avec succès.");

        // Connexion à WhatsApp
        const client = await connectToWhatsApp(handleIncomingMessage);
        logger.success("✅ Connecté à WhatsApp via Baileys.");

        // Gestion de la reconnexion automatique
        await reconnect(client);

        // Message de bienvenue dans la console
        console.log(`
╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
┃          🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
┃    The Ultimate WhatsApp Experience
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯

╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
┃ ❃ 𝗠𝗼𝗱𝗲   : Public
┃ ❃ 𝗢𝘄𝗻𝗲𝗿 : 🎴 𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥 🎴
┃ ❃ 𝗣𝗿𝗲𝗳𝗶𝘅 : [ . ]
┃ ❃ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻 : v1.0.0
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯

🎴 Bot lancé avec succès ! 🎴
        `);

    } 
})();