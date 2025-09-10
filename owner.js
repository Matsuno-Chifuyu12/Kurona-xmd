//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴
// The Ultimate WhatsApp Experience
// Commande : owner.js
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { OWNER_NUMBER, OWNER_NAME } from "../../config/settings.js";

export async function owner(message, client) {
    try {
        const remoteJid = message.key.remoteJid;

        // vCard générée automatiquement
        const vcard = 
`BEGIN:VCARD
VERSION:3.0
FN:${OWNER_NAME}
ORG: kurona Tech;
TEL;type=CELL;type=VOICE;waid=${OWNER_NUMBER}: +${OWNER_NUMBER}
END:VCARD`;

        // Envoi du contact formaté
        await client.sendMessage(remoteJid, {
            contacts: {
                displayName: OWNER_NAME,
                contacts: [{ vcard }]
            }
        });

    } catch (error) {
        console.error("Erreur owner.js:", error);
        await client.sendMessage(message.key.remoteJid, { text: "❌ Erreur lors de l’envoi du contact propriétaire." });
    }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXPORT
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default owner;