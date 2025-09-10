import fs from 'fs';
import path from 'path';
import { generateSignedPreKey, useSingleFileAuthState } from '@whiskeysockets/baileys';

// Chemin vers ton fichier d'authentification
const authFile = path.join('./', 'auth_info_baileys.json');

// Charger la session existante
const { state, saveState } = useSingleFileAuthState(authFile);

// Durée maximale en secondes avant de régénérer une signedPreKey (30 jours)
const MAX_AGE = 30 * 24 * 60 * 60; // 30 jours

function isPreKeyExpired() {
    const created = state.creds.signedPreKey?.created || 0;
    const now = Math.floor(Date.now() / 1000);
    return (now - created) >= MAX_AGE;
}

async function regenerateSignedPreKey() {
    const keyId = state.creds.signedPreKey?.keyId || 1;
    const newPreKey = generateSignedPreKey(state.creds.signedIdentityKey, keyId);

    state.creds.signedPreKey = {
        keyId: newPreKey.keyId,
        public: newPreKey.keyPair.public.toString('base64'),
        private: newPreKey.keyPair.private.toString('base64'),
        signature: newPreKey.signature.toString('base64'),
        created: Math.floor(Date.now() / 1000)
    };

    saveState();
    console.log(`✅ Nouvelle signedPreKey générée avec keyId=${keyId} et timestamp=${state.creds.signedPreKey.created}`);
}

async function autoCheckAndRegen() {
    if (isPreKeyExpired()) {
        console.log("⚠️ signedPreKey expirée ou trop vieille. Régénération en cours...");
        await regenerateSignedPreKey();
    } else {
        const created = state.creds.signedPreKey.created;
        console.log(`✅ signedPreKey encore valide (créée le ${new Date(created * 1000).toLocaleString()})`);
    }
}

// Lancer la vérification au démarrage
autoCheckAndRegen().catch(console.error);

// Optionnel : vérifier toutes les 24h automatiquement si le bot tourne en continu
setInterval(autoCheckAndRegen, 24 * 60 * 60 * 1000); // toutes les 24h
