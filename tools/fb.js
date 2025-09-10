// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
//  The Ultimate WhatsApp Experience
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const { cmd } = require('../tools');
const axios = require('axios');

// Cache simple (anti flood et optimisation)
const fbCache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Nettoyage auto
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of fbCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      fbCache.delete(key);
    }
  }
}, 5 * 60 * 1000);

// Validation des liens Facebook
function isValidFacebookUrl(url) {
  const patterns = [
    /facebook\.com\/.+\/videos\/\d+/,
    /facebook\.com\/video\.php\?v=\d+/,
    /facebook\.com\/reel\/\d+/,
    /fb\.watch\/[a-zA-Z0-9_-]+/
  ];
  return patterns.some((p) => p.test(url));
}

// Récupération vidéo avec cache
async function getFbVideo(url) {
  const key = url.toLowerCase();
  if (fbCache.has(key)) return fbCache.get(key).data;

  const apiKey = process.env.FB_API_KEY || "demo_key"; // clé API dans .env
  const apiUrl = `https://api.nexoracle.com/downloader/facebook?apikey=${apiKey}&url=${encodeURIComponent(url)}`;

  const res = await axios.get(apiUrl, { timeout: 15000 });
  if (!res.data?.result?.sd) throw new Error("Invalid video response");

  const data = { ...res.data.result };
  fbCache.set(key, { data, timestamp: Date.now() });
  return data;
}

cmd({
  pattern: "fb",
  alias: ["facebook", "fbdl"],
  category: "download",
  react: "📥",
  desc: "Télécharger des vidéos Facebook",
  use: ".fb <url_facebook>",
  filename: __filename,
}, async (conn, mek, { from, args, reply, sender }) => {
  try {
    const url = args.join(" ").trim();
    if (!url) return reply("❌ Donne-moi un lien Facebook valide.\nExemple: .fb https://fb.watch/example");
    if (!isValidFacebookUrl(url)) return reply("❌ Ceci n’est pas un lien Facebook valide !");

    await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

    const video = await getFbVideo(url);
    const { hd, sd, title, desc, thumb } = video;
    const videoUrl = hd || sd;

    const caption = `
> ╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
> │        🎴𝛫𝑈𝑅𝛩𝛮𝛥 𝑭𝛢𝐶𝛦𝐵𝑶𝑶𝛫 🎴
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
> │  ♧𝐓𝐢𝐭𝐫𝐞 :  *${videoData.title || 'Unknown'}*
> │  ♤𝐃𝐞𝐬𝐜𝐫𝐢𝐩𝐭𝐢𝐨𝐧: *${desc || "Pas de description"}*
> │  ♡𝐐𝐮𝐚𝐥𝐢𝐭é: *${hd ? "HD" : "SD"}*
> │  ♢𝐋𝐢𝐞𝐧: *_${url}_*
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
> 🎴 ℬ𝓎  𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴
    `.trim();

    await conn.sendMessage(from, {
      video: { url: videoUrl },
      caption,
      contextInfo: {
        mentionedJid: [sender],
        externalAdReply: {
          title: "Facebook Video",
          body: title?.substring(0, 50) || "Facebook Downloader",
          thumbnailUrl: thumb,
          sourceUrl: url,
          mediaType: 2,
        },
      },
    }, { quoted: mek });

    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
  } catch (err) {
    console.error("FB Download error:", err);
    reply("❌ Impossible de télécharger la vidéo Facebook.");
    await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
  }
});

// Commande pour vider le cache
cmd({
  pattern: "fbrefresh",
  category: "download",
  desc: "Vider le cache Facebook",
  filename: __filename,
}, async (conn, mek, { from, reply }) => {
  const size = fbCache.size;
  fbCache.clear();
  reply(`✅ Cache vidé (${size} entrées supprimées)`);
});

module.exports = { getFbVideo, isValidFacebookUrl };
