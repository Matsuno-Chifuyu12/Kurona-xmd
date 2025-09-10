// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
//  Bouton.js — Gestion des messages interactifs
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import jimp from "jimp";

/**
 * Fonction pour envoyer des boutons interactifs
 * @param {object} client - Instance du bot (sock Baileys)
 * @param {object} message - Message d'origine (pour répondre)
 */
async function bouton(client, message) {
  try {
    const jid = message.key.remoteJid;

    // Exemple 1 : simple texte avec boutons
    await client.sendMessage(
      jid,
      {
        text: "📌 Description du message",
        title: "✨ Titre du message",
        subtitle: "🔖 Sous-titre",
        footer: "🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴",
        interactiveButtons: [
          {
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
              display_text: "✅ Bouton Réponse",
              id: "btn_reply",
            }),
          },
          {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
              display_text: "🌐 Voir le site",
              url: "https://www.example.com",
            }),
          },
        ],
      },
      { quoted: message }
    );

    // Exemple 2 : message avec image
    await client.sendMessage(
      jid,
      {
        image: { url: "2.png" },
        caption: "📌 Description avec image",
        title: "✨ Titre de l’image",
        subtitle: "🔖 Sous-titre",
        footer: "🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴",
        media: true,
        interactiveButtons: [
          {
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
              display_text: "✅ Répondre",
              id: "btn_reply_img",
            }),
          },
          {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
              display_text: "🌐 Lien",
              url: "https://www.example.com",
            }),
          },
        ],
      },
      { quoted: message }
    );

    // Exemple 3 : produit (header)
    await client.sendMessage(
      jid,
      {
        product: {
          productImage: { url: "3.png" },
          productImageCount: 1,
          title: "🎁 Produit Exemple",
          description: "Un bel objet interactif",
          priceAmount1000: 20000 * 1000,
          currencyCode: "USD",
          retailerId: "Retailer01",
          url: "https://example.com",
        },
        businessOwnerJid: "123456789@s.whatsapp.net",
        caption: "📌 Produit interactif",
        title: "✨ Catalogue",
        footer: "🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴",
        media: true,
        interactiveButtons: [
          {
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
              display_text: "🛒 Acheter",
              id: "btn_buy",
            }),
          },
          {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
              display_text: "🌐 Voir plus",
              url: "https://www.example.com",
            }),
          },
        ],
      },
      { quoted: message }
    );
  } catch (err) {
    console.error("Erreur bouton.js :", err);
  }
}

export default bouton;