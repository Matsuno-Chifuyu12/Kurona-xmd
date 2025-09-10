// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
//  The Ultimate WhatsApp Experience
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import axios from 'axios';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import axiosRetry from 'axios-retry';

// Configuration des retries pour axios
axiosRetry(axios, { 
    retries: 3, 
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
        return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.code === 'ECONNABORTED';
    }
});

export async function video(message, client) {
    const remoteJid = message.key.remoteJid;
    const username = message.pushName || "Utilisateur";
    let tempFilePath = null;

    try {
        const messageBody = (
            message.message?.extendedTextMessage?.text ||
            message.message?.conversation ||
            ''
        ).toLowerCase();

        // Extraction de l'URL depuis le message
        const url = getArg(messageBody);

        if (!url || !isValidUrl(url)) {
            await client.sendMessage(remoteJid, {
                text: "❌ Veuillez fournir une URL vidéo valide.\n\nUtilisation: `.video <url>`",
                quoted: message
            });
            return;
        }

        console.log(`🎴 KURONA - Extraction d'URL: ${url}`);

        // Message de traitement
        await client.sendMessage(remoteJid, {
            text: `🔄 *Traitement en cours...*\n\n> _Téléchargement de la vidéo depuis l'URL fournie..._`,
            quoted: message
        });

        // Appel de l'API de téléchargement
        const response = await axios.post(
            'https://downloader-api-7mul.onrender.com/api/download',
            { url },
            { 
                responseType: 'json',
                timeout: 30000 // Timeout de 30 secondes
            }
        );

        const downloadLink = response.data.filepath;
        const videoTitle = response.data.title || 'Vidéo KURONA';
        const thumbnail = response.data.thumbnail;

        if (!downloadLink) {
            throw new Error("L'API n'a pas retourné de lien de téléchargement valide");
        }

        // Création du dossier temp s'il n'existe pas
        const tempDir = path.join(process.cwd(), 'assets', 'temp');
        await fs.mkdir(tempDir, { recursive: true });
        
        const fileName = `kURONA_${uuidv4()}.mp4`;
        tempFilePath = path.join(tempDir, fileName);

        console.log(`⬇️ Téléchargement vidéo 🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴depuis: ${downloadLink}`);

        // Téléchargement de la vidéo
        const videoResponse = await axios({
            method: 'GET',
            url: downloadLink,
            responseType: 'stream',
            timeout: 60000 // Timeout de 60 secondes pour le téléchargement
        });

        // Correction: Création du writer avec fs.createWriteStream
        const writer = (await fs.open(tempFilePath, 'w')).createWriteStream();
        videoResponse.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', (err) => {
                console.error("❌ Erreur d'écriture fichier 🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴:", err);
                reject(new Error('Échec de sauvegarde du fichier vidéo.'));
            });
        });

        console.log(`✅ Vidéo téléchargée: ${tempFilePath}`);

        // Vérification que le fichier existe et a une taille valide
        const stats = await fs.stat(tempFilePath);
        if (stats.size === 0) {
            throw new Error("Le fichier téléchargé est vide");
        }

        // Correction: Utilisation de videoTitle au lieu de video.title
        await client.sendMessage(remoteJid, {
            image: { url: thumbnail },
            caption: `
> ╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
> │       🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑉𝐼𝐷𝐸𝛩🎥🎴 
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
> │  ♧𝐓𝐢𝐭𝐫𝐞 : *${videoTitle}* 
> ╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
> \n📥 Téléchargement réussi\n👤 Demandé par: ${username}\n\n 🎴 *𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫* 🎴
> 🎴 ℬ𝓎  𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴`,
            quoted: message
        });

        // Envoi de la vidéo
        await client.sendMessage(remoteJid, {
            video: { url: tempFilePath },
            mimetype: 'video/mp4',
            caption: `🎥 ${videoTitle}\n\n⚡ *Téléchargé par 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴*`,
            quoted: message
        });

        console.log(`✅ Vidéo envoyée avec succès`);

    } catch (err) {
        console.error('❌ Erreur dans la commande video KURONA:', err);
        
        let errorMessage = "❌ Échec du téléchargement: ";
        if (err.response) {
            errorMessage += `API Error: ${err.response.status} - ${err.response.data?.message || 'Unknown error'}`;
        } else if (err.code === 'ECONNABORTED') {
            errorMessage += "Timeout - Le serveur a mis trop de temps à répondre";
        } else if (err.message.includes('network')) {
            errorMessage += "Problème de réseau - Vérifiez votre connexion";
        } else {
            errorMessage += err.message;
        }

        errorMessage += "\n\n🎴 *KURONA Support*: Contactez 𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥 🎴";

        await client.sendMessage(remoteJid, {
            text: errorMessage,
            quoted: message
        });
    } finally {
        // Nettoyage du fichier temporaire
        if (tempFilePath) {
            try {
                await fs.access(tempFilePath);
                await fs.unlink(tempFilePath);
                console.log(`🧹 Fichier temporaire KURONA supprimé: ${tempFilePath}`);
            } catch (cleanupErr) {
                console.warn("⚠️ Impossible de supprimer le fichier temporaire:", cleanupErr);
            }
        }
    }
}

// Extraction des arguments depuis le corps du message
function getArg(body) {
    if (!body || typeof body !== 'string') return null;
    
    const parts = body.trim().split(/\s+/);
    if (parts.length < 2) return null;
    
    // Retourne le premier argument après la commande
    return parts[1];
}

// Validation d'URL
function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

export default video;