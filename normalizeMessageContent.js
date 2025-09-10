//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
// 📂 Normalisation des Messages
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * 🔄 Normalise le contenu brut d'un message WhatsApp
 * @param {Object} message - Message brut (Baileys)
 * @returns {Object|null} Message normalisé ou null
 */
export function normalizeMessageContent(message) {
    if (!message || typeof message !== "object") {
        console.warn("⚠️ [🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴] Message invalide reçu");
        return null;
    }

    // 🕶️ Gestion des messages éphémères (viewOnce v2)
    if (message.viewOnceMessageV2?.message) {
        return message.viewOnceMessageV2.message;
    }

    // 🕶️ Gestion des messages éphémères (viewOnce v1)
    if (message.viewOnceMessage?.message) {
        return message.viewOnceMessage.message;
    }

    // ⏳ Gestion des messages temporaires
    if (message.messageContextInfo?.expiration) {
        console.log("⏳ [🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴] Message temporaire détecté");
    }

    // Retourner brut si rien à normaliser
    return message;
}

/**
 * ✍🏾 Extrait le texte d’un message normalisé
 * @param {Object} normalizedMessage - Message normalisé
 * @returns {string} Texte extrait ou ""
 */
export function extractTextFromMessage(normalizedMessage) {
    if (!normalizedMessage) return "";

    if (normalizedMessage.conversation) {
        return normalizedMessage.conversation;
    }

    if (normalizedMessage.extendedTextMessage?.text) {
        return normalizedMessage.extendedTextMessage.text;
    }

    if (normalizedMessage.buttonsResponseMessage?.selectedButtonId) {
        return normalizedMessage.buttonsResponseMessage.selectedButtonId;
    }

    if (normalizedMessage.listResponseMessage?.singleSelectReply?.selectedRowId) {
        return normalizedMessage.listResponseMessage.singleSelectReply.selectedRowId;
    }

    return "";
}

/**
 * 🎨 Vérifie si le message contient un média
 * @param {Object} normalizedMessage - Message normalisé
 * @returns {boolean} True si média détecté
 */
export function hasMedia(normalizedMessage) {
    if (!normalizedMessage) return false;

    return Boolean(
        normalizedMessage.imageMessage ||
        normalizedMessage.videoMessage ||
        normalizedMessage.audioMessage ||
        normalizedMessage.documentMessage ||
        normalizedMessage.stickerMessage ||
        normalizedMessage.contactMessage
    );
}

/**
 * 🎭 Retourne le type de média
 * @param {Object} normalizedMessage - Message normalisé
 * @returns {string|null} Type de média ou null
 */
export function getMediaType(normalizedMessage) {
    if (!normalizedMessage) return null;

    if (normalizedMessage.imageMessage) return "image";
    if (normalizedMessage.videoMessage) return "video";
    if (normalizedMessage.audioMessage) return "audio";
    if (normalizedMessage.documentMessage) return "document";
    if (normalizedMessage.stickerMessage) return "sticker";
    if (normalizedMessage.contactMessage) return "contact";

    return null;
}

/**
 * 🛠️ Récupère les métadonnées (auteur, clé, etc.)
 * @param {Object} message - Message brut
 * @returns {Object} Métadonnées utiles
 */
export function getMessageMeta(message) {
    try {
        return {
            id: message.key?.id || null,
            remoteJid: message.key?.remoteJid || null,
            fromMe: message.key?.fromMe || false,
            participant: message.key?.participant || null,
            timestamp: message.messageTimestamp || null,
        };
    } catch (err) {
        console.error("⚠️ [🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴] Erreur extraction métadonnées:", err);
        return {};
    }
}

export default {
    normalizeMessageContent,
    extractTextFromMessage,
    hasMedia,
    getMediaType,
    getMessageMeta,
};