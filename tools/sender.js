// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
//  The Ultimate WhatsApp Experience
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Envoi de message formaté et uniforme dans tout le bot
 * @param {object} client - Instance '@whiskeysockets/bailey' (connexion)
 * @param {object} message - Message reçu (Baileys event)
 * @param {string} content - Texte à envoyer
 * @param {object} options - Options supplémentaires (mentions, quoted…)
 */

async function sender(client, message, content, options = {}) {
  try {
    const remoteJid = message?.key?.remoteJid;

    if (!remoteJid) {
      console.error("❌ Impossible de déterminer le JID du destinataire.");
      return;
    }

    // Texte formaté façon KURONA XD
    const formattedText = `
> ╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
> ┃   🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
> ┃      *_${content}_*
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯`;

    await client.sendMessage(remoteJid, { text: formattedText, ...options });
  } catch (error) {
    console.error("❌ Erreur dans sender.js :", error);
  }
}

export default sender;
