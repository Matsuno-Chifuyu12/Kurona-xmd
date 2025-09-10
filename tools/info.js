// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
//  The Ultimate WhatsApp Experience
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import configManager from "../utils/manageConfigs.js";

export async function info(message, client) {
    try {
        const remoteJid = message.key.remoteJid;
        const user = message.pushName || "Inconnu";
        const number = client.user.id.split(":")[0];

        const today = new Date();
        const daysOfWeek = [
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        ];
        const currentDay = daysOfWeek[today.getDay()];
        const date = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

        const prefix = configManager?.config?.users[number]?.prefix || ".";

        const menu = `
╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
┃     🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴    
┃    𝐓𝐡𝐞 𝐔𝐥𝐭𝐢𝐦𝐚𝐭𝐞 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 𝐄𝐱𝐩𝐞𝐫𝐢𝐞𝐧𝐜𝐞                   
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯

╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
│  🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝐼𝛮𝑭𝛩🎴
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
│  ❃ 𝗢𝘄𝗻𝗲𝗿 : 🎴 𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴
│  ❃ 𝗠𝗼𝗱𝗲 : Public
│  ❃ 𝗨𝘀𝗲𝗿 : ${user}
│  ❃ 𝗣𝗿𝗲𝗳𝗶𝘅 : [ . ]
│  ❃ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻 : v1.0.0
│  ❃ 𝗗𝗮𝘁𝗲 : ${date}
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
│           𝐂 𝐎 𝐌 𝐌 𝐀 𝐍 𝐃 𝐒          
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯

╭┅┅┅┅ ✨MENU✨ ┅┅┅┅╮
┃➺menu
┃➺premium
┃➺bug-menu
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
╭┅┅ 🧰𝐔𝐓𝐈𝐋𝐒🧰 ┅┅╮
┃➙ping
┃➙sudo
┃➙device
┃➙delsudo
┃➙getsudo
┃➙autoreact
┃➙setprefix
┃➙autotype
╰┅┅┅┅┅┅┅┅┅┅┅┅┅╯
╭┅┅┅ 📥𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑📥 ┅┅┅╮
┃➳ytmp3 
┃➳ytmp4 
┃➳play 
┃➳tiktok 
┃➳fb 
┃➳ig 
┃➳pin
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
╭┅┅┅┅ 👑𝐆𝐑𝐎𝐔𝐏 𝐌𝐀𝐍𝐀𝐆𝐄👑 ┅┅┅┅╮
┃➺promote
┃➺demote
┃➺demoteall
┃➺promoteall
┃➺kick
┃➺kickall
┃➺invite
┃➺purge
┃➺antimention
┃➺antilink
┃➺antibot
┃➺welcome
┃➺mute
┃➺unmute
┃➺bye
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
╭┅┅┅ 💾𝐌𝐄𝐃𝐈𝐀💾 ┅┅┅╮
┃➙sticker
┃➙toaudio
┃➙photo
┃➙vv
┃➙take
┃➙save
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
╭┅┅┅ 📢𝐓𝐀𝐆📢 ┅┅┅╮
┃➳tagall 
┃➳tagadmin 
┃➳tag
┃➳settag
┃➳respons
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
│  🎴 ℬ𝓎  𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
        `;

        // Envoi du menu avec une image
        await client.sendMessage(remoteJid, {
            image: { url: "./assets/images/logo.png" },
            caption: menu,
            quoted: message,
        });

        // Envoi d’un audio de présentation
        await client.sendMessage(remoteJid, {
            audio: { url: "./assets/audio/menu.mp3" },
            mimetype: "audio/mp4",
            ptt: true,
            quoted: message,
        });
    } catch (e) {
        console.error("[INFO CMD ERROR]", e);
        await client.sendMessage(message.key.remoteJid, {
            text: "❌ Une erreur est survenue lors de l’exécution de la commande info.",
            quoted: message,
        });
    }
}

export default info;
