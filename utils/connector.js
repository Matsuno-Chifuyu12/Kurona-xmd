// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
//  The Ultimate WhatsApp Experience
// Connector module for managing WhatsApp sessions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { makeWASocket, useMultiFileAuthState, DisconnectReason, delay } from '@whiskeysockets/baileys';
import fs from 'fs';
import fsp from 'fs/promises';
import configManager from '../utils/managerConfigs.js';
import { handleIncomingMessage } from '../events/messageHandler.js';
import group from '../tools/group.js';
import autoJoin from '../utils/autoJoin.js';

const SESSIONS_FILE = "sessions.json";
const sessions = {};
const RECONNECT_DELAY = 5000; // 5 secondes entre les reconnexions

/**
 * Save a session number in the sessions.json file
 */
function saveSessionNumber(number) {
    let sessionsList = [];

    if (fs.existsSync(SESSIONS_FILE)) {
        try {
            const data = JSON.parse(fs.readFileSync(SESSIONS_FILE));
            sessionsList = Array.isArray(data.sessions) ? data.sessions : [];
        } catch (err) {
            console.error("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴 | Error reading sessions file:\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯", err.message);
            sessionsList = [];
        }
    }

    if (!sessionsList.includes(number)) {
        sessionsList.push(number);
        fs.writeFileSync(SESSIONS_FILE, JSON.stringify({ sessions: sessionsList }, null, 2));
        console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴 | Session number " + number + " saved.\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
    }
}

/**
 * Remove a session and clean up files
 */
function removeSession(number) {
    console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ❌ 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴 | Removing session data for " + number + "\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");

    if (fs.existsSync(SESSIONS_FILE)) {
        let sessionsList = [];
        try {
            const data = JSON.parse(fs.readFileSync(SESSIONS_FILE));
            sessionsList = Array.isArray(data.sessions) ? data.sessions : [];
        } catch (err) {
            console.error("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴 | Error reading sessions file:\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯", err.message);
        }

        sessionsList = sessionsList.filter(num => num !== number);
        fs.writeFileSync(SESSIONS_FILE, JSON.stringify({ sessions: sessionsList }, null, 2));
    }

    const sessionPath = `./sessions/${number}`;
    if (fs.existsSync(sessionPath)) fs.rmSync(sessionPath, { recursive: true, force: true });

    delete sessions[number];
    console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ✅ 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴 | Session for " + number + " fully removed.\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
}

/**
 * Start a WhatsApp session for a target number
 */
async function startSession(targetNumber, handler = handleIncomingMessage, n) {
    let pairingTimeout;

    try {
        console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴 | Starting session for: " + targetNumber + "\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
        
        const sessionPath = `./sessions/${targetNumber}`;
        
        // Nettoyer la session si elle existe déjà et est corrompue
        if (fs.existsSync(sessionPath)) {
            const credsFile = `${sessionPath}/creds.json`;
            if (fs.existsSync(credsFile)) {
                try {
                    const creds = JSON.parse(fs.readFileSync(credsFile));
                    if (creds.noiseKey && creds.noiseKey.private && creds.noiseKey.public) {
                        console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ✅ Using existing session\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
                    }
                } catch (e) {
                    console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🗑️ Removing corrupted session\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
                    fs.rmSync(sessionPath, { recursive: true, force: true });
                }
            }
        }

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
            logger: console,
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

            if (connection === 'open' && pairingTimeout) {
                clearTimeout(pairingTimeout);
            }

            if (connection === 'close') {
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                console.log(`❌ Connection closed with status: ${statusCode}`);
                
                if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
                    console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ❌ User logged out or session revoked\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
                    removeSession(targetNumber);
                    
                    // Gestion de l'utilisateur root
                    if (targetNumber == configManager.config?.users["root"]?.primary) {
                        configManager.config.users["root"].primary = "";
                        configManager.save();
                    }
                    
                    // Réessayer avec une nouvelle session après délai
                    await delay(10000);
                    console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🔄 Attempting fresh session...\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
                    return startSession(targetNumber, handler, n);
                }

                // Reconnexion avec délai pour autres erreurs
                console.log(`🔄 Reconnecting in ${RECONNECT_DELAY/1000} seconds...`);
                await delay(RECONNECT_DELAY);
                startSession(targetNumber, handler, n);
                
            } else if (connection === 'open') {
                console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ✅ Connected successfully!\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
                
                // Optional auto-join
                // await autoJoin(sock, "120363418427132205@newsletter");
            }
        });

        // Gestion du pairing code
        if (!state.creds.registered) {
            try {
                const code = await sock.requestPairingCode(targetNumber.replace(/[^0-9]/g, ''), "KURONAMD");
                console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 📲 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴 | Pairing Code: " + code + "\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
                console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 👉 Enter this code on your WhatsApp phone app to pair.\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
                
                // Timeout de pairing (2 minutes)
                pairingTimeout = setTimeout(async () => {
                    if (!state.creds.registered) {
                        console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ❌ 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴 | Pairing failed or expired for " + targetNumber + ".\n│ Removing session.\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
                        removeSession(targetNumber);
                    }
                }, 120000);
            } catch (pairError) {
                console.error('❌ Pairing failed:', pairError.message);
            }
        }

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

        // Create user config if n is set
        if (n) {
            configManager.config.users[`${targetNumber}`] = {
                sudoList: [],
                tagAudioPath: "tag.mp3",
                antilink: false,
                response: true,
                autoreact: false,
                prefix: ".",
                welcome: false,
                record: false,
                type: false,
            };
            configManager.save();
        }

        // Ensure root user structure
        configManager.config = configManager.config || {};
        configManager.config.users = configManager.config.users || {};
        configManager.config.users["root"] = configManager.config.users["root"] || {};
        configManager.config.users["root"].primary = `${targetNumber}`;
        configManager.save();

        return sock;

    } catch (err) {
        console.error("❌ Critical error in startSession:", err.message);
        // Tentative de reconnexion après erreur critique
        await delay(RECONNECT_DELAY);
        return startSession(targetNumber, handler, n);
    } finally {
        // Nettoyer le timeout si présent
        if (pairingTimeout) {
            clearTimeout(pairingTimeout);
        }
    }
}

export default startSession;
