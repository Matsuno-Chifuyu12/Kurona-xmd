// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
//  The Ultimate WhatsApp Experience
// Connector module for managing WhatsApp sessions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { makeWASocket, useMultiFileAuthState, DisconnectReason, delay } from '@whiskeysockets/baileys';
import fs from 'fs';
import configManager from '../utils/managerConfigs.js';
import { handleIncomingMessage } from '../events/messageHandler.js';
import group from '../tools/group.js';

const SESSIONS_FILE = "sessions.json";
const sessions = {};
const RECONNECT_DELAY = 5000; // 5 secondes entre les reconnexions

function saveSessionNumber(number) {
    // [Votre code existant]
}

function removeSession(number) {
    // [Votre code existant]
}

async function startSession(targetNumber, handler = handleIncomingMessage, n) {
    try {
        console.log(`╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🎴 𝛫 𝑈 𝑅 𝛩 𝛮 𝛥 — 𝑿 𝛭 𝑫 🎴 |\n Starting session for: ${targetNumber}\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯`);
        
        const sessionPath = `./sessions/${targetNumber}`;
        if (!fs.existsSync(sessionPath)) {
            fs.mkdirSync(sessionPath, { recursive: true });
        }

        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: false,
            syncFullHistory: false,
            markOnlineOnConnect: false,
            // Ajout de options de connexion plus robustes
            connectTimeoutMs: 60000,
            keepAliveIntervalMs: 25000,
            browser: ["KURONA MD", "Chrome", "4.0.0"],
            logger: console, // Active les logs pour debug
        });

        // Gestion des erreurs globales du socket
        sock.ws.on('error', (error) => {
            console.error('❌ WebSocket Error:', error.message);
        });

        // Sauvegarde des credentials
        sock.ev.on('creds.update', saveCreds);

        // Gestion de la connexion
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;
            
            if (qr) {
                console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 📱 QR Code Generated\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
            }

            if (connection === 'close') {
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                console.log(`❌ Connection closed with status: ${statusCode}`);
                
                if (statusCode === DisconnectReason.loggedOut) {
                    console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ❌ User logged out\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
                    removeSession(targetNumber);
                    return;
                }

                // Reconnexion avec délai
                console.log(`🔄 Reconnecting in ${RECONNECT_DELAY/1000} seconds...`);
                await delay(RECONNECT_DELAY);
                startSession(targetNumber, handler, n);
                
            } else if (connection === 'open') {
                console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ✅ Connected successfully!\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
                
                // Vérification de l'enregistrement
                if (!state.creds.registered) {
                    try {
                        const code = await sock.requestPairingCode(targetNumber.replace(/[^0-9]/g, ''), "KURONAMD");
                        console.log(`╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 📲 Pairing Code: ${code}\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯`);
                    } catch (pairError) {
                        console.error('❌ Pairing failed:', pairError.message);
                    }
                }
            }
        });

        // Gestion des messages
        sock.ev.on('messages.upsert', async (msg) => {
            try {
                await handler(msg, sock);
            } catch (error) {
                console.error('❌ Message handler error:', error.message);
            }
        });

        // Gestion des groupes
        sock.ev.on('group-participants.update', async (update) => {
            try {
                await group.welcome(update, sock);
            } catch (error) {
                console.error('❌ Group handler error:', error.message);
            }
        });

        sessions[targetNumber] = sock;
        saveSessionNumber(targetNumber);

        // [Le reste de votre code config...]

        return sock;

    } catch (err) {
        console.error("❌ Critical error in startSession:", err.message);
        // Tentative de reconnexion après erreur critique
        await delay(RECONNECT_DELAY);
        return startSession(targetNumber, handler, n);
    }
}

export default startSession;
