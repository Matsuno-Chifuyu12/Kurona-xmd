//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
// Commande : Premium Manager
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import fs from "fs";

const premiumFile = "./config/premium.json";

// Charger la liste des premium
function loadPremium() {
    if (!fs.existsSync(premiumFile)) return [];
    try {
        return JSON.parse(fs.readFileSync(premiumFile));
    } catch (e) {
        console.error("⚠️ Erreur lors du chargement de premium.json :", e);
        return [];
    }
}

// Sauvegarder la liste des premium
function savePremium(list) {
    fs.writeFileSync(premiumFile, JSON.stringify(list, null, 2));
}

// Fonction générique
export async function modifyprem(message, client, action) {
    try {
        const remoteJid = message.key?.remoteJid;
        if (!remoteJid) throw new Error("Invalid remote JID.");

        const msgBody = message.message?.extendedTextMessage?.text || message.message?.conversation || "";
        const args = msgBody.trim().split(/\s+/).slice(1);

        let participant;
        if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
            participant = message.message?.extendedTextMessage?.contextInfo?.participant || message.key.participant;
        } else if (args.length > 0) {
            const jidMatch = args[0].match(/\d+/);
            if (!jidMatch) throw new Error("Format invalide.");
            participant = jidMatch[0] + "@s.whatsapp.net";
        } else {
            throw new Error("Aucun utilisateur spécifié.");
        }

        let list = loadPremium();

        if (action === "add") {
            if (!list.includes(participant)) {
                list.push(participant);
                savePremium(list);
                await client.sendMessage(remoteJid, { text: `✅ @${participant.split("@")[0]} ajouté en Premium.`, mentions: [participant] });
            } else {
                await client.sendMessage(remoteJid, { text: `⚠️ @${participant.split("@")[0]} est déjà Premium.`, mentions: [participant] });
            }
        } else if (action === "remove") {
            if (list.includes(participant)) {
                list = list.filter(p => p !== participant);
                savePremium(list);
                await client.sendMessage(remoteJid, { text: `❌ @${participant.split("@")[0]} retiré des Premium.`, mentions: [participant] });
            } else {
                await client.sendMessage(remoteJid, { text: `⚠️ @${participant.split("@")[0]} n'est pas Premium.`, mentions: [participant] });
            }
        }
    } catch (error) {
        console.error("Erreur premium.js:", error);
        await client.sendMessage(message.key.remoteJid, { text: "⚠️ Une erreur est survenue." });
    }
}

// Exports rapides
export async function addprem(message, client) {
    await modifyprem(message, client, "add");
}

export async function delprem(message, client) {
    await modifyprem(message, client, "remove");
}

export default { addprem, delprem };