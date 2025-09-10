export async function react(message, client) {
    if (!message?.key?.remoteJid) return;
    
    try {
        await client.sendMessage(message.key.remoteJid, {
            react: {
                text: '🎴',
                key: message.key
            }
        });
    }
}

export default react;