//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴
// Commandes de mention / TAG — Ton Majordome
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { createWriteStream } from 'fs';
import pkg from "@whiskeysockets/bailey";
const { downloadMediaMessage } = pkg;
import configManager from '../utils/manageConfigs.js';

const BOT_SIGNATURE = '🎩 Votre humble serviteur — 🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴 🎩';

export async function tagall(message, client) {
    const jid = message.key.remoteJid;
    if (!jid.includes('@g.us')) return client.sendMessage(jid, { text: 'Veuillez excuser cette requête, mais les mentions sont strictement réservées aux rassemblements de ce cercle distingué.' });

    try {
        const group = await client.groupMetadata(jid);
        const participants = group.participants.map(p => p.id);

        const mentionsText = participants.map(u => `• Monsieur/Madame @${u.split('@')[0]}`).join('\n');
        const tagMessage = `
> ╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
> │    🎴HONORED CALL TO ALL🎴         │
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯

Avec tout le respect qui vous est dû, @${message.key.participant?.split('@')[0] || 'Votre Excellence'} présente l’invocation :

${mentionsText}

${BOT_SIGNATURE}`.trim();

        await client.sendMessage(jid, { text: tagMessage, mentions: participants });
    } catch (err) {
        console.error("Erreur lors de l'invocation de tous les membres :", err);
    }
}

export async function tagadmin(message, client) {
    const jid = message.key.remoteJid;
    if (!jid.includes('@g.us')) return client.sendMessage(jid, { text: 'Ah, je crains que cette commande ne soit disponible qu’au sein d’un cercle privilégié…' });

    const botNumber = client.user.id.split(':')[0] + '@s.whatsapp.net';
    try {
        const { participants } = await client.groupMetadata(jid);
        const admins = participants.filter(p => p.admin && p.id !== botNumber).map(p => p.id);

        if (!admins.length) return client.sendMessage(jid, { text: 'Il semblerait qu’aucun membre de distinction ne soit présent à l’instant.' });

        const text = `🎩 *Les honorables administrateurs sont priés de se manifester:*\n${admins.map(u => `• Monsieur/Madame @${u.split('@')[0]}`).join('\n')}`;
        await client.sendMessage(jid, { text, mentions: admins });
    } catch (err) {
        console.error("Erreur lors de l'invocation des administrateurs :", err);
        await client.sendMessage(jid, { text: 'Une malencontreuse erreur a empêché l’invocation des administrateurs.' });
    }
}

export async function tag(message, client) {
    const jid = message.key.remoteJid;
    if (!jid.includes('@g.us')) return client.sendMessage(jid, { text: 'Cette opération est strictement réservée aux cercles distingués.' });

    try {
        const group = await client.groupMetadata(jid);
        const participants = group.participants.map(u => u.id);
        const msgBody = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
        const commandParts = msgBody.slice(1).trim().split(/\s+/);
        const text = commandParts.slice(1).join(' ') || 'Veuillez prêter attention à ce message distingué…';

        const quotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (quotedMsg) {
            if (quotedMsg.stickerMessage) {
                await client.sendMessage(jid, { sticker: quotedMsg.stickerMessage, mentions: participants });
            } else {
                const qText = quotedMsg.conversation || quotedMsg.extendedTextMessage?.text || '';
                await client.sendMessage(jid, { text: qText, mentions: participants });
            }
            return;
        }

        await client.sendMessage(jid, { text, mentions: participants });
    } catch (err) {
        console.error("Erreur lors de l'invocation générale :", err);
    }
}

// Fonctions settag et tagoption conservées mais avec messages raffinés
export async function settag(message, client) {
    const jid = message.key.remoteJid;
    const number = client.user.id.split(':')[0];
    const quotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!quotedMsg?.audioMessage) return client.sendMessage(jid, { text: 'Veuillez répondre avec un message audio pour définir la notification, s’il vous plaît.' });

    try {
        const audioStream = await downloadMediaMessage({ message: quotedMsg }, "stream");
        const filePath = `${number}.mp3`;
        const writeStream = createWriteStream(filePath);

        if (!configManager.config.users[number]) configManager.config.users[number] = {};
        configManager.config.users[number].tagAudioPath = filePath;
        configManager.save();

        audioStream.pipe(writeStream);
        await client.sendMessage(jid, { text: 'Votre tag audio a été élégamment enregistrée. 🎩' });
    } catch (err) {
        console.error("Erreur lors de la définition du tag audio :", err);
    }
}

export async function tagoption(message, client) {
    const jid = message.key.remoteJid;
    const number = client.user.id.split(':')[0];
    const args = (message.message?.conversation || message.message?.extendedTextMessage?.text || '').slice(1).trim().split(/\s+/).slice(1);

    if (!configManager.config.users[number]) return;

    try {
        if (args.join(' ').toLowerCase().includes('on')) {
            configManager.config.users[number].response = true;
            configManager.save();
            await client.sendMessage(jid, { text: 'Les notifications automatiques ont été honorablement activées. 🎩' });
        } else if (args.join(' ').toLowerCase().includes('off')) {
            configManager.config.users[number].response = false;
            configManager.save();
            await client.sendMessage(jid, { text: 'Les notifications automatiques ont été poliment désactivées. 🎩' });
        } else {
            await client.sendMessage(jid, { text: 'Veuillez choisir une option distinguée : on/off.' });
        }
    } catch (err) {
        console.error("Erreur lors du réglage des options de tag :", err);
    }
}

export default { tagall, tagadmin, tag, settag, tagoption };