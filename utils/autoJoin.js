//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 🎴
// 🔗 Auto-Join WhatsApp Newsletter
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { TextEncoder } from 'util';

const SERVER = 's.whatsapp.net';

/**
 * Fonction d’auto-join d’un channel/newsletter WhatsApp
 * @param {object} sock - Instance baileys
 * @param {string} channelId - ID du channel/newsletter
 * @param {object} options - Options supplémentaires
 */
async function autoJoin(sock, channelId, options = {}) {
    const jid = channelId; // ex: "1203630xxxxxxx@newsletter"
    const queryId = '24404358912487870'; // ID statique requis par WA
    const encoder = new TextEncoder();

    // Construction de la requête XMPP
    const joinNode = {
        tag: 'iq',
        attrs: {
            id: sock.generateMessageTag(),
            type: 'get',
            xmlns: 'w:mex',
            to: SERVER,
        },
        content: [
            {
                tag: 'query',
                attrs: { query_id: queryId },
                content: encoder.encode(JSON.stringify({
                    variables: {
                        newsletter_id: jid,
                        ...options
                    }
                }))
            }
        ]
    };

    try {
        const joinResponse = await sock.query(joinNode);

        // Log console côté Dev
        console.log(`✅ [🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴] Join request envoyé pour: ${jid}`);

        // Message formaté pour feedback
        return {
            success: true,
            data: joinResponse,
            message: `
╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
┃      🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
┃ 𝗖𝗵𝗮𝗻𝗻𝗲𝗹 : ${jid}
┃ 𝗦𝘁𝗮𝘁𝘂𝘀 : Success
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
            `
        };

    } catch (err) {
        console.error('❌ [🎴𝛫𝑈𝑅𝛩𝛮𝛥🎴] Erreur autoJoin:', err);

        return {
            success: false,
            error: err,
            message: `
╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮
┃        🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫🎴
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
┃ 𝗖𝗵𝗮𝗻𝗻𝗲𝗹 : ${channelId}
┃ 𝗘𝗿𝗿𝗲𝘂𝗿 : ${err.message}
╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯
            `
        };
    }
}

export default autoJoin;
