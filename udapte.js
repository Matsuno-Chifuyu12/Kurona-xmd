//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
// Update System
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import channelSender from '../commands/channelSender.js';

// 📌 Infos chemin
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📂 Répertoires spécifiques à ton projet
const tempDir = path.join(__dirname, '../assets/temp/.update');
const backupDir = path.join(__dirname, '../config/session/.backup');
const repoURL = 'https://github.com/Matsuno-chifuyu12/kurona-xmd';

// ❌ Exclusions importantes
const EXCLUDE_LIST = new Set([
  '.git',
  'node_modules',
  '.env',
  'config.json',
  'sessions',
  'auth',
  '.update',
  '.backup'
]);

// 📌 Vérifie existence
async function fileExists(filePath) {
  try { await fs.access(filePath); return true; } catch { return false; }
}

// 📌 Copie récursive avec exclusions
async function copyFolderContents(src, dest, onProgress = null) {
  if (!await fileExists(src)) return;
  const entries = await fs.readdir(src, { withFileTypes: true });
  let copied = 0, total = entries.length;

  for (const entry of entries) {
    if (EXCLUDE_LIST.has(entry.name)) {
      copied++; if (onProgress) onProgress(copied, total);
      continue;
    }
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (!await fileExists(destPath)) await fs.mkdir(destPath, { recursive: true });
      await copyFolderContents(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }

    copied++; if (onProgress) onProgress(copied, total);
  }
}

// 📌 Backup complet
async function createBackup() {
  try {
    if (await fileExists(backupDir)) await fs.rm(backupDir, { recursive: true, force: true });
    await fs.mkdir(backupDir, { recursive: true });
    await copyFolderContents(path.join(__dirname, '../'), backupDir);
    console.log('✅ Backup created');
    return true;
  } catch (e) {
    console.error('❌ Backup failed:', e);
    return false;
  }
}

// 📌 Restauration
async function restoreBackup() {
  try {
    if (await fileExists(backupDir)) {
      console.log('🔄 Restoring from backup...');
      await copyFolderContents(backupDir, path.join(__dirname, '../'));
      console.log('✅ Backup restored');
      return true;
    }
    return false;
  } catch (e) {
    console.error('❌ Restore failed:', e);
    return false;
  }
}

// 📌 Exécuter une commande
function executeCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'], ...options });
    let stdout = '', stderr = '';

    child.stdout.on('data', d => stdout += d.toString());
    child.stderr.on('data', d => stderr += d.toString());

    child.on('close', code => {
      if (code === 0) resolve(stdout);
      else reject(new Error(`Command failed [${code}]: ${stderr}`));
    });

    setTimeout(() => { child.kill('SIGTERM'); reject(new Error('Command timeout')); }, 120000);
  });
}

// 📌 Install des dépendances
async function installDependencies() {
  try {
    if (await fileExists(path.join(__dirname, '../package.json'))) {
      console.log('📦 Installing deps...');
      await executeCommand('npm', ['install', '--production'], { cwd: path.join(__dirname, '../') });
      console.log('✅ Deps installed');
    }
  } catch (e) {
    console.error('⚠️ Install failed:', e.message);
  }
}

// 📌 Commande principale
async function update(message, client) {
  const remoteJid = message.key.remoteJid;
  let success = false;

  try {
    const user = message.pushName || "Utilisateur";
    const today = new Date().toLocaleDateString();

    // Message initial
    await client.sendMessage(remoteJid, { text: "🔄 Mise à jour en cours...\nCela peut prendre quelques minutes." });

    console.log('🔄 Backup en cours...');
    if (!await createBackup()) throw new Error("Impossible de créer une sauvegarde");

    console.log('📥 Clonage GitHub...');
    if (await fileExists(tempDir)) await fs.rm(tempDir, { recursive: true, force: true });
    await executeCommand('git', ['clone', '--depth', '1', repoURL, tempDir]);

    console.log('🔁 Copie des fichiers...');
    await copyFolderContents(tempDir, path.join(__dirname, '../'), (cur, tot) => {
      const percent = Math.round((cur / tot) * 100);
      console.log(`Progression: ${percent}%`);
    });

    await installDependencies();

    // ✅ Succès
    success = true;
    await client.sendMessage(remoteJid, {
      text: `
╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
┃      🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
┃❃ 𝗨𝘀𝗲𝗿 : ${user}
┃❃ 𝗗𝗮𝘁𝗲 : ${today}
┃❃ 𝗩𝗲𝗿𝘀𝗶𝗼𝗻 : v1.0.0
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
┃     𝑴𝒊𝒔𝒆 à 𝒋𝒐𝒖𝒓 𝒓é𝒖𝒔𝒔𝒊𝒆 ! ✅ 
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
>  🎴 ℬ𝓎  𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥🎴`
    });

    // Redémarrage
    setTimeout(() => process.exit(0), 2500);

  } catch (e) {
    console.error('❌ Update failed:', e);
    await restoreBackup();
    await client.sendMessage(remoteJid, { text: `❌ Update failed: ${e.message}\nSystem restored.` });
  } finally {
    if (await fileExists(tempDir)) await fs.rm(tempDir, { recursive: true, force: true });
    if (success) {
      try {
        await channelSender(message, client, "🎴 Bot 𝛫𝑈𝑅𝛩𝛮𝛥🎴 mis à jour avec succès !", 2);
      } catch (err) { console.error("Channel notify fail:", err); }
    }
  }
}

export default update;