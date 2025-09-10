//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴
// Commande : disconnect.js
// Supprime une session active
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import fs from 'fs';
import path from 'path';
import sender from '../commands/Sender.js';

const BOT_NAME = "🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴";

async function disconnect(message, client) {
    const remoteJid = message.key?.remoteJid;
    if (!remoteJid) throw new Error(`[${BOT_NAME}] Message JID is undefined.`);

    const messageBody =
        message.message?.extendedTextMessage?.text ||
        message.message?.conversation ||
        '';

    const commandAndArgs = messageBody.slice(1).trim();
    const parts = commandAndArgs.split(/\s+/);
    const args = parts.slice(1);

    let participant;

    // Si c’est une réponse à un message
    if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
        participant = message.message.extendedTextMessage.contextInfo.participant;
    } else if (args.length > 0) {
        participant = args[0];
    } else {
        sender(message, client, `❌ [${BOT_NAME}] Spécifie le numéro à déconnecter.`);
        return;
    }

    participant = participant.replace('@s.whatsapp.net', '').trim();
    const sessionPath = path.join(`./sessions/${participant}`);

    if (fs.existsSync(sessionPath)) {
        try {
            fs.rmSync(sessionPath, { recursive: true, force: true });
            sender(message, client, `✅ [${BOT_NAME}] Auth pour ${participant} supprimée avec succès.`);
            console.log(`[${BOT_NAME}] ✅ Session ${participant} supprimée.`);
        } catch (error) {
            sender(message, client, `❌ [${BOT_NAME}] Erreur lors de la suppression pour ${participant}.`);
            console.error(`[${BOT_NAME}] ❌ Error deleting session for ${participant}:`, error);
        }
    } else {
        sender(message, client, `❌ [${BOT_NAME}] Aucune session trouvée pour ${participant}.`);
        console.log(`[${BOT_NAME}] ⚠️ Aucune session trouvée pour ${participant}`);
    }
}

export default disconnect;