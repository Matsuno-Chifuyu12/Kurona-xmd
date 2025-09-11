//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
// Auto-React Module
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import configManager from '../utils/manageConfigs.js';

// 📌 Fonction d'auto-réaction
export async function reaction(msg, sock, emoji, autoreact) {
    if (!autoreact || !emoji || !msg?.key?.remoteJid) return;
    
    try {
        await sock.sendMessage(msg.key.remoteJid, {
            react: { text: emoji, key: msg.key }
        });
    } catch (error) {
        console.error("Auto-react failed:", error);
    }
}

// 📌 Commande : !autoreact on/off
export async function autoreact(message, client) {
    const number = client.user?.id?.split(':')[0];
    const remoteJid = message.key?.remoteJid;
    
    if (!remoteJid || !number) return;

    const messageBody = message.message?.extendedTextMessage?.text || 
                       message.message?.conversation || '';
    
    const args = messageBody.slice(1).trim().split(/\s+/);
    const input = args[1]?.toLowerCase();

    // Vérification de la commande
    if (!input || !['on', 'off'].includes(input)) {
        return client.sendMessage(remoteJid, { 
            text: "Usage: !autoreact on/off"
        });
    }

    try {
        // Initialisation utilisateur si absent
        configManager.config.users[number] = configManager.config.users[number] || {};
        
        // Activation/désactivation
        configManager.config.users[number].autoreact = input === 'on';
        await configManager.save();

        // Confirmation
        await client.sendMessage(remoteJid, {
            text: `Auto-react ${input.toUpperCase()}`
        });
    } catch (error) {
        await client.sendMessage(remoteJid, {
            text: `❌ Error: ${error.message}`
        });
    }
}

export default { reaction, autoreact };
