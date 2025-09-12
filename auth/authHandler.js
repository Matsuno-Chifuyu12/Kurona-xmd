// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴
// The Ultimate WhatsApp Experience
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { makeWASocket, useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import readline from 'readline';
import p from 'path';

// Définir AUTH_FOLDER ici pour qu'elle soit accessible
const AUTH_FOLDER = p.join(process.cwd(), 'auth_baileys');

// Gestion d'erreur pour l'importation de configManager
let configManager;
try {
  configManager = (await import("../utils/managerConfigs.js")).default;
} catch (e) {
  console.log("⚠️ Using default configuration");
  configManager = { config: { bot: { name: "Kurona-XMD", version: "1.0.0" } } };
}

// Bannière ASCII
const banner = [
    "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮",
    "│                                             │",
    "│   ██████╗  █████╗ ███╗   ███╗███████╗██████╗ │",
    "│  ██╔════╝ ██╔══██╗████╗ ████║██╔════╝██╔══██╗│",
    "│  ██║  ███╗███████║██╔████╔██║█████╗  ██████╔╝│",
    "│  ██║   ██║██╔══██║██║╚██╔╝██║██╔══╝  ██╔══██╗│",
    "│  ╚██████╔╝██║  ██║██║ ╚═╝ ██║███████╗██║  ██║│",
    "│   ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝│",
    "│                                             │",
    "│  🎴 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗞𝗨𝗥𝗢𝗡𝗔-𝗫𝗠𝗗 🎴            │",
    "│  💠 𝗧𝗛𝗘 𝗨𝗟𝗧𝗜𝗠𝗔𝗧𝗘 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗘𝗫𝗣𝗘𝗥𝗜𝗘𝗡𝗖𝗘 💠 │",
    "╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯",
];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function typewriterBanner() {
    for (let line of banner) {
        for (let char of line) {
            process.stdout.write(char);
            await sleep(5); // vitesse d'apparition, 5ms par caractère
        }
        process.stdout.write("\n");
        await sleep(50); // pause entre chaque ligne
    }
}

// Fonction pour récupérer le numéro utilisateur via CLI
async function promptUserNumber() {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question("📱 Entrez votre numéro WhatsApp : ", (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

// Fonction simplifiée pour lancer la session WhatsApp
async function startSession(number, handleMessage, firstTime = false) {
    try {
        console.log(`🔗 Connexion à WhatsApp avec le numéro : ${number}...`);
        
        const { state, saveCreds } = await useMultiFileAuthState(AUTH_FOLDER);
        const { version } = await fetchLatestBaileysVersion();
        
        const sock = makeWASocket({
            version,
            logger: Pino({ level: "silent" }),
            printQRInTerminal: true,
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: "fatal" })),
            },
        });

        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === 'close') {
                const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
                console.log(shouldReconnect ? 'Connection closed. Reconnecting...' : 'Connection closed. You are logged out.');
            } else if (connection === 'open') {
                console.log('Connected successfully!');
            }
        });

        sock.ev.on('creds.update', saveCreds);
        sock.ev.on('messages.upsert', handleMessage);

        return sock;
    } catch (err) {
        console.error('❌ Erreur lors de la connexion à WhatsApp :', err);
        throw err;
    }
}

// Fonction pour lancer la session WhatsApp
async function connectWithNumber(number, firstTime = false, handleMessage) {
    try {
        console.log(`\n🔗 Connexion à WhatsApp avec le numéro : ${number}...\n`);
        await startSession(number, handleMessage, firstTime);
    } catch (err) {
        console.error('❌ Erreur lors de la connexion à WhatsApp :', err);
        process.exit(1);
    }
}

// Fonction principale pour connecter le bot
async function connectToWhatsApp(handleMessage) {
    await typewriterBanner();

    console.log(`
╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
┃          🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴
┃    𝐓𝐡𝐞 𝐔𝐥𝐭𝐢𝐦𝐚𝐭𝐞 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 𝐄𝐱𝐩𝐞𝐫𝐢𝐞𝐧𝐜𝐞
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
    `);

    const number = await promptUserNumber();
    await connectWithNumber(number, true, handleMessage);
}

export default connectToWhatsApp;
