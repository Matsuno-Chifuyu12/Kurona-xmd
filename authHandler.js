// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴
// The Ultimate WhatsApp Experience
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { makeWASocket, useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';

import readline from 'readline';
import configManager from '../utils/manageConfigs.js';
import startSession from '../utils/connector.js';
import moment from 'moment';

const banner = [
  "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮",
  "│                                               │",
  "│   ▄████  ▄▄▄       ███▄ ▄███▓ ██▓ ███▄    █   │",
  "│  ██▒ ▀█▒▒████▄    ▓██▒▀█▀ ██▒▓██▒ ██ ▀█   █   │",
  "│ ▒██░▄▄▄░▒██  ▀█▄  ▓██    ▓██░▒██▒▓██  ▀█ ██▒  │",
  "│ ░▓█  ██▓░██▄▄▄▄██ ▒██    ▒██ ░██░▓██▒  ▐▌██▒  │",
  "│ ░▒▓███▀▒ ▓█   ▓██▒▒██▒   ░██▒░██░▒██░   ▓██░  │",
  "│  ░▒   ▒  ▒▒   ▓▒█░░ ▒░   ░  ░░▓  ░ ▒░   ▒ ▒   │",
  "│   ░   ░   ▒   ▒▒ ░░  ░      ░ ▒ ░░ ░░   ░ ▒░  │",
  "│ ░ ░   ░   ░   ▒   ░      ░    ▒ ░   ░   ░ ░   │",
  "│       ░       ░  ░       ░    ░           ░   │",
  "│                                               │",
  "│  🎴 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗞𝗨𝗥𝗢𝗡𝗔-𝗫𝗠𝗗 🎴            │",
  "│  💠 𝗧𝗛𝗘 𝗨𝗟𝗧𝗜𝗠𝗔𝗧𝗘 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗘𝗫𝗣𝗘𝗥𝗜𝗘𝗡𝗖𝗘 💠 │",
  
 "╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯"
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function typewriterBanner() {
  for (let line of banner) {
    let output = "";
    for (let char of line) {
      output += char;
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

        rl.question('📲 Entrez votre numéro WhatsApp (avec code pays, ex: 2376xxxxxx) : ', (number) => {
            rl.close();
            const trimmed = number.trim();
            if (!/^\d+$/.test(trimmed)) {
                console.log('⚠️ Numéro invalide. Veuillez entrer uniquement des chiffres.');
                process.exit(1);
            }
            resolve(trimmed);
        });
    });
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
    
    console.log(`
╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮            
┃          🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴            
┃    𝐓𝐡𝐞 𝐔𝐥𝐭𝐢𝐦𝐚𝐭𝐞 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 𝐄𝐱𝐩𝐞𝐫𝐢𝐞𝐧𝐜𝐞            
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯            
`);

     await typewriterBanner();

    // Vérification du numéro primaire dans config
    const primary = configManager.config?.users?.root?.primary;

    if (!primary) {
        const number = await promptUserNumber();
        await connectWithNumber(number, true, handleMessage);
    } else {
        await connectWithNumber(primary, false, handleMessage);
    }
}

export default connectToWhatsApp;