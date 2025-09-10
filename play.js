//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴 | play.js
// Commande : play — Recherche & télécharge audio (Optimisé Parallel)
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import axiosRetry from 'axios-retry';

// Réessayer automatiquement en cas d'échec
axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

export async function play(messageObj, client) {
    const chatId = messageObj.key.remoteJid;

    const messageText = (
        messageObj.message?.extendedTextMessage?.text ||
        messageObj.conversation?.trim() ||
        ''
    ).toLowerCase();

    try {
        const query = extractQuery(messageText);
        if (!query) {
            return await client.sendMessage(chatId, { text: '❌ Veuillez fournir un titre de vidéo.' });
        }

        const processId = uuidv4();
        console.log(`🎯 [PLAY | ${processId}] Recherche: ${query}`);
        await client.sendMessage(chatId, { text: `>_*Recherche en cours pour : ${query}*_\n> ID: ${processId}`, quoted: messageObj });

        const apiUrl = `https://apis.davidcyriltech.my.id/play?query=${encodeURIComponent(query)}`;
        const { data } = await axios.get(apiUrl);

        if (!data?.status || !data?.result || !data.result.download_url) {
            throw new Error('Vidéo introuvable ou URL manquante.');
        }

        const video = data.result;

        console.log(`⚡ [PLAY | ${processId}] Préparation des fichiers`);

        // Envoi parallèle de la miniature + audio
        await Promise.all([
            client.sendMessage(chatId, {
                image: { url: video.thumbnail },
                caption: 
`> ╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
> │        🎴𝛫𝑈𝑅𝛩𝛮𝛥 𝛲𝑳𝛥𝒀𝛯𝑹🎵🎴 
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
> │  ♧𝐓𝐢𝐭𝐫𝐞 : *${video.title}*
> │  ♤𝐃𝐮𝐫é𝐞 : ${video.duration}
> │  ♡𝐕𝐮𝐞𝐬 : ${video.views}
> │  ♢𝐋𝐢𝐞𝐧 : ${video.video_url}
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
> 🎴 ℬ𝓎  𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴
> _📥 Téléchargement audio en cours..._`,
                quoted: messageObj
            }),
            client.sendMessage(chatId, {
                audio: { url: video.audio_url },
                mimetype: 'audio/mp4',
                ptt: false,
                fileName: `${video.title}.mp3`,
                quoted: messageObj
            })
        ]);

        console.log(`✅ [PLAY | ${processId}] Audio et miniature envoyés`);

    } catch (error) {
        console.error(`❌ [PLAY | ERROR]:`, error);
        await client.sendMessage(chatId, { text: `❌ Impossible de lire la vidéo : ${error.message}` });
    }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Extraction de l'argument de la commande
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function extractQuery(text) {
    const parts = text.trim().split(/\s+/);
    return parts.length > 1 ? parts.slice(1).join(' ') : null;
}

export default play;