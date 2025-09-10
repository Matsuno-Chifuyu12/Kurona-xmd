//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
// 📂 Session Manager (Multi-device)
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { makeWASocket, useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import configManager from '../utils/manageConfigs.js';
import fs from 'fs';
import path from 'path';
import handleIncomingMessage from '../events/messageHandler.js';
import group from '../tools/group.js';
import autoJoin from '../utils/autoJoin.js';

const SESSIONS_FILE = "sessions.json";
const SESSIONS_DIR = "./sessions";
const sessions = {};

// Assurer que le répertoire "sessions" existe
if (!fs.existsSync(SESSIONS_DIR)) {
    fs.mkdirSync(SESSIONS_DIR, { recursive: true });
}

/*━━━━━━━━━━━━━━━━━━━━━━━
 🔹 Gestion Sessions JSON
━━━━━━━━━━━━━━━━━━━━━━━*/
function loadSessions() {
    if (!fs.existsSync(SESSIONS_FILE)) return [];
    try {
        const data = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf8'));
        return Array.isArray(data.sessions) ? data.sessions : [];
    } catch (err) {
        console.error("⚠️ [🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴] Erreur lecture sessions.json:", err);
        return [];
    }
}

function saveSessions(sessionsList) {
    try {
        fs.writeFileSync(SESSIONS_FILE, JSON.stringify({ sessions: sessionsList }, null, 2));
    } catch (err) {
        console.error("⚠️ [🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴] Erreur sauvegarde sessions.json:", err);
    }
}

function saveSessionNumber(number) {
    const sessionsList = loadSessions();
    if (!sessionsList.includes(number)) {
        sessionsList.push(number);
        saveSessions(sessionsList);
    }
}

function removeSession(number) {
    console.log(`❌ [🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴] Suppression complète de la session ${number}...`);

    // Retirer du sessions.json
    const sessionsList = loadSessions().filter(num => num !== number);
    saveSessions(sessionsList);

    // Supprimer le dossier de session
    const sessionPath = path.join(SESSIONS_DIR, number);
    if (fs.existsSync(sessionPath)) {
        fs.rmSync(sessionPath, { recursive: true, force: true });
    }

    // Supprimer de la mémoire
    delete sessions[number];

    console.log(`✅ [🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴] Session ${number} supprimée avec succès.`);
}

/*━━━━━━━━━━━━━━━━━━━━━━━
 🔹 Initialiser config utilisateur
━━━━━━━━━━━━━━━━━━━━━━━*/
async function initializeSessionConfig(targetNumber) {
    configManager.config = configManager.config || {};
    configManager.config.users = configManager.config.users || {};

    if (!configManager.config.users[targetNumber]) {
        configManager.config.users[targetNumber] = {
            sudoList: [],
            tagAudioPath: "./assets/audio/tag.mp3",
            antilink: false,
            response: true,
            autoreact: false,
            prefix: ".",
            welcome: false,
            record: false,
            type: false,
            like: false,
            online: false,
        };
    }

    configManager.config.users.root = configManager.config.users.root || {};
    configManager.config.users.root.primary = targetNumber;

    configManager.save();
}

/*━━━━━━━━━━━━━━━━━━━━━━━
 🔹 Démarrer une Session
━━━━━━━━━━━━━━━━━━━━━━━*/
async function startSession(targetNumber, handler, isNew = false) {
    try {
        console.log(`🚀 [🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴] Démarrage session pour: ${targetNumber}`);

        const sessionPath = path.join(SESSIONS_DIR, targetNumber);
        if (!fs.existsSync(sessionPath)) {
            fs.mkdirSync(sessionPath, { recursive: true });
        }

        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: false,
            syncFullHistory: false,
            markOnlineOnConnect: false,
            retryRequestDelayMs: 1000,
            maxRetries: 5,
            connectTimeoutMs: 30000,
            keepAliveIntervalMs: 15000
        });

        // Sauvegarder credentials
        sock.ev.on('creds.update', saveCreds);

        // Gestion connexion
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;

            if (connection === 'close') {
                console.log(`⚠️ [🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴] Session fermée: ${targetNumber}`);
                const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

                if (shouldReconnect) {
                    console.log(`♻️ [🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴] Tentative reconnexion ${targetNumber}...`);
                    setTimeout(() => startSession(targetNumber, handler), 5000);
                } else {
                    console.log(`❌ [🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴] Utilisateur déconnecté, suppression ${targetNumber}`);
                    removeSession(targetNumber);

                    if (targetNumber === configManager.config?.users?.root?.primary) {
                        configManager.config.users.root.primary = "";
                        configManager.save();
                    }
                }
            } else if (connection === 'open') {
                console.log(`✅ [🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴] Session active pour ${targetNumber}`);

                // Auto-join newsletters (si définies)
                try {
                    await autoJoin(sock, "120363418427132205@newsletter");
                    await autoJoin(sock, "120363372527138760@newsletter");
                } catch (err) {
                    console.error("⚠️ [🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴] Erreur autoJoin:", err);
                }
            }
        });

        // Demande pairing si non enregistré
        if (!state.creds.registered) {
            setTimeout(async () => {
                if (!state.creds.registered) {
                    try {
                        const code = await sock.requestPairingCode(targetNumber);
                        console.log(`📲 [🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴] Code Pairing: ${code}`);
                        console.log("👉🏾 Ouvre WhatsApp → Appareils connectés → Associer un appareil");
                    } catch (err) {
                        console.error("⚠️ [🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴] Erreur pairing:", err);
                    }
                }
            }, 5000);

            // Timeout pairing
            setTimeout(() => {
                if (!state.creds.registered) {
                    console.log(`⏰ [🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴] Pairing échoué/expiré pour ${targetNumber}. Suppression.`);
                    removeSession(targetNumber);
                }
            }, 60000);
        }

        // Gestion messages
        sock.ev.on('messages.upsert', async (msg) => {
            try {
                await handler(msg, sock);
            } catch (err) {
                console.error("⚠️ [🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴] Erreur handler message:", err);
            }
        });

        // Gestion participants groupe
        sock.ev.on('group-participants.update', async (update) => {
            try {
                await group.welcome(update, sock);
            } catch (err) {
                console.error("⚠️ [🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴] Erreur gestion groupe:", err);
            }
        });

        sessions[targetNumber] = sock;
        saveSessionNumber(targetNumber);

        if (isNew) {
            await initializeSessionConfig(targetNumber);
        }

        return sock;
    } catch (err) {
        console.error("❌ [🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴] Erreur création session:", err);
        throw err;
    }
}

/*━━━━━━━━━━━━━━━━━━━━━━━
 🔹 Fonctions Utilitaires
━━━━━━━━━━━━━━━━━━━━━━━*/
async function stopSession(targetNumber) {
    if (sessions[targetNumber]) {
        try {
            await sessions[targetNumber].end();
            console.log(`🛑 [🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴] Session stoppée: ${targetNumber}`);
        } catch (err) {
            console.error("⚠️ [🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴] Erreur stopSession:", err);
        } finally {
            delete sessions[targetNumber];
        }
    }
}

function getSession(targetNumber) {
    return sessions[targetNumber];
}

function getAllSessions() {
    return { ...sessions };
}

export default {
    startSession,
    stopSession,
    getSession,
    getAllSessions,
    removeSession,
    loadSessions
};
