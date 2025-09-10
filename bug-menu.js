//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
// Commande BUG — Menu & Tests
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import fs from "fs";
import path from "path";
import configManager from '../../libs/config.js';

export async function bugMenu(message, client) {
    try {
        const remoteJid = message.key.remoteJid;
        const username = message.pushName || "Unknown";

        // Date dynamique
        const today = new Date();
        const currentDate = today.getDate();
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();
        const date = `${currentDate}/${currentMonth}/${currentYear}`;

        // Numéro du bot
        const number = client.user.id.split(':')[0];

        // Message stylisé
        const menuText = `
╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
│           🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝐵𝑢𝑔 𝐌𝑒𝑛𝑢🎴
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
│  ❃ 𝗢𝘄𝗻𝗲𝗿 : 🎴 𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴
│  ❃ 𝗠𝗼𝗱𝗲 : Public
│  ❃ 𝗨𝘀𝗲𝗿 : ${username}
│  ❃ 𝗣𝗿𝗲𝗳𝗶𝘅 : [ . ]
│  ❃ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻 : v1.0.0
│  ❃ 𝗗𝗮𝘁𝗲 : ${date}
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯

╭┅┅┅┅ 🐞 𝐁𝐔𝐆 🐞 ┅┅┅┅┅╮
┃➺ samykill 237xxxxx
┃➺ evil-kill 237xxxxx
┃➺ k-bug 237xxxxx
┃➺ darknesscrash 237xxxxx
┃➺ kuroinvi-ios 237xxxxx
┃➺ gcbug
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯

╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
│  🎴 ℬ𝓎  𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
`;

        // ✅ Chemins absolus vers /assets
        const videoPath = path.resolve("./assets/videos/bug.mp4");
        const audioPath = path.resolve("./assets/audio/bug.m4a");

        // Envoi vidéo avec caption du menu
        const videoMsg = await client.sendMessage(remoteJid, {
            video: fs.readFileSync(videoPath),
            caption: menuText,
        });

        // Envoi audio PTT (PTT = true)
        await client.sendMessage(remoteJid, {
            audio: fs.readFileSync(audioPath),
            mimetype: 'audio/mp4',
            ptt: true,
            quoted: videoMsg
        });

    } catch (error) {
        console.error("Erreur bugMenu:", error);
        await client.sendMessage(message.key.remoteJid, {
            text: "⚠️ Une erreur est survenue lors de l'affichage du menu BUG."
        });
    }
}

export default bugMenu;