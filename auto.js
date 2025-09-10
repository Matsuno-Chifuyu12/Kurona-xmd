import configManager from '../utils/manageConfigs.js';

// Cache utilisateur
const userNumberCache = new Map();

// Obtenir le numéro de l’utilisateur
function getUserNumber(client) {
    if (!client?.user?.id) return null;
    const clientId = client.user.id;
    if (userNumberCache.has(clientId)) return userNumberCache.get(clientId);
    const number = clientId.split(':')[0];
    userNumberCache.set(clientId, number);
    return number;
}

// Mise à jour de présence sécurisée
async function updatePresenceSafely(client, presence, remoteJid) {
    try {
        await client.sendPresenceUpdate(presence, remoteJid);
        return true;
    } catch (error) {
        console.error("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ [AUTO] Erreur présence (" + presence + "):\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯", error.message);
        return false;
    }
}

// Timeout pour annuler après x secondes
const timeoutHandlers = new Map();

function clearExistingTimeout(remoteJid) {
    if (timeoutHandlers.has(remoteJid)) {
        clearTimeout(timeoutHandlers.get(remoteJid));
        timeoutHandlers.delete(remoteJid);
    }
}

// Activer le mode auto-record
export async function autorecord(message, client) {
    if (!message?.key?.remoteJid || !client) return;
    const remoteJid = message.key.remoteJid;
    const number = getUserNumber(client);
    if (!number) return;

    const state = configManager.config?.users[number]?.record;
    if (!state) return;

    clearExistingTimeout(remoteJid);
    const success = await updatePresenceSafely(client, 'recording', remoteJid);

    if (success) {
        const timeoutId = setTimeout(async () => {
            await updatePresenceSafely(client, 'available', remoteJid);
            timeoutHandlers.delete(remoteJid);
        }, 5000);
        timeoutHandlers.set(remoteJid, timeoutId);
    }
}

// Activer le mode auto-type
export async function autotype(message, client) {
    if (!message?.key?.remoteJid || !client) return;
    const remoteJid = message.key.remoteJid;
    const number = getUserNumber(client);
    if (!number) return;

    const state = configManager.config?.users[number]?.type;
    if (!state) return;

    clearExistingTimeout(remoteJid);
    const success = await updatePresenceSafely(client, 'composing', remoteJid);

    if (success) {
        const timeoutId = setTimeout(async () => {
            await updatePresenceSafely(client, 'available', remoteJid);
            timeoutHandlers.delete(remoteJid);
        }, 5000);
        timeoutHandlers.set(remoteJid, timeoutId);
    }
}

// Nettoyage complet
export function cleanupPresenceTimers() {
    for (const timeoutId of timeoutHandlers.values()) clearTimeout(timeoutId);
    timeoutHandlers.clear();
    userNumberCache.clear();
}

export default { autorecord, autotype, cleanupPresenceTimers };