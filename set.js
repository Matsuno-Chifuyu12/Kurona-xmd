//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴
// The Ultimate WhatsApp Experience
// Commande : set.js
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import configManager from '../../utils/manageConfigs.js';
import bug from '../bug-menu.js';

// Vérif Emoji
function isEmoji(str) {
    const emojiRegex = /^(?:\p{Emoji_Presentation}|\p{Extended_Pictographic})$/u;
    return emojiRegex.test(str);
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔹 SET PREFIX
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function setprefix(message, client) {
    const number = client.user.id.split(':')[0];
    try {
        const remoteJid = message.key?.remoteJid;
        if (!remoteJid) throw new Error("Message JID is undefined.");

        const msgBody = message.message?.extendedTextMessage?.text || message.message?.conversation || "";
        const args = msgBody.trim().split(/\s+/).slice(1);

        if (args.length > 0) {
            const prefix = args[0];
            if (!configManager.config.users[number]) configManager.config.users[number] = {};
            configManager.config.users[number].prefix = prefix;
            configManager.save();
            await bug(message, client, `✅ Préfixe changé avec succès → \`${prefix}\``, 3);
        } else {
            configManager.config.users[number].prefix = "";
            configManager.save();
            await bug(message, client, "✅ Préfixe réinitialisé avec succès", 2);
        }
    } catch (e) {
        await client.sendMessage(message.key.remoteJid, { text: `❌ Erreur lors du changement de préfixe: ${e.message}` });
    }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔹 SET AUTO REACT
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function setreaction(message, client) {
    const number = client.user.id.split(':')[0];
    try {
        const remoteJid = message.key?.remoteJid;
        if (!remoteJid) throw new Error("Message JID is undefined.");

        const msgBody = message.message?.extendedTextMessage?.text || message.message?.conversation || "";
        const args = msgBody.trim().split(/\s+/).slice(1);

        if (args.length > 0 && isEmoji(args[0])) {
            const reaction = args[0];
            if (!configManager.config.users[number]) configManager.config.users[number] = {};
            configManager.config.users[number].reaction = reaction;
            configManager.save();
            await bug(message, client, `✅ Réaction par défaut changée → ${reaction}`, 2);
        } else {
            await bug(message, client, "⚠️ Donne un emoji valide", 2);
        }
    } catch (e) {
        await client.sendMessage(message.key.remoteJid, { text: `❌ Erreur lors du changement de réaction: ${e.message}` });
    }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔹 SET WELCOME ON/OFF
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function setwelcome(message, client) {
    const number = client.user.id.split(':')[0];
    try {
        const msgBody = message.message?.conversation || message.message?.extendedTextMessage?.text || "";
        const args = msgBody.trim().split(/\s+/).slice(1);
        if (!configManager.config.users[number]) configManager.config.users[number] = {};

        if (args.join(" ").toLowerCase().includes("on")) {
            configManager.config.users[number].welcome = true;
            configManager.save();
            await bug(message, client, "✅ Welcome activé", 2);
        } else if (args.join(" ").toLowerCase().includes("off")) {
            configManager.config.users[number].welcome = false;
            configManager.save();
            await bug(message, client, "🚫 Welcome désactivé", 2);
        } else {
            await bug(message, client, "⚠️ Utilise : `.welcome on` ou `.welcome off`", 2);
        }
    } catch (e) {
        console.error("Erreur welcome:", e);
    }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔹 SET AUTORECORD ON/OFF
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function setautorecord(message, client) {
    const number = client.user.id.split(':')[0];
    try {
        const msgBody = message.message?.conversation || message.message?.extendedTextMessage?.text || "";
        const args = msgBody.trim().split(/\s+/).slice(1);
        if (!configManager.config.users[number]) configManager.config.users[number] = {};

        if (args.join(" ").toLowerCase().includes("on")) {
            configManager.config.users[number].record = true;
            configManager.save();
            await bug(message, client, "✅ AutoRecord activé", 2);
        } else if (args.join(" ").toLowerCase().includes("off")) {
            configManager.config.users[number].record = false;
            configManager.save();
            await bug(message, client, "🚫 AutoRecord désactivé", 2);
        } else {
            await bug(message, client, "⚠️ Utilise : `.autorecord on` ou `.autorecord off`", 2);
        }
    } catch (e) {
        console.error("Erreur autorecord:", e);
    }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔹 SET AUTOTYPE ON/OFF
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function setautotype(message, client) {
    const number = client.user.id.split(':')[0];
    try {
        const msgBody = message.message?.conversation || message.message?.extendedTextMessage?.text || "";
        const args = msgBody.trim().split(/\s+/).slice(1);
        if (!configManager.config.users[number]) configManager.config.users[number] = {};

        if (args.join(" ").toLowerCase().includes("on")) {
            configManager.config.users[number].type = true;
            configManager.save();
            await bug(message, client, "✅ AutoType activé", 2);
        } else if (args.join(" ").toLowerCase().includes("off")) {
            configManager.config.users[number].type = false;
            configManager.save();
            await bug(message, client, "🚫 AutoType désactivé", 2);
        } else {
            await bug(message, client, "⚠️ Utilise : `.autotype on` ou `.autotype off`", 2);
        }
    } catch (e) {
        console.error("Erreur autotype:", e);
    }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXPORT GLOBAL
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default { setprefix, setreaction, setwelcome, setautorecord, setautotype };