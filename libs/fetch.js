import axios from "axios";
import { Logger } from "./logger.js";

const instance = axios.create({
  timeout: 15000,
  headers: {
    "User-Agent": "kurona-xmd/1.0.0",
  },
});

export const Fetcher = {
  // GET request
  get: async (url, options = {}) => {
    try {
      const { data } = await instance.get(url, options);
      return data;
    } catch (err) {
      Logger.error(`[FETCH-GET] ${url} → ${err.message}`);
      throw err;
    }
  },

  // POST request
  post: async (url, payload = {}, options = {}) => {
    try {
      const { data } = await instance.post(url, payload, options);
      return data;
    } catch (err) {
      Logger.error(`[FETCH-POST] ${url} → ${err.message}`);
      throw err;
    }
  },

  // Download fichier (buffer)
  download: async (url) => {
    try {
      const { data } = await instance.get(url, { responseType: "arraybuffer" });
      return Buffer.from(data);
    } catch (err) {
      Logger.error(`[FETCH-DOWNLOAD] ${url} → ${err.message}`);
      throw err;
    }
  },
};
