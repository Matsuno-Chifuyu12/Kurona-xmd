import pino from "pino";

export const Logger = pino({
  level: "info", // debug | info | warn | error
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
      ignore: "pid,hostname",
    },
  },
});

// Exemple d’utilisation
// Logger.info("Bot démarré");
// Logger.error("Erreur critique");