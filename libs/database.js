import { database, loadDatabase, saveDatabase } from "../config/database.js";

export const DB = {
  get: (path, fallback = null) => {
    return path.split(".").reduce((o, i) => (o ? o[i] : undefined), database) ?? fallback;
  },

  set: (path, value) => {
    const keys = path.split(".");
    let obj = database;
    while (keys.length > 1) {
      const key = keys.shift();
      if (!obj[key]) obj[key] = {};
      obj = obj[key];
    }
    obj[keys[0]] = value;
    saveDatabase();
  },

  push: (path, value) => {
    const arr = DB.get(path, []);
    if (!Array.isArray(arr)) throw new Error(`[DB] ${path} n'est pas un tableau`);
    arr.push(value);
    DB.set(path, arr);
  },

  delete: (path) => {
    const keys = path.split(".");
    let obj = database;
    while (keys.length > 1) {
      obj = obj[keys.shift()];
    }
    delete obj[keys[0]];
    saveDatabase();
  },

  reload: () => loadDatabase(),
};
