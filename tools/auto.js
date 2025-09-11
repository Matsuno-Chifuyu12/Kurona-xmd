import configManager from '../utils/managerConfigs.js';

// Cache utilisateur
const userNumberCache = new Map();

// Obtenir le numéro de l'utilisateur
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
        console.error("Erreur présence (" + presence + "):", error.message);
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

// Fonctions de base pour auto.js
export function respons(msg, sock) {
    // Fonction de réponse automatique
    console.log("Auto response feature");
}

export function autotype(msg, sock) {
    if (!msg?.key?.remoteJid || !sock) return;
    const remoteJid = msg.key.remoteJid;
    const number = getUserNumber(sock);
    if (!number) return;

    const state = configManager.config?.users[number]?.type;
    if (!state) return;

    clearExistingTimeout(remoteJid);
    updatePresenceSafely(sock, 'composing', remoteJid).then(success => {
        if (success) {
            const timeoutId = setTimeout(async () => {
                await updatePresenceSafely(sock, 'available', remoteJid);
                timeoutHandlers.delete(remoteJid);
            }, 5000);
            timeoutHandlers.set(remoteJid, timeoutId);
        }
    });
}

// Nettoyage complet
export function cleanupPresenceTimers() {
    for (const timeoutId of timeoutHandlers.values()) clearTimeout(timeoutId);
    timeoutHandlers.clear();
    userNumberCache.clear();
}

export default { respons, autotype, cleanupPresenceTimers };
