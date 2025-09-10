// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
//  The Ultimate WhatsApp Experience
// commands/showMenu.js
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { menu } from "./info.js";

export async function showMenu(message, client, user) {
    const remoteJid = message.key.remoteJid;
    const date = new Date().toLocaleDateString('fr-FR');
    
    // En-tête du menu avec informations
    const menuHeader = `
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
┃➺ menu
┃➺ premium
┃➺ bug-menu
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
    `.trim();

    // Pied de page statique
    const menuFooter = `
╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
│  🎴 ℬ𝓎  𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
    `.trim();

    // Création des sections du carrousel sans descriptions
    const sections = [
        {
            title: "🧰 UTILS 🧰",
            rows: [
                { title: ".ping" },
                { title: ".uptime" },
                { title: ".device" },
                { title: ".owner" },
                { title: ".sudo" },
                { title: ".delsudo" },
                { title: ".getsudo" },
                { title: ".autoreact" },
                { title: ".setprefix" },
                { title: ".autotype" }
            ],
        },
        {
            title: "📥 DOWNLOADER 📥",
            rows: [
                { title: ".ytmp3" },
                { title: ".ytmp4" },
                { title: ".play" },
                { title: ".tiktok" },
                { title: ".fb" },
                { title: ".ig" },
                { title: ".pin" }
            ],
        },
        {
            title: "👥 GROUP 👥",
            rows: [
                { title: ".promote" },
                { title: ".demote" },
                { title: ".demoteall" },
                { title: ".promoteall" },
                { title: ".kick" },
                { title: ".kickall" },
                { title: ".invite" },
                { title: ".purge" },
                { title: ".antimention" },
                { title: ".antilink" },
                { title: ".antibot" },
                { title: ".welcome" },
                { title: ".mute" },
                { title: ".unmute" },
                { title: ".bye" }
            ],
        },
        {
            title: "💾 MEDIA 💾",
            rows: [
                { title: ".toimg" },
                { title: ".sticker" },
                { title: ".toaudio" },
                { title: ".photo" },
                { title: ".vv" },
                { title: ".take" },
                { title: ".save" }
            ],
        },
        {
            title: "📢 TAG 📢",
            rows: [
                { title: ".tagall" },
                { title: ".tagadmin" },
                { title: ".tag" },
                { title: ".settag" },
                { title: ".respons" }
            ],
        },
    ];

    // Envoi du message avec l'en-tête statique
    await client.sendMessage(remoteJid, {
        text: menuHeader,
        footer: "Défilez horizontalement pour voir les catégories →"
    });

    // Envoi du carrousel sans descriptions
    await client.sendMessage(remoteJid, {
        text: "Choisissez une catégorie :",
        title: "🎴 KURONA-XMD — CATÉGORIES",
        sections
    });

    // Envoi du pied de page statique
    await client.sendMessage(remoteJid, {
        text: menuFooter
    });
}

export default showMenu;
