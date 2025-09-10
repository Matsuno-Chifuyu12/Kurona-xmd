//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴
// Gestionnaire de sessions WhatsApp Multi-Device
// Créateur : 🎴𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { makeWASocket, useMultiFileAuthState, DisconnectReason } from "@whiskeysockets/bailey";
import configManager from '../utils/manageConfigs.js';
import fs from "fs";
import sender from '../tools/sender.js';
import handleIncomingMessage from '../events/messageHandler.js';

const BOT_NAME = "🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴";
const CREATOR = "🎴𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴";

const SESSIONS_FILE = "./sessions.json";
const sessions = {};

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Sauvegarde et suppression des sessions
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function saveSessionNumber(number) {
    let sessionsList = [];

    if (fs.existsSync(SESSIONS_FILE)) {
        try {
            const data = JSON.parse(fs.readFileSync(SESSIONS_FILE));
            sessionsList = Array.isArray(data.sessions) ? data.sessions : [];
        } catch (err) {
            console.error(`[${BOT_NAME}] ⚠️ Erreur lecture sessions:`, err);
            sessionsList = [];
        }
    }

    if (!sessionsList.includes(number)) {
        sessionsList.push(number);
        fs.writeFileSync(SESSIONS_FILE, JSON.stringify({ sessions: sessionsList }, null, 2));
        console.log(`[${BOT_NAME}] ✅ Session sauvegardée pour ${number}`);
    }
}

function removeSession(number) {
    console.log(`[${BOT_NAME}] ❌ Suppression de la session ${number}...`);

    if (fs.existsSync(SESSIONS_FILE)) {
        let sessionsList = [];
        try {
            const data = JSON.parse(fs.readFileSync(SESSIONS_FILE));
            sessionsList = Array.isArray(data.sessions) ? data.sessions : [];
        } catch (err) {
            console.error(`[${BOT_NAME}] ⚠️ Erreur lecture sessions:`, err);
            sessionsList = [];
        }

        sessionsList = sessionsList.filter(num => num !== number);
        fs.writeFileSync(SESSIONS_FILE, JSON.stringify({ sessions: sessionsList }, null, 2));
    }

    const sessionPath = `./sessions/${number}`;
    if (fs.existsSync(sessionPath)) {
        fs.rmSync(sessionPath, { recursive: true, force: true });
    }

    delete sessions[number];
    console.log(`[${BOT_NAME}] ✅ Session ${number} supprimée avec succès.`);
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Démarrage d'une session
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function startSession(targetNumber, message, client) {
    console.log(`[${BOT_NAME}] 🚀 Démarrage de la session pour ${targetNumber}`);

    const sessionPath = `./sessions/${targetNumber}`;
    if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath, { recursive: true });

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        syncFullHistory: false,
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'close') {
            console.log(`[${BOT_NAME}] 🔌 Session fermée pour ${targetNumber}`);

            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                console.log(`[${BOT_NAME}] 🔄 Tentative de reconnexion à ${targetNumber}...`);
                await startSession(targetNumber, message, client);
            } else {
                console.log(`[${BOT_NAME}] ❌ Déconnexion détectée, suppression de la session ${targetNumber}`);
                removeSession(targetNumber);
            }
        } else if (connection === 'open') {
            console.log(`[${BOT_NAME}] ✅ Session active pour ${targetNumber}`);
        }
    });

    setTimeout(async () => {
        if (!state.creds.registered) {
            const code = await sock.requestPairingCode(targetNumber);
            sender(message, client, `${code}`);
            console.log(`[${BOT_NAME}] 📲 Code d’appairage généré pour ${targetNumber}`);
        }
    }, 5000);

    setTimeout(async () => {
        if (!state.creds.registered) {
            console.log(`[${BOT_NAME}] ❌ Échec ou expiration de l’appairage pour ${targetNumber}`);
            sender(message, client, `❌ Pairing échoué pour ${targetNumber}. Réessayez dans 2 minutes.`);
            removeSession(targetNumber);
        }
    }, 60000);

    sock.ev.on('messages.upsert', async (msg) => handleIncomingMessage(msg, sock));
    sock.ev.on('creds.update', saveCreds);

    console.log(`[${BOT_NAME}] ✅ Session établie pour ${targetNumber}`);

    sessions[targetNumber] = sock;
    saveSessionNumber(targetNumber);

    // Config par défaut
    configManager.config.users[`${targetNumber}`] = {
        sudoList: [],
        tagAudioPath: "tag.mp3",
        antilink: false,
        response: true,
        autoreact: false,
        prefix: ".",
        reaction: "🌹",
        welcome: false,
        record: false,
        type: false
    };

    configManager.save();
    return sock;
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Reconnexion automatique
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function reconnect(client) {
    if (!fs.existsSync(SESSIONS_FILE)) return;

    const data = JSON.parse(fs.readFileSync(SESSIONS_FILE));
    const sessionNumbers = Array.isArray(data.sessions) ? data.sessions : [];

    for (const number of sessionNumbers) {
        console.log(`[${BOT_NAME}] 🔄 Reconnexion session: ${number}`);
        try {
            await startSession(number, null, client);
        } catch (error) {
            console.error(`[${BOT_NAME}] ❌ Erreur reconnexion ${number}:`, error);
            removeSession(number);
        }
    }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Connexion manuelle
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function connect(message, client) {
    let targetNumber;

    if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
        targetNumber = message.message.extendedTextMessage.contextInfo.participant;
    } else {
        const messageBody = message.message?.extendedTextMessage?.text || message.message?.conversation || '';
        const parts = messageBody.split(/\s+/);
        targetNumber = parts[1];
    }

    if (!targetNumber) {
        sender(message, client, `❌ [${BOT_NAME}] Fournis un numéro ou réponds à un message pour te connecter.`);
        return;
    }

    targetNumber = targetNumber.replace('@s.whatsapp.net', '').trim();

    console.log(`[${BOT_NAME}] 🔍 Vérification connexion pour ${targetNumber}`);

    if (sessions[targetNumber]) {
        sender(message, client, `[${BOT_NAME}] Ce numéro est déjà connecté.`);
    } else {
        await startSession(targetNumber, message, client);
    }
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Exports
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default { connect, reconnect };

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`   ${BOT_NAME} prêt à fonctionner`);
console.log(`   Créateur : ${CREATOR}`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
