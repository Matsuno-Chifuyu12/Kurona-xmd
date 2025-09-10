import { database, isUser, incrementCommand } from "./database.js";
import { botSettings } from "./settings.js";

export async function handleIncomingMessage(sock, m) {
  const senderJid = m.key.participant || m.key.remoteJid;
  const from = m.key.remoteJid;
  const prefix = botSettings.prefix;
  const textMsg = m.message?.conversation || m.message?.extendedTextMessage?.text || "";

  if (!textMsg.startsWith(prefix)) return;

  const args = textMsg.slice(prefix.length).trim().split(/\s+/);
  const command = args.shift().toLowerCase();

  const isPremium = isUser(senderJid, "premium");
  const isCreator = isUser(senderJid, "creator");

  incrementCommand(command, senderJid);

  try {
    const commandModule = await import(`./commands/${command}.js`);
    if (typeof commandModule.default === "function") {
      await commandModule.default(m, sock, args, { isPremium, isCreator, database });
    }
  } catch (err) {
    await sock.sendMessage(from, { text: `❌ Commande inconnue ou erreur: ${command}` });
    console.error(err);
  }
}
