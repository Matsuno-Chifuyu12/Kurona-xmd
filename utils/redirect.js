// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
//  redirect.js
// Redirige l'utilisateur vers un autre bot si tous sont occupés
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { REDIRECT_BOT } from '../config.js';

export async function redirect(bot, msg) {
    try {
        if (!REDIRECT_BOT || REDIRECT_BOT.toLowerCase() === 'none') {
            console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴 | No redirect bot set.\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
            await bot.sendMessage(msg.chat.id, 
`╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
│ ⚠️ Sorry, all our bots are currently busy.
│ 
│ Please try again later or contact us
│ directly through our group to get
│ premium access at $2 (1000 Fcfa).
│ 
│ Thank you for using 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴!
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯`);
        } else {
            console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴 | Redirecting user to: " + REDIRECT_BOT + "\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
            await bot.sendMessage(msg.chat.id, 
`╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
│ 🚫 Oups! This bot is currently full.
│ 
│ Kindly redirect yourself to our next
│ available free bot:
│ 👉🏾 ${REDIRECT_BOT}
│ 
│ Thank you for using 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴!
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯`);
        }
    } catch (error) {
        console.error("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ❌ 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴 | Error in redirect function:\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯", error.message);
    }
}

export default redirect;
