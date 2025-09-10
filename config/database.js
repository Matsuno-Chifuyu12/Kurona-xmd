import fs from "fs";
import path from "path";
import { users as defaultUsers, autoFeatures } from "./settings.js";

const dbPath = path.resolve("./database.json");

const defaultDB = {
  users: { ...defaultUsers },
  groups: {},
  chats: {},
  media: {},
  commands: {},
  autoFeatures: { ...autoFeatures },
};

export let database = {};

export const loadDatabase = () => {
  try {
    if (!fs.existsSync(dbPath)) {
      saveDatabase(defaultDB);
    }
    database = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
    console.log("[DB] Database loaded successfully");
  } catch (err) {
    console.error("[DB] Error loading database:", err);
    database = defaultDB;
    saveDatabase(defaultDB);
  }
};

export const saveDatabase = (data = database) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("[DB] Error saving database:", err);
  }
};

// ─────────── Users ───────────
export const addUser = (jid, type = "premium") => {
  if (!database.users[type].includes(jid)) {
    database.users[type].push(jid);
    saveDatabase();
  }
};
export const removeUser = (jid, type = "premium") => {
  database.users[type] = database.users[type].filter(u => u !== jid);
  saveDatabase();
};
export const isUser = (jid, type = "premium") => database.users[type].includes(jid);

// ─────────── Groups ───────────
export const addGroup = (groupId, data = {}) => {
  database.groups[groupId] = { ...data };
  saveDatabase();
};
export const updateGroup = (groupId, data = {}) => {
  if (database.groups[groupId]) {
    database.groups[groupId] = { ...database.groups[groupId], ...data };
    saveDatabase();
  }
};
export const removeGroup = (groupId) => {
  delete database.groups[groupId];
  saveDatabase();
};

// ─────────── Media ───────────
export const addMedia = (mediaId, info) => {
  database.media[mediaId] = info;
  saveDatabase();
};
export const getMedia = (mediaId) => database.media[mediaId] || null;
export const removeMedia = (mediaId) => {
  delete database.media[mediaId];
  saveDatabase();
};

// ─────────── Commands ───────────
export const incrementCommand = (command, jid) => {
  if (!database.commands[command]) database.commands[command] = {};
  if (!database.commands[command][jid]) database.commands[command][jid] = 0;
  database.commands[command][jid] += 1;
  saveDatabase();
};

// ─────────── Auto Features ───────────
export const toggleFeature = (feature, state) => {
  if (feature in database.autoFeatures) {
    database.autoFeatures[feature] = state;
    saveDatabase();
  }
};

loadDatabase();
