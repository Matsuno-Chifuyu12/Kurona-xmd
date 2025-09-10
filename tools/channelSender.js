import fs from 'fs';
import path from 'path';

async function channelSender(message, client, texts, num) {
  const remoteJid = message.key.remoteJid;

  // 🔹 Chemin vers /assets/images/NUM.png
  const imagePath = path.resolve('assets', 'images', `2.png`);

  let thumbBuffer;
  try {
    // Lecture de l'image en buffer
    thumbBuffer = fs.readFileSync(imagePath);
  } catch (err) {
    console.error("❌ Thumbnail not found:", err.message);
    thumbBuffer = null; // fallback pour éviter le crash
  }

  await client.sendMessage(remoteJid, {
    image: { url: imagePath }, // Envoie l'image depuis /assets/images/
    caption: `> ${texts}`,
    contextInfo: {
      externalAdReply: {
        title: "Join Our WhatsApp Channel",
        body: "🎴𝛫𝑈𝑅𝛩𝛮𝛥 𝑇𝛯𝐶𝑯🎴", // 🔹 Nom de ma chaîne 
        mediaType: 1,
        ...(thumbBuffer ? { thumbnail: thumbBuffer } : {}), // Evite "null" si absent
        renderLargerThumbnail: false,
        mediaUrl: `${num}.png`,

        sourceUrl: `${num}.png`,
                
        thumbnailUrl: `https:/https://whatsapp.com/channel/0029VbAfBueEKyZLIGi3Yx41`, // lien cliquable
      },
    },
  });
}

export default channelSender;
