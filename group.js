//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
// The Ultimate WhatsApp Experience
// Commande : group.js
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { Sequelize, DataTypes } from "sequelize";
import config from "../config.js";

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔹 DB Setup pour Antibot
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const dbUrl = config.DATABASE;
let sequelize;

if (!dbUrl) {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./antibot.sqlite",
    logging: false,
  });
} else {
  sequelize = new Sequelize(dbUrl, {
    dialect: "postgres",
    ssl: true,
    protocol: "postgres",
    dialectOptions: { native: true, ssl: { require: true, rejectUnauthorized: false } },
    logging: false,
  });
}

const Antibot = sequelize.define(
  "Antibot",
  {
    groupId: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    enabled: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { tableName: "Antibot", timestamps: false }
);

(async () => {
  await Antibot.sync();
  console.log("✅ Antibot database ready");
})();

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔹 Variables de contrôle
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
let antimention = false;
let antilinkkick = false;
let antibot = false;

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔹 Toggle Commands
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export function toggleAntimention(message, client) {
  antimention = !antimention;
  client.sendMessage(message.key.remoteJid, {
    text: `⚙️ Antimention ${antimention ? "activé ✅" : "désactivé ❌"}.`,
  });
}

export function toggleAntilinkKick(message, client) {
  antilinkkick = !antilinkkick;
  client.sendMessage(message.key.remoteJid, {
    text: `⚙️ AntilinkKick ${antilinkkick ? "activé ✅" : "désactivé ❌"}.`,
  });
}

export async function toggleAntibot(message, client) {
  antibot = !antibot;

  const jid = message.key.remoteJid;
  try {
    let group = await Antibot.findByPk(jid);
    if (!group) group = await Antibot.create({ groupId: jid, enabled: antibot });
    else group.enabled = antibot;
    await group.save();

    client.sendMessage(jid, { text: `⚙️ Antibot ${antibot ? "activé ✅" : "désactivé ❌"}.` });
  } catch (e) {
    console.error("Erreur toggleAntibot:", e);
  }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔹 Promote / Demote
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function promote(message, client) {
  const remoteJid = message.key.remoteJid;
  const participant = message.message?.extendedTextMessage?.contextInfo?.participant;
  if (!participant) return client.sendMessage(remoteJid, { text: "⚠️ Mentionne un membre." });

  try {
    await client.groupParticipantsUpdate(remoteJid, [participant], "promote");
    await client.sendMessage(remoteJid, { 
      text: `👑 @${participant.split("@")[0]} est maintenant admin.`,
      mentions: [participant] 
    });
  } catch (e) {
    console.error("Erreur promote:", e);
    await client.sendMessage(remoteJid, { text: "❌ Erreur promote." });
  }
}

export async function demote(message, client) {
  const remoteJid = message.key.remoteJid;
  const participant = message.message?.extendedTextMessage?.contextInfo?.participant;
  if (!participant) return client.sendMessage(remoteJid, { text: "⚠️ Mentionne un membre." });

  try {
    await client.groupParticipantsUpdate(remoteJid, [participant], "demote");
    await client.sendMessage(remoteJid, { 
      text: `⬇️ @${participant.split("@")[0]} n’est plus admin.`,
      mentions: [participant] 
    });
  } catch (e) {
    console.error("Erreur demote:", e);
    await client.sendMessage(remoteJid, { text: "❌ Erreur demote." });
  }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔹 Promote/Demote ALL
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function promoteall(message, client) {
  const remoteJid = message.key.remoteJid;
  try {
    const group = await client.groupMetadata(remoteJid);
    const targets = group.participants
      .filter(p => p.admin !== "admin")
      .map(p => p.id);

    await client.groupParticipantsUpdate(remoteJid, targets, "promote");
    await client.sendMessage(remoteJid, { text: "👑 Tous les membres sont maintenant admins." });
  } catch (e) {
    console.error("Erreur promoteall:", e);
    await client.sendMessage(remoteJid, { text: "❌ Erreur promoteall." });
  }
}

export async function demoteall(message, client) {
  const remoteJid = message.key.remoteJid;
  try {
    const group = await client.groupMetadata(remoteJid);
    const targets = group.participants
      .filter(p => p.admin === "admin")
      .map(p => p.id);

    await client.groupParticipantsUpdate(remoteJid, targets, "demote");
    await client.sendMessage(remoteJid, { text: "⬇️ Tous les admins sont rétrogradés." });
  } catch (e) {
    console.error("Erreur demoteall:", e);
    await client.sendMessage(remoteJid, { text: "❌ Erreur demoteall." });
  }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔹 Kick / Kick All / Purge
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function kick(message, client) {
  const remoteJid = message.key.remoteJid;
  const participant = message.message?.extendedTextMessage?.contextInfo?.participant;
  if (!participant) return client.sendMessage(remoteJid, { text: "⚠️ Mentionne un membre." });

  try {
    await client.groupParticipantsUpdate(remoteJid, [participant], "remove");
    await client.sendMessage(remoteJid, { 
      text: `🚫 @${participant.split("@")[0]} expulsé.`,
      mentions: [participant] 
    });
  } catch (e) {
    console.error("Erreur kick:", e);
    await client.sendMessage(remoteJid, { text: "❌ Erreur kick." });
  }
}

export async function kickall(message, client) {
  const remoteJid = message.key.remoteJid;
  try {
    const group = await client.groupMetadata(remoteJid);
    for (const p of group.participants) {
      if (p.admin !== "admin") await client.groupParticipantsUpdate(remoteJid, [p.id], "remove");
    }
    await client.sendMessage(remoteJid, { text: "🚫 Tous les non-admins expulsés." });
  } catch (e) {
    console.error("Erreur kickall:", e);
    await client.sendMessage(remoteJid, { text: "❌ Erreur kickall." });
  }
}

export async function purge(message, client) {
  const remoteJid = message.key.remoteJid;
  try {
    const group = await client.groupMetadata(remoteJid);
    const all = group.participants.map(p => p.id);
    await client.groupParticipantsUpdate(remoteJid, all, "remove");
    await client.sendMessage(remoteJid, { text: "🔥 Tous les membres supprimés." });
  } catch (e) {
    console.error("Erreur purge:", e);
    await client.sendMessage(remoteJid, { text: "❌ Erreur purge." });
  }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔹 Invite
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function invite(message, client) {
  const remoteJid = message.key.remoteJid;
  try {
    const code = await client.groupInviteCode(remoteJid);
    await client.sendMessage(remoteJid, { text: `🔗 Lien du groupe : https://chat.whatsapp.com/${code}` });
  } catch (e) {
    console.error("Erreur invite:", e);
    await client.sendMessage(remoteJid, { text: "❌ Erreur invite." });
  }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔹 Anti Mention / Anti LinkKick / Anti Bot
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function handleGroupMessage(message, client) {
  const remoteJid = message.key.remoteJid;
  const participant = message.key.participant || message.message?.extendedTextMessage?.contextInfo?.participant;
  const text = message.message?.conversation || message.message?.extendedTextMessage?.text || "";

  // --------- Antimention ---------
  if (antimention) {
    const mentions = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (mentions.includes(remoteJid)) {
      try {
        await client.sendMessage(remoteJid, { 
          text: `⚠️ @${participant.split("@")[0]} a mentionné le groupe, suppression de la mention.`, 
          mentions: [participant] 
        });
        await client.sendMessage(remoteJid, { delete: message.key });
      } catch (e) {
        console.error("Erreur antimention:", e);
      }
    }
  }

  // --------- AntilinkKick ---------
  if (antilinkkick) {
    const linkRegex = /(https?:\/\/[^\s]+)/gi;
    if (linkRegex.test(text)) {
      try {
        await client.sendMessage(remoteJid, { delete: message.key });
        await client.groupParticipantsUpdate(remoteJid, [participant], "remove");
        await client.sendMessage(remoteJid, { 
          text: `🚫 @${participant.split("@")[0]} expulsé pour avoir envoyé un lien.`,
          mentions: [participant]
        });
      } catch (e) {
        console.error("Erreur AntilinkKick:", e);
      }
    }
  }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔹 Welcome
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function welcome(update, client) {
  try {
    for (const participant of update.participants) {
      const name = participant.split("@")[0];
      const remoteJid = update.id;

      // Récupérer la description du groupe
      let description = "";
      try {
        const metadata = await client.groupMetadata(remoteJid);
        description = metadata.desc || "Pas de description disponible.";
      } catch {
        description = "Impossible de récupérer la description.";
      }

      if (update.action === "add") {
        const welcomeMessage = `
╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
│     🎴𝛫𝑈𝑅𝛩𝛮𝛥 𝑊𝛯𝐿𝐶𝛩𝛭𝛯 🥳🎴 
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
│  Salut @${name} !
│  Bienvenue dans le groupe ${namegroup}
│  ✨ Description : ${description}  
│  
│ Fais-toi plaisir et participe activement !  
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
        `;
        await client.sendMessage(remoteJid, { text: welcomeMessage, mentions: [participant] });
      }

      if (update.action === "remove") {
        const goodbyeMessage = `
╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
│     🎴𝛫𝑈𝑅𝛩𝛮𝛥 𝑮𝛩𝛩𝑫𝑩𝒀𝛯 😔🎴
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
│  
│  Au revoir @${name} ! Merci d’avoir été parmi nous.  
│  Bon courage pour la suite !  
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
        `;
        await client.sendMessage(remoteJid, { text: goodbyeMessage, mentions: [participant] });
      }
    }
  } catch (e) {
    console.error("Erreur welcome:", e);
  }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔹 Mute / Unmute
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function mute(message, client) {
  const remoteJid = message.key.remoteJid;
  try {
    await client.groupSettingUpdate(remoteJid, "announcement");
    await client.sendMessage(remoteJid, { text: "🔇 Groupe muté." });
  } catch (e) {
    console.error("Erreur mute:", e);
  }
}

export async function unmute(message, client) {
  const remoteJid = message.key.remoteJid;
  try {
    await client.groupSettingUpdate(remoteJid, "not_announcement");
    await client.sendMessage(remoteJid, { text: "🔊 Groupe démuté." });
  } catch (e) {
    console.error("Erreur unmute:", e);
  }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔹 Bye
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function bye(message, client) {
  const remoteJid = message.key.remoteJid;
  try {
    await client.sendMessage(remoteJid, { text: "👋 Le bot quitte le groupe." });
    await client.groupLeave(remoteJid);
  } catch (e) {
    console.error("Erreur bye:", e);
  }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📦 Export
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default {
  promote, demote, promoteall, demoteall,
  kick, kickall, purge, invite,
  toggleAntimention, toggleAntilinkKick, toggleAntibot,
  handleGroupMessage,
  welcome, mute, unmute, bye,
};