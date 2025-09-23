// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
//  The Ultimate WhatsApp Experience
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import fs from 'fs';
import path from 'path';
import { ytmp3 } from '../commands/ytmp3.js'; 

const userSessions = new Map();

// Extraction ID YouTube
function extractYouTubeID(url) {
  const patterns = [
    /(?:youtube.com\/watch\?v=|youtu.be\/|youtube.com\/embed\/|youtube.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /youtube.com\/channel\/([a-zA-Z0-9_-]+)/,
    /youtube.com\/user\/([a-zA-Z0-9_-]+)/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default async function ytmp3Command(conn, mek, { from, sender, q, reply }) {
  try {
    if (!q) return reply("❌ Veuillez fournir un lien YouTube ou un mot-clé.");

    await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

    let videoId = q.startsWith("http") ? extractYouTubeID(q) : null;
    let videoData;

    if (videoId) {
      // Recherche par ID
      videoData = await conn.getYTVideo(videoId);
    } else {
      // Recherche par mot-clé
      const searchResults = await conn.searchYT(q);
      videoData = searchResults.videos[0];
    }

    if (!videoData) return reply("❌ Aucun résultat trouvé.");

    const sessionData = {
      videoId: videoData.videoId,
      videoData: videoData,
      timestamp: Date.now()
    };
    userSessions.set(sender, sessionData);

    const info = `
╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
│        🎴𝛫𝑈𝑅𝛩𝛮𝛥 𝑌𝑻𝛭𝛲𝟑🎶🎴
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
│  ♧ 𝐓𝐢𝐭𝐫𝐞 : ${videoData.title || 'Inconnu'}
│  ♤ 𝐃𝐮𝐫é𝐞 : ${videoData.duration?.timestamp || videoData.timestamp || 'Inconnue'}
│  ♡ 𝐕𝐮𝐞𝐬 : ${videoData.views || 'Inconnues'}
│  ♢ 𝐀𝐮𝐭𝐞𝐮𝐫 : ${videoData.author?.name || 'Inconnu'}
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
🎴 ℬ𝓎 𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥 🎴

> Téléchargement audio en cours...
`.trim();

    await conn.sendMessage(from, {
      image: { url: videoData.thumbnail },
      caption: info
    }, { quoted: mek });

    await conn.sendMessage(from, { react: { text: "⬇️", key: mek.key } });

    // Téléchargement audio
    const audioBuffer = await conn.downloadYTAudio(sessionData.videoId);

    await conn.sendMessage(from, {
      audio: audioBuffer,
      mimetype: "audio/mpeg",
      ptt: false,
      contextInfo: { mentionedJid: [sender] }
    }, { quoted: mek });

    userSessions.delete(sender);

  } catch (err) {
    console.error("ytmp3 Error:", err);
    reply("❌ Service indisponible pour le moment.");
  }
}
