// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
//  The Ultimate WhatsApp Experience
// Vérifie si l'utilisateur est membre du channel ET du groupe
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function isUserInChannel(bot, userId) {
  const CHANNEL_USERNAME = '@kurona_tech_channel';
  const GROUP_USERNAME   = '@kurona_tech';

  try {
    // Récupération des statuts dans le channel et le groupe
    const c_member = await bot.getChatMember(CHANNEL_USERNAME, userId);
    const g_member = await bot.getChatMember(GROUP_USERNAME, userId);

    const validStatuses = ['member', 'administrator', 'creator'];

    const isInChannel = validStatuses.includes(c_member.status);
    const isInGroup   = validStatuses.includes(g_member.status);

    // Log stylisé
    console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴 | Check membership for user " + userId + ": Channel=" + isInChannel + ", Group=" + isInGroup + "\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");

    return isInChannel && isInGroup;

  } catch (error) {
    console.error("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴 | Error checking membership for user " + userId + ":\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯", error.message);
    return false;
  }
}
