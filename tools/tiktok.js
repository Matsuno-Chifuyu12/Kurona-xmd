//──────────────────────────────//
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
// Commande TikTok
//──────────────────────────────//

import axios from 'axios';

//─────────────────────────────
// @param {Object} message - Message reçu
// @param {Object} client - Instance du bot
//─────────────────────────────
export async function tiktok(message, client) {
  const remoteJid = message.key.remoteJid;
  const messageBody = (
    message.message?.extendedTextMessage?.text ||
    message.message?.conversation ||
    ''
  ).trim();

  const url = extractTikTokUrl(messageBody);

  if (!url) {
    return await client.sendMessage(remoteJid, {
      text: `❌ Veuillez fournir un lien TikTok valide.\nEx: https://www.tiktok.com/@user/video/1234567890`,
      quoted: message
    });
  }

  try {

    await client.sendMessage(remoteJid, {
      text: `
> ╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
> │        🎴 𝐓𝐢𝐤𝐓𝐨𝐤 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐫 🎴
> │           _🎯 𝐏𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐧𝐠..._    
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
> ${url}`,
      quoted: message
    });

    console.log(`⏳ Fetching TikTok video from: ${url}`);

    // Appel API TikTok
    const apiUrl = `https://apis.davidcyriltech.my.id/download/tiktokv4?url=${encodeURIComponent(url)}`;
    const { data } = await axios.get(apiUrl, { timeout: 20000 });

    if (!data.success || !data.results?.no_watermark) {
      throw new Error('Impossible de récupérer la vidéo depuis l’API.');
    }

    const { no_watermark, watermark, audio } = data.results;

    // Envoyer la vidéo sans watermark
    await client.sendMessage(remoteJid, {
      video: { url: no_watermark },
      mimetype: 'video/mp4',
      caption: `
> ╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
> │     🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴 
> │       _𝐓𝐢𝐤𝐓𝐨𝐤 𝐕𝐢𝐝𝐞𝐨 𝐑𝐞𝐚𝐝𝐲_
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
> Enjoy your clip!`,
      quoted: message
    });

    // Envoyer l'audio séparément
    if (audio) {
      await client.sendMessage(remoteJid, {
        audio: { url: audio },
        mimetype: 'audio/mpeg',
        ptt: false,
        fileName: 'tiktok_audio.mp3',
        quoted: message
      });
    }

    console.log('✅ TikTok video and audio sent successfully.');

  } catch (err) {
    console.error('❌ Error in TikTok command:', err);
    await client.sendMessage(remoteJid, {
      text: `❌ Échec du téléchargement TikTok:\n> ${err.message}`,
      quoted: message
    });
  }
}

//───────────────────────────── 
// Extraction d'URL TikTok, gère liens courts et longs
// @param {string} text - Texte à analyser
// @returns {string|null} URL TikTok valide
//─────────────────────────────
function extractTikTokUrl(text) {
  if (!text) return null;

  // Regex TikTok pour tous les formats
  const tiktokRegex = /(https?:\/\/)?(www\.|vm\.|m\.)?tiktok\.com\/[^\s]+/i;
  const match = text.match(tiktokRegex);

  if (!match) return null;

  let url = match[0];

  // Gestion automatique des liens courts vm.tiktok.com
  if (url.includes('vm.tiktok.com')) {
    // Redirection pour obtenir le lien réel
    return resolveShortLink(url);
  }

  return url;
}

//─────────────────────────────
// Résolution des liens courts vm.tiktok.com
// @param {string} shortUrl
// @returns {Promise<string>} URL longue
//─────────────────────────────
async function resolveShortLink(shortUrl) {
  try {
    const res = await axios.head(shortUrl, { maxRedirects: 5 });
    return res.request.res.responseUrl || shortUrl;
  } catch {
    return shortUrl; // fallback
  }
}

export default tiktok;
