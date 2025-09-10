//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ //
//🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝐼𝛮𝑭𝛩🎴 save.js
// Gestion des médias ViewOnce et sauvegarde intelligente
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ //

import { normalizeMessageContent } from '../../libs/functions.js';
import { downloadMediaMessage } from 'bailey';
import fs from 'fs';
import path from 'path';

export async function save(message, client) {
    try {
        const remoteJid = message.key.remoteJid;
        const botJid = client.user.id.split(':')[0] + '@s.whatsapp.net';
        const contextInfo = message.message?.extendedTextMessage?.contextInfo;
        const quotedMessage = contextInfo?.quotedMessage;
        const quotedId = contextInfo?.stanzaId;
        const quotedJid = contextInfo?.participant || remoteJid;

        if (!quotedMessage) {
            return await client.sendMessage(remoteJid, {
                text: '_Aucun message cité détecté pour sauvegarde._'
            });
        }

        // Détection ViewOnce
        const isViewOnce =
            quotedMessage?.imageMessage?.viewOnce ||
            quotedMessage?.videoMessage?.viewOnce ||
            quotedMessage?.audioMessage?.viewOnce;

        // Forward classique si pas ViewOnce
        if (!isViewOnce) {
            const forwardMsg = {
                key: { remoteJid: quotedJid, fromMe: false, id: quotedId },
                message: quotedMessage
            };
            return await client.sendMessage(botJid, { forward: forwardMsg });
        }

        // Normalisation et désactivation ViewOnce
        const content = normalizeMessageContent(quotedMessage);

        const disableViewOnce = (obj) => {
            if (!obj || typeof obj !== 'object') return;
            for (const key in obj) {
                if (key === 'viewOnce') obj[key] = false;
                else if (typeof obj[key] === 'object') disableViewOnce(obj[key]);
            }
        };
        disableViewOnce(content);

        let type = '', tempPath = '', sendOptions = {};
        if (content?.imageMessage) {
            type = 'image';
            tempPath = path.join('./assets/temp', `vo_image_${Date.now()}.jpg`);
            sendOptions = { image: { url: tempPath } };
        } else if (content?.videoMessage) {
            type = 'video';
            tempPath = path.join('./assets/temp', `vo_video_${Date.now()}.mp4`);
            sendOptions = { video: { url: tempPath } };
        } else if (content?.audioMessage) {
            type = 'audio';
            tempPath = path.join('./assets/temp', `vo_audio_${Date.now()}.mp3`);
            sendOptions = { audio: { url: tempPath } };
        } else {
            return await client.sendMessage(remoteJid, {
                text: '_Aucun média compatible ViewOnce trouvé._'
            });
        }

        // Téléchargement et sauvegarde temporaire
        const buffer = await downloadMediaMessage({ message: content }, 'buffer', {});
        if (!buffer) throw new Error('Échec du téléchargement du média ViewOnce.');

        fs.writeFileSync(tempPath, buffer);
        await client.sendMessage(botJid, sendOptions);
        fs.unlinkSync(tempPath);

    } catch (err) {
        console.error('🎴 Save.js Error:', err);
        await client.sendMessage(message.key.remoteJid, {
            text: '_Une erreur est survenue lors du traitement du message ViewOnce._'
        });
    }
}

export default save;