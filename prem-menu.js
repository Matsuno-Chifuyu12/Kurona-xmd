//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
// Commande : prem
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import configManager from '../utils/manageConfigs.js';

export async function prem(message, client) {

    const remoteJid = message.key.remoteJid;
    const today = new Date();

    const daysOfWeek = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
    const currentDay = daysOfWeek[today.getDay()];
    const currentDate = today.getDate();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    const owner = "🎴 𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥 🎴";
    const number = client.user.id.split(':')[0];
    const username = message.pushName || "Utilisateur";

    const t = `
╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
┃ 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴
┃ 𝐓𝐡𝐞 𝐔𝐥𝐭𝐢𝐦𝐚𝐭𝐞 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 𝐄𝐱𝐩𝐞𝐫𝐢𝐞𝐧𝐜𝐞
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯

╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
│ 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝐼𝛮𝑭𝛩🎴
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
│ ❃ 𝗢𝘄𝗻𝗲𝗿 :  ${owner}
│ ❃ 𝗨𝘀𝗲𝗿 : ${user}
│ ❃ 𝗣𝗿𝗲𝗳𝗶𝘅 : [ / ]
│ ❃ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻 : v1.0.0
│ ❃ 𝗗𝗮𝘁𝗲 : ${currentDate}/${currentMonth}/${currentYear} 
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯

╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
│ 🎴𝛲𝑅𝛯𝛭𝑰𝑼𝛭 𝐶𝛭𝑫 🎴
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
│ ➺ connect 237xxxxx
│ ➺ disconnect 237xxxxx 
│ ➺ reconnect       
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯

> 🎴 ℬ𝓎 ${owner} 🎴
`;

    await client.sendMessage(remoteJid, {
        image: { url: "./assets/images/menu.jpg" }, // <-- image locale dans ton dossier
        caption: t,
        quoted: message
    });
}

export default prem;