// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
//  The Ultimate WhatsApp Experience
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { ytmp4 } from "../commands/ytmp4.js";

const searchCache = new Map(); // Cache des recherches

export default async function ytmp4Command(conn, mek, { from, sender, q, reply }) {
  try {
    if (!q) return reply("❌ Please provide a YouTube URL or video name.");

    await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

    const cacheKey = q.toLowerCase();
    let videoData = searchCache.get(cacheKey);

    if (!videoData) {
      const searchResults = await conn.searchYT(q);
      if (!searchResults?.videos?.length) return reply("❌ No videos found.");
      videoData = searchResults.videos[0];
      searchCache.set(cacheKey, videoData);
    }

    // Message d’informations
    const message = `
╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
│        🎴𝛫𝑈𝑅𝛩𝛮𝛥 𝑌𝑻𝛭𝛲𝟒🎥🎴
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
│  ♧ 𝐓𝐢𝐭𝐫𝐞 : ${videoData.title}
│  ♤ 𝐃𝐮𝐫é𝐞 : ${videoData.duration?.timestamp || videoData.timestamp || "Unknown"}
│  ♡ 𝐕𝐮𝐞𝐬 : ${videoData.views || "Unknown"}
│  ♢ 𝐀𝐮𝐭𝐞𝐮𝐫 : ${videoData.author?.name || "Unknown"}
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
🎴 ℬ𝓎  𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥 🎴

*Téléchargement vidéo en cours...*
`.trim();

    await conn.sendMessage(
      from,
      { image: { url: videoData.thumbnail }, caption: message },
      { quoted: mek }
    );

    await conn.sendMessage(from, { react: { text: "⬇️", key: mek.key } });

    // Télécharger et envoyer la vidéo MP4
    const videoBuffer = await conn.downloadYTVideo(videoData.videoId);

    await conn.sendMessage(
      from,
      {
        video: videoBuffer,
        caption: `🎥 ${videoData.title}`,
        mimetype: "video/mp4",
      },
      { quoted: mek }
    );
  } catch (err) {
    console.error("YTMP4 Error:", err);
    reply("❌ Video service unavailable.");
  }
}
