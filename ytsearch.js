//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
// Commande YT Search
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const { cmd } = require('../command');
const yts = require('yt-search');

cmd({
    pattern: "yts",
    alias: ["ytsearch"],
    use: ".yts search_query",
    react: "🔎",
    desc: "Search and get top YouTube results in 🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴 style",
    category: "downloader",
    filename: __filename
}, async (conn, mek, { from, q, reply, user, date }) => {
    try {
        if (!q) return reply(`*❌ Please provide search terms*\nUsage: .yts <search_query>`);

        await conn.sendMessage(from, {
            react: { text: "⏳", key: mek.key }
        });

        const results = await yts(q);
        if (!results.all || results.all.length === 0) return reply("*❌ No results found*");

        // Limiter à 5 résultats pour ne pas flooder
        const topResults = results.all.slice(0, 5);

        for (const video of topResults) {
            const caption = `
> ╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
> │🎴𝛫𝑈𝑅𝛩𝛮𝛥 𝑌𝑻 𝑆𝛯𝛥𝑅𝐶𝑯 𝑅𝛯𝑆𝑈𝐿𝑻𝛥𝑻🎴 
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
> │  ♧𝐓𝐢𝐭𝐫𝐞 : *${video.title}*
> │  ♤𝐃𝐮𝐫é𝐞 : ${video.timestamp || 'N/A'}
> │  ♡𝐕𝐮𝐞𝐬 : ${video.views || 'N/A'}
> │  ♢𝐋𝐢𝐞𝐧 : ${video.url}
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
> 🎴 ℬ𝓎  𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴`;

            await conn.sendMessage(from, {
                text: caption,
                contextInfo: {
                    externalAdReply: {
                        title: "YouTube Search",
                        body: "Téléchargez facilement vos vidéos/audio",
                        mediaType: 1,
                        thumbnail: await conn.getProfilePicture(conn.user.id).catch(() => null),
                        sourceUrl: video.url
                    }
                }
            }, { quoted: mek });
        }

    } catch (err) {
        console.error('🎴 YTSearch Error:', err);
        reply("*❌ Error performing YouTube search*");
    }
});