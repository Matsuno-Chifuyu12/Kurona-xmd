// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴
// Vérifie la validité des codes d'authentification | Validateur de Code Premium
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { OWNER_ID } from "../config.js";

export default function isValidCode(code) {
    try {
        console.log("🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴 | Début de validation du code...");
        
        // Décodage du code base64
        const decoded = Buffer.from(code, "base64").toString();
        console.log("🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴 | Code décodé:", decoded);
        
        // Séparation de l'ID utilisateur et de la date d'expiration
        const [id, expiry] = decoded.split("|");
        
        // Conversion des valeurs
        const idNum = id;
        const expiryNum = Number(expiry);
        
        // Vérification de l'utilisateur
        if (OWNER_ID !== idNum) {
            console.log("🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴 | ❌ Échec: ID utilisateur invalide");
            return false;
        }
        
        // Vérification de l'expiration
        if (Date.now() > expiryNum) {
            console.log("🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴 | ❌ Échec: Code expiré");
            return false;
        }
        
        // Calcul du temps restant
        const remainingTime = expiryNum - Date.now();
        const remainingDays = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        
        console.log(`🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴 | ✅ Succès: Code valide (${remainingDays} jours restants)`);
        return true;
        
    } catch (error) {
        console.log("🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴 | ❌ Erreur lors du décodage du code:", error.message);
        return false;
    }
}
