export async function react(message, client) {
    if (!message?.key?.remoteJid) return;
    
    try {
        await client.sendMessage(message.key.remoteJid, {
            react: {
                text: '🎴',
                key: message.key
            }
        });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de la réaction:', error);
        // Vous pouvez choisir de gérer l'erreur différemment selon vos besoins
    }
}

export default react;
