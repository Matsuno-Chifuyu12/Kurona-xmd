// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
//  The Ultimate WhatsApp Experience
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const { cmd } = require('../outils');
const yts = require('yt-search');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const stream = require('stream');
const pipeline = promisify(stream.pipeline);

const userSessions = new Map();

// Extraction ID YouTube
function extractYouTubeID(url) {
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/channel\/([a-zA-Z0-9_-]+)/,
        /youtube\.com\/user\/([a-zA-Z0-9_-]+)/
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

// Fonction pour télécharger et convertir en MP3
async function downloadAudio(videoId, outputPath) {
    try {
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        const audioStream = ytdl(videoUrl, {
            filter: 'audioonly',
            quality: 'highestaudio',
        });
        
        await pipeline(audioStream, fs.createWriteStream(outputPath));
        return true;
    } catch (error) {
        console.error('Erreur lors du téléchargement audio:', error);
        return false;
    }
}

// Commande principale
cmd({
    pattern: "ytmp3",
    alias: ["play3","song"],
    react: "🎵",
    desc: "Download YouTube audio",
    category: "download",
    use: ".ytmp3 <query or URL>",
    filename: __filename
}, async (conn, mek, { from, sender, q, reply }) => {
    try {
        if (!q) return reply("❌ Veuillez fournir un lien YouTube ou un mot clé");

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        let videoId = q.startsWith("http") ? extractYouTubeID(q) : null;
        let videoData;

        if (videoId) {
            // Recherche par ID
            const searchResult = await yts({ videoId });
            videoData = searchResult;
        } else {
            // Recherche par mot-clé
            const searchResults = await yts(q);
            videoData = searchResults.videos[0];
        }

        if (!videoData) return reply("❌ Aucun résultat trouvé");

        const sessionData = {
            videoId: videoData.videoId,
            videoData: videoData,
            timestamp: Date.now()
        };
        userSessions.set(sender, sessionData);

        const info = `
> ╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
> │        🎴𝛫𝑈𝑅𝛩𝛮𝛥 𝑌𝑻𝛭𝛲𝟑🎶🎴
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
> │  ♧𝐓𝐢𝐭𝐫𝐞 :  *${videoData.title || 'Unknown'}*
> │  ♤𝐃𝐮𝐫é𝐞 : *${videoData.duration?.timestamp || videoData.timestamp || 'Unknown'}*
> │  ♡𝐕𝐮𝐞𝐬 : *${videoData.views || 'Unknown'}*
> │  ♢𝐀𝐮𝐭𝐞𝐮𝐫: *${videoData.author?.name || 'Unknown'}*
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
> 🎴 ℬ𝓎  𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴

> _*Téléchargement audio en cours...*_`.trim();

        await conn.sendMessage(from, {
            image: { url: videoData.thumbnail },
            caption: info
        }, { quoted: mek });

        // Téléchargement automatique en MP3
        await conn.sendMessage(from, { react: { text: "⬇️", key: mek.key } });

        // Créer un nom de fichier unique
        const timestamp = Date.now();
        const filename = `ytmp3_${timestamp}.mp3`;
        const filepath = path.join(__dirname, '..', 'temp', filename);
        
        // Créer le dossier temp s'il n'existe pas
        if (!fs.existsSync(path.dirname(filepath))) {
            fs.mkdirSync(path.dirname(filepath), { recursive: true });
        }

        // Télécharger l'audio
        const downloadSuccess = await downloadAudio(sessionData.videoId, filepath);
        
        if (!downloadSuccess) {
            userSessions.delete(sender);
            return reply("❌ Échec du téléchargement");
        }

        // Envoyer l'audio
        await conn.sendMessage(from, {
            audio: fs.readFileSync(filepath),
            mimetype: "audio/mpeg",
            ptt: false,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });

        // Nettoyer le fichier temporaire
        try {
            fs.unlinkSync(filepath);
        } catch (cleanupError) {
            console.error("Erreur lors du nettoyage:", cleanupError);
        }

        userSessions.delete(sender);

    } catch (err) {
        console.error("ytmp3 Error:", err);
        reply("❌ Service indisponible pour le moment");
    }
});

module.exports = {};