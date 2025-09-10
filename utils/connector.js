// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
//  The Ultimate WhatsApp Experience
// Connector module for managing WhatsApp sessions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { makeWASocket, useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/bailey';
import fs from 'fs';
import fsp from 'fs/promises';
import configManager from '../utils/manageConfigs.js';
import handleIncomingMessage from '../events/messageHandler.js';
import group from '../tools/group.js';
import autoJoin from '../utils/autoJoin.js';

const SESSIONS_FILE = "sessions.json";
const sessions = {};

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
    try {
        console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴 | Starting session for: " + targetNumber + "\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
        const sessionPath = `./sessions/${targetNumber}`;
        if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath, { recursive: true });

        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: false,
            syncFullHistory: false,
            markOnlineOnConnect: false
        });

        // Save credentials
        sock.ev.on('creds.update', saveCreds);

        // Connection updates
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;

            if (connection === 'close') {
                console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ❌ 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴 | Session closed for: " + targetNumber + "\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
                const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

                if (shouldReconnect) {
                    console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🔄 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴 | Attempting to reconnect session for " + targetNumber + "\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
                    startSession(targetNumber, handler);
                } else {
                    console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ❌ 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴 | User logged out. Cleaning session for " + targetNumber + "\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
                    removeSession(targetNumber);

                    if (targetNumber == configManager.config?.users["root"]?.primary) {
                        configManager.config.users["root"].primary = "";
                        configManager.save();
                    }
                }

            } else if (connection === 'open') {
                console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ✅ 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴 | Session open for " + targetNumber + "\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
                // Optional auto-join
                // await autoJoin(sock, "120363418427132205@newsletter");
            }
        });

        // Handle pairing code
        setTimeout(async () => {
            if (!state.creds.registered) {
                const code = await sock.requestPairingCode(targetNumber, "KURONAMD");
                console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 📲 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴 | Pairing Code: " + code + "\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
                console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 👉 Enter this code on your WhatsApp phone app to pair.\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
            }
        }, 5000);

        setTimeout(async () => {
            if (!state.creds.registered) {
                console.log("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ❌ 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴 | Pairing failed or expired for " + targetNumber + ".\n│ Removing session.\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯");
                removeSession(targetNumber);
            }
        }, 60000);

        // Messages handler
        sock.ev.on('messages.upsert', async (msg) => handler(msg, sock));
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

        // Handle group participants
        sock.ev.on('group-participants.update', async (update) => {
            await group.welcome(update, sock);
        });

        return sock;

    } catch (err) {
        console.error("╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ❌ 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴 | Error creating session for " + targetNumber + ":\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯", err.message);
    }
}

export default startSession;
