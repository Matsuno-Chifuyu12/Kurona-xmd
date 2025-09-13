// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴
// The Ultimate WhatsApp Experience
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import readline from "readline";
import startSession from "../utils/connector.js";

// Bannière ASCII
const banner = [
    "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮",
    "│                                                        │",
    "│   ██████╗  █████╗ ███╗   ███╗███████╗██████╗    │",
    "│  ██╔════╝ ██╔══██╗████╗ ████║██╔════╝██╔══██╗  │",
    "│  ██║  ███╗███████║██╔████╔██║█████╗  ██████╔╝  │",
    "│  ██║   ██║██╔══██║██║╚██╔╝██║██╔══╝  ██╔══██╗  │",
    "│  ╚██████╔╝██║  ██║██║ ╚═╝ ██║███████╗██║  ██║  │",
    "│   ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝   │",
    "│                                                       │",
    "│          🎴 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗞𝗨𝗥𝗢𝗡𝗔-𝗫𝗠𝗗 🎴              │",
    "│      💠 𝗧𝗛𝗘 𝗨𝗟𝗧𝗜𝗠𝗔𝗧𝗘 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗘𝗫𝗣𝗘𝗥𝗜𝗘𝗡𝗖𝗘 💠.       │",
    "╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯",
];


function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

async function typewriterBanner() {
  for (const line of banner) {
    for (const char of line) process.stdout.write(char) && await sleep(5);
    process.stdout.write("\n");
    await sleep(50);
  }
}

function promptUserNumber() {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question("📱 Entrez votre numéro WhatsApp : ", answer => { rl.close(); resolve(answer.trim()); });
  });
}

async function connectWithNumber(number, handleMessage) {
  try {
    console.log(`\n🔗 Connexion à WhatsApp avec : ${number}...\n`);
    await startSession(number, handleMessage); // startSession doit retourner socket actif
  } catch (err) {
    console.error("❌ Erreur lors de la connexion :", err);
    process.exit(1);
  }
}

export default async function connectToWhatsApp(handleMessage) {
  await typewriterBanner();
  const number = await promptUserNumber();
  await connectWithNumber(number, handleMessage);
}
