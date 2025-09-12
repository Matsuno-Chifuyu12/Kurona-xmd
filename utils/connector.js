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
const RECONNECT_DELAY = 5000;

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

async function startSession(targetNumber, handler = handleIncomingMessage, n) {
    try {
        console.log(`╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴\n|Starting session for: ${targetNumber}\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯`);
        
        const sessionPath = `./sessions/${targetNumber}`;
        if (!fs.existsSync(sessionPath)) {
            fs.mkdirSync(sessionPath, { recursive: true });
        }

        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: false, // Désactivé car on utilise pairing code
            syncFullHistory: false,
            markOnlineOnConnect: false,
            connectTimeoutMs: 60000,
            keepAliveIntervalMs: 25000,
            browser: ["KURONA MD", "Chrome", "4.0.0"],
        });

        // Gestion des erreurs globales du socket
        sock.ws.on('error', (error) => {
            console.error('❌ WebSocket Error:', error.message);
        });

        // Sauvegarde des credentials
        sock.ev.on('creds.update', saveCreds);

        // Génération du pairing code immédiatement
        if (!state.creds.registered) {
            try {
                const code = await sock.requestPairingCode(targetNumber.replace(/[^0-9]/g, ''), "KURONAMD");
                console.log(`╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 📲 PAIRING CODE: ${code}\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯`);
                console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 👉 Enter this code on your WhatsApp phone app to pair\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
            } catch (pairError) {
                console.error('❌ Pairing failed:', pairError.message);
                console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ❌ Failed to generate pairing code\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
            }
        }

        // Gestion de la connexion
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;

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
                console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴 READY!\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
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
    }
}

export default startSession;
