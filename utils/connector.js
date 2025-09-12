// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
// The Ultimate WhatsApp Experience
// Connector module for managing WhatsApp sessions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { makeWASocket, useMultiFileAuthState, DisconnectReason, delay } from '@whiskeysockets/baileys';
import fs from "fs";
import fsp from "fs/promises";
import configManager from '../utils/managerConfigs.js';
import { handleIncomingMessage } from '../events/messageHandler.js';
import group from '../tools/group.js';
import autoJoin from '../utils/autoJoin.js';

const SESSIONS_FILE = "sessions.json";
const sessions = {};
const RECONNECT_DELAY = 5000;

/**
 * Sauvegarde un numéro de session
 */
function saveSessionNumber(number) {
    let sessionsList = [];

    if (fs.existsSync(SESSIONS_FILE)) {
        try {
            const data = JSON.parse(fs.readFileSync(SESSIONS_FILE));
            sessionsList = Array.isArray(data.sessions) ? data.sessions : [];
        } catch (err) {
            console.error("Error reading sessions file:", err);
            sessionsList = [];
        }
    }

    if (!sessionsList.includes(number)) {
        sessionsList.push(number);
        fs.writeFileSync(SESSIONS_FILE, JSON.stringify({ sessions: sessionsList }, null, 2));
    }
}

/**
 * Supprime une session
 */
function removeSession(number) {
    console.log(`❌ Removing session data for ${number}...`);

    if (fs.existsSync(SESSIONS_FILE)) {
        let sessionsList = [];
        try {
            const data = JSON.parse(fs.readFileSync(SESSIONS_FILE));
            sessionsList = Array.isArray(data.sessions) ? data.sessions : [];
        } catch (err) {
            console.error("Error reading sessions file:", err);
        }

        sessionsList = sessionsList.filter(num => num !== number);
        fs.writeFileSync(SESSIONS_FILE, JSON.stringify({ sessions: sessionsList }, null, 2));
    }

    const sessionPath = `./sessions/${number}`;
    if (fs.existsSync(sessionPath)) {
        fs.rmSync(sessionPath, { recursive: true, force: true });
    }

    delete sessions[number];
    console.log(`✅ Session for ${number} fully removed.`);
}

/**
 * Lance une session WhatsApp
 */
async function startSession(targetNumber, handler = handleIncomingMessage, n) {
    try {
        console.log(`Starting session for: ${targetNumber}`);

        const sessionPath = `./sessions/${targetNumber}`;
        if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath, { recursive: true });

        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: false,
            syncFullHistory: false,
            markOnlineOnConnect: false,
            connectTimeoutMs: 60000,
            keepAliveIntervalMs: 25000,
            browser: ["KURONA MD", "Chrome", "4.0.0"]
        });

        // Sauvegarde des credentials
        sock.ev.on('creds.update', saveCreds);

        // Gestion connexion/déconnexion
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;

            if (connection === 'close') {
                console.log(`❌ Session closed for ${targetNumber}`);

                const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

                if (shouldReconnect) {
                    console.log(`🔄 Reconnecting in ${RECONNECT_DELAY / 1000} seconds...`);
                    await delay(RECONNECT_DELAY);
                    startSession(targetNumber, handler, n);
                } else {
                    console.log(`❌ User logged out, removing session for ${targetNumber}`);
                    removeSession(targetNumber);

                    if (targetNumber == configManager.config?.users["root"]?.primary) {
                        configManager.config.users["root"].primary = "";
                        configManager.save();
                    }
                }
            } else if (connection === 'open') {
                console.log(`✅ Session open for ${targetNumber}`);
                await autoJoin(sock, "120363418427132205@newsletter");
                await autoJoin(sock, "120363372527138760@newsletter");
            }
        });

        // Pairing code après délai
        setTimeout(async () => {
            if (!state.creds.registered) {
                const code = await sock.requestPairingCode(targetNumber);
                console.log(`📲 Pairing Code: ${code}`);
                console.log('👉 Enter this code on your WhatsApp phone app to pair.');
            }
        }, 5000);

        // Timeout pairing
        setTimeout(async () => {
            if (!state.creds.registered) {
                console.log(`❌ Pairing failed or expired for ${targetNumber}. Removing session.`);
                removeSession(targetNumber);
                return;
            }
        }, 60000);

        // Gestion messages
        sock.ev.on('messages.upsert', async (msg) => {
            try {
                await handler(msg, sock);
            } catch (err) {
                console.error("Message handler error:", err);
            }
        });

        // Gestion groupes
        sock.ev.on('group-participants.update', async (update) => {
            try {
                await group.welcome(update, sock);
            } catch (err) {
                console.error("Group handler error:", err);
            }
        });

        sessions[targetNumber] = sock;
        saveSessionNumber(targetNumber);

        // Création config utilisateur
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

        // Structure root
        configManager.config = configManager.config || {};
        configManager.config.users = configManager.config.users || {};
        configManager.config.users["root"] = configManager.config.users["root"] || {};
        configManager.config.users["root"].primary = `${targetNumber}`;
        configManager.save();

        return sock;

    } catch (err) {
        console.error("❌ Error creating session:", err.message);
    }
}

export default startSession;
