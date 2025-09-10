//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴
// The Ultimate WhatsApp Experience
// Commande : media.js
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { downloadMediaMessage } from "@whiskeysockets/bailey";

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🖼️ STICKER → PHOTO
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function photo(message, client) {
    try {
        const remoteJid = message.key.remoteJid;
        const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const target = quoted?.stickerMessage;

        if (!target) {
            return await client.sendMessage(remoteJid, { text: "⚠️ Aucun sticker trouvé." });
        }

        const buffer = await downloadMediaMessage({ message: quoted, client }, "buffer");

        const tempDir = "./assets/temp";
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        const filename = path.join(tempDir, `sticker-${Date.now()}.png`);
        fs.writeFileSync(filename, buffer);

        await client.sendMessage(remoteJid, {
            image: fs.readFileSync(filename),
            caption: "✨ Converti avec succès\n> 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴"
        });

        fs.unlinkSync(filename);
    } catch (e) {
        console.error("Erreur photo:", e);
        await client.sendMessage(message.key.remoteJid, { text: "❌ Erreur lors de la conversion du sticker en image." });
    }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎵 VIDEO → MP3
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export async function tomp3(message, client) {
    try {
        const remoteJid = message.key.remoteJid;
        const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const target = quoted?.videoMessage;

        if (!target) {
            return await client.sendMessage(remoteJid, { text: "⚠️ Aucune vidéo trouvée." });
        }

        const buffer = await downloadMediaMessage({ message: quoted, client }, "buffer");

        const tempDir = "./assets/temp";
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        const inputPath = path.join(tempDir, `video-${Date.now()}.mp4`);
        const outputPath = path.join(tempDir, `audio-${Date.now()}.mp3`);

        fs.writeFileSync(inputPath, buffer);

        await new Promise((resolve, reject) => {
            exec(`ffmpeg -i "${inputPath}" -vn -ab 128k -ar 44100 -y "${outputPath}"`, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        await client.sendMessage(remoteJid, {
            audio: fs.readFileSync(outputPath),
            mimetype: "audio/mp4",
            ptt: false
        });

        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
    } catch (e) {
        console.error("Erreur tomp3:", e);
        await client.sendMessage(message.key.remoteJid, { text: "❌ Erreur lors de la conversion vidéo → audio." });
    }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXPORT
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default { photo, tomp3 };