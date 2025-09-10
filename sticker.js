import { Sticker, StickerTypes } from "wa-sticker-formatter";
import { downloadMediaMessage } from "@whiskeysockets/bailey";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import ffmpeg from "fluent-ffmpeg";

export async function sticker(message, client) {
    const remoteJid = message.key.remoteJid;
    const username = message.pushName || "Utilisateur";
    let tempInput, tempOutput;

    try {
        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quotedMessage) {
            return client.sendMessage(remoteJid, { 
                text: "❌ Répondez à une image ou vidéo pour la convertir en sticker!\n\nUtilisation: .sticker (en réponse à une image/vidéo)" 
            });
        }

        // Détection du type de média
        const isVideo = !!quotedMessage.videoMessage;
        const isImage = !!quotedMessage.imageMessage;

        if (!isVideo && !isImage) {
            return client.sendMessage(remoteJid, { 
                text: "❌ Le message cité n'est pas une image ou une vidéo!\n\nUtilisation: .sticker (en réponse à une image/vidéo)" 
            });
        }

        // Envoi d'un message de traitement
        await client.sendMessage(remoteJid, { 
            text: "🔄 Traitement en cours... Création de votre sticker  🎴 𝛫𝑈𝑅𝛩𝛮𝛥 🎴" 
        });

        // Téléchargement du média
        const mediaBuffer = await downloadMediaMessage({ 
            message: quotedMessage, 
            client 
        }, "buffer");

        if (!mediaBuffer) {
            return client.sendMessage(remoteJid, { text: "❌ Échec du téléchargement du média!" });
        }

        // Chemins des fichiers temporaires dans le dossier assets/temp
        const tempDir = path.join(process.cwd(), 'assets', 'temp');
        await fs.mkdir(tempDir, { recursive: true });
        
        const timestamp = Date.now();
        tempInput = path.join(tempDir, isVideo ? `temp_video_${timestamp}.mp4` : `temp_image_${timestamp}.jpg`);
        tempOutput = path.join(tempDir, `temp_sticker_${timestamp}.webp`);

        await fs.writeFile(tempInput, mediaBuffer);

        if (isVideo) {
            console.log("⚙️ Traitement de la vidéo pour le sticker  🎴 𝛫𝑈𝑅𝛩𝛮𝛥 🎴...");
            await processVideo(tempInput, tempOutput);
        } else {
            console.log("⚙️ Traitement de l'image pour le sticker  🎴 𝛫𝑈𝑅𝛩𝛮𝛥 🎴...");
            await sharp(tempInput)
                .resize(512, 512, { 
                    fit: "inside",
                    withoutEnlargement: true,
                    kernel: sharp.kernel.lanczos3 
                })
                .webp({ 
                    quality: 85, // Qualité légèrement augmentée
                    effort: 3 // Équilibre entre vitesse et compression
                })
                .toFile(tempOutput);
        }

        // Création du sticker avec branding KURONA
        const sticker = new Sticker(tempOutput, {
            pack: `🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴`,
            author: `Par ${username}`,
            type: isVideo ? StickerTypes.FULL : StickerTypes.DEFAULT,
            quality: 90,
            animated: isVideo,
        });

        // Conversion et envoi
        const stickerMessage = await sticker.toMessage();
        await client.sendMessage(remoteJid, stickerMessage, {
            quoted: message
        });

    } catch (error) {
        console.error("❌ Erreur  🎴 𝛫𝑈𝑅𝛩𝛮𝛥 🎴 Sticker:", error);
        await client.sendMessage(remoteJid, { 
            text: "⚠️ Erreur lors de la conversion en sticker. Veuillez réessayer.\n\nSi le problème persiste, contactez 🎴 𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴" 
        });
    } finally {
        // Nettoyage des fichiers temporaires
        await cleanupFiles(tempInput, tempOutput);
    }
}

// Fonction optimisée pour le traitement vidéo
async function processVideo(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .outputOptions([
                "-vf", "scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=yuv420p",
                "-c:v", "libwebp",
                "-q:v", "60", // Qualité vidéo légèrement augmentée
                "-preset", "picture",
                "-loop", "0",
                "-an", // Pas d'audio
                "-vsync", "0",
                "-compression_level", "6",
                "-threads", "4" // Utilisation de plus de threads pour plus de performance
            ])
            .on("start", (cmdline) => {
                console.log("🚀 Lancement de la conversion vidéo  🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴");
            })
            .on("progress", (progress) => {
                if (progress.percent) {
                    console.log(`📊 Progression: ${Math.round(progress.percent)}%`);
                }
            })
            .on("end", () => {
                console.log("✅ Conversion vidéo  🎴 𝛫𝑈𝑅𝛩𝛮𝛥 🎴 terminée");
                resolve();
            })
            .on("error", (err) => {
                console.error("❌ Erreur de conversion vidéo  🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴:", err);
                reject(err);
            })
            .save(outputPath);
    });
}

// Nettoyage asynchrone des fichiers temporaires
async function cleanupFiles(...files) {
    for (const file of files) {
        if (file) {
            try {
                await fs.access(file);
                await fs.unlink(file);
                console.log(`🧹 Fichier temporaire supprimé: ${file}`);
            } catch (err) {
                // Fichier déjà supprimé ou inexistant - on ignore l'erreur
            }
        }
    }
}

export default sticker;