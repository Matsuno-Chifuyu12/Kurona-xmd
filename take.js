// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
//  The Ultimate WhatsApp Experience
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { Sticker, StickerTypes } from "wa-sticker-formatter";
import { downloadMediaMessage } from "@whiskeysockets/bailey";
import fs from "fs";
import path from "path";

export async function take(message, client) {
    const remoteJid = message.key.remoteJid;
    try {
        // Récupération du texte du message
        const messageBody = message.message?.extendedTextMessage?.text || message.message?.conversation || '';
        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        // Extraction des arguments
        const commandAndArgs = messageBody.slice(1).trim();
        const parts = commandAndArgs.split(/\s+/);
        const args = parts.slice(1);

        // Défaut nom auteur/pack
        let author = message.pushName || "🎴𝐃𝛯𝐕 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴";
        let pack = author;

        // Si l'utilisateur fournit un texte
        if (args.length > 0) {
            pack = args.join(" ");
            author = args.join(" ");
        }

        // Vérification du message cité
        if (!quotedMessage || !quotedMessage.stickerMessage) {
            return client.sendMessage(remoteJid, { text: "❌ Réponds à un sticker pour le modifier !" });
        }

        // Téléchargement du sticker
        const stickerBuffer = await downloadMediaMessage({ message: quotedMessage }, "buffer");
        if (!stickerBuffer) {
            return client.sendMessage(remoteJid, { text: "❌ Impossible de télécharger le sticker !" });
        }

        // Création du chemin temporaire sécurisé
        const tempStickerPath = path.join("./temp", `sticker_${Date.now()}.webp`);
        await fs.promises.mkdir(path.dirname(tempStickerPath), { recursive: true });
        await fs.promises.writeFile(tempStickerPath, stickerBuffer);

        // Détection animation
        const isAnimated = quotedMessage.stickerMessage.isAnimated || false;

        // Création du sticker avec meta personnalisée
        const sticker = new Sticker(tempStickerPath, {
            pack,
            author,
            type: isAnimated ? StickerTypes.FULL : StickerTypes.DEFAULT,
            quality: 95,
            animated: isAnimated,
            background: "#FFFFFF"
        });

        // Conversion en message Baileys
        const stickerMessage = await sticker.toMessage();

        // Envoi du sticker modifié
        await client.sendMessage(remoteJid, stickerMessage);

        // Nettoyage
        await fs.promises.unlink(tempStickerPath);

        console.log(`✅ Sticker envoyé avec succès par 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — Pack: "${pack}", Author: "${author}"`);

    } catch (error) {
        console.error("❌ Erreur lors de la modification du sticker:", error);
        await client.sendMessage(remoteJid, { text: "⚠️ Une erreur est survenue lors de la modification du sticker." });
    }
}

export default take;