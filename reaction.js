import configManager from '../utils/manageConfigs.js';
import channelSender from '../commands/channelSender.js';

export async function auto(message, client, cond, emoji = "🎴") {
    if (!cond || !message?.key?.remoteJid) return;
    
    try {
        await client.sendMessage(message.key.remoteJid, {
            react: { text: emoji, key: message.key }
        });
    } catch (error) {
        console.error("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ Auto-react failed:\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯", error);
    }
}

export async function autoreact(message, client) {
    const number = client.user.id.split(':')[0];
    const remoteJid = message.key?.remoteJid;
    
    if (!remoteJid) return;

    const messageBody = message.message?.extendedTextMessage?.text || 
                       message.message?.conversation || '';
    
    const args = messageBody.slice(1).trim().split(/\s+/);
    const input = args[1]?.toLowerCase();

    if (!input || !['on', 'off'].includes(input)) {
        return client.sendMessage(remoteJid, { text: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ *Usage:*\n│ • !autoreact on\n│ • !autoreact off\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯" });
    }

    try {
        if (!configManager.config.users[number]) {
            configManager.config.users[number] = {};
        }

        configManager.config.users[number].autoreact = input === 'on';
        configManager.save();

        await channelSender(message, client, `╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ Auto-react ${input.toUpperCase()}\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯`, 3);
    } catch (error) {
        await client.sendMessage(remoteJid, {
            text: `╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ❌ Error: ${error.message}\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯`
        });
    }
}

export default { auto, autoreact };