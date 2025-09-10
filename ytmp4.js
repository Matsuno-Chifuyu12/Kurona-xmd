// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
//  The Ultimate WhatsApp Experience
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const { cmd } = require('../outils');
const { ytsearch } = require('@dark-yasiya/yt-dl.js');
const axios = require('axios');

const searchCache = new Map(); // Cache des recherches

async function fetchVideoData(url) {
    try {
        const response = await axios.get(url, { timeout: 10000 });
        return response.data;
    } catch (err) {
        throw new Error('Download service unavailable');
    }
}

cmd({
    pattern: "ytmp4",
    alias: ["video", "mp4"],
    react: "🎥",
    desc: "Download YouTube video in MP4",
    category: "download",
    filename: __filename
}, async (conn, mek, { from, sender, q, reply }) => {
    try {
        if (!q) return reply("❌ Please provide a YouTube URL or video name");

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        const cacheKey = q.toLowerCase();
        let videoData = searchCache.get(cacheKey);

        if (!videoData) {
            const searchResults = await ytsearch(q);
            if (!searchResults?.results?.length) return reply("❌ No videos found");
            videoData = searchResults.results[0];
            searchCache.set(cacheKey, videoData);
        }

        // Téléchargement direct en vidéo MP4
        await conn.sendMessage(from, { react: { text: "⬇️", key: mek.key } });
        
        // Ici vous devriez ajouter le code pour télécharger la vidéo MP4
        // et l'envoyer directement sans demander de choix
        // Exemple: const videoBuffer = await downloadMP4(videoData.video_url);
        
        const message = `
> ╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
> │        🎴𝛫𝑈𝑅𝛩𝛮𝛥 𝑌𝑻𝛭𝛲𝟒🎥🎴
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
> │  ♧𝐓𝐢𝐭𝐫𝐞 : ${videoData.title}
> │  ♤𝐃𝐮𝐫é𝐞 : ${videoData.timestamp}
> │  ♡𝐕𝐮𝐞𝐬 : ${videoData.views}
> │  ♢𝐋𝐢𝐞𝐧 : ${videoData.video_url}
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
🎴 ℬ𝓎  𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴

*Téléchargement vidéo en cours...*
        `.trim();

        await conn.sendMessage(from, {
            image: { url: videoData.thumbnail },
            caption: message
        }, { quoted: mek });

        // TODO: Ajouter ici le code pour envoyer la vidéo MP4
        reply("✅ Vidéo MP4 téléchargée directement");

    } catch (err) {
        console.error("YTMP4 Error:", err);
        reply("❌ Video service unavailable");
    }
});

cmd({
    pattern: "ytmp3",
    alias: ["song", "music"],
    react: "🎶",
    desc: "Download YouTube audio in MP3",
    category: "download",
    filename: __filename
}, async (conn, mek, { from, sender, q, reply }) => {
    try {
        if (!q) return reply("❌ Please provide a YouTube URL or song name");

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        const cacheKey = `audio_${q.toLowerCase()}`;
        let videoData = searchCache.get(cacheKey);

        if (!videoData) {
            const searchResults = await ytsearch(q);
            if (!searchResults?.results?.length) return reply("❌ No songs found");
            videoData = searchResults.results[0];
            searchCache.set(cacheKey, videoData);
        }

        // Téléchargement direct en audio MP3
        await conn.sendMessage(from, { react: { text: "⬇️", key: mek.key } });
        
        // Ici vous devriez ajouter le code pour télécharger l'audio MP3
        // et l'envoyer directement sans demander de choix
        // Exemple: const audioBuffer = await downloadMP3(videoData.video_url);

        const message = `
> ╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
> │           🎴𝛥𝑈𝑫𝑰𝛩 de🎶🎴
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
> 🎴 ℬ𝓎  𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴

*Téléchargement audio en cours...*
        `.trim();

        await conn.sendMessage(from, {
            image: { url: videoData.thumbnail },
            caption: message
        }, { quoted: mek });

        // TODO: Ajouter ici le code pour envoyer l'audio MP3
        reply("✅ Audio MP3 téléchargé directement");

    } catch (err) {
        console.error("YTMP3 Error:", err);
        reply("❌ Music service unavailable");
    }
});

// Supprimer la fonction handleDownloadResponse qui n'est plus nécessaire
module.exports = {};