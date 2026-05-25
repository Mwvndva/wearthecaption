const { writeCaps } = require("./store");

const phrases = [
  ["WUEH", "WUEH"],
  ["MAMBO", "MAMBO NI MENGI"],
  ["SINAPRESSURE", "SINA PRESSURE"],
  ["USINIHARAKISHE", "USINIHARAKISHE"],
  ["TUMAFARE", "TUMA FARE"]
];

const caps = [];
const createdAt = "2026-05-25T00:00:00.000Z";

for (const [slug, phrase] of phrases) {
  for (let index = 1; index <= 20; index += 1) {
    caps.push({
      capId: `CAP-001-${slug}-${String(index).padStart(4, "0")}`,
      drop: "001",
      phrase,
      status: "unregistered",
      owner: null,
      source: "drop-001",
      createdAt
    });
  }
}

writeCaps(caps);
console.log(`Seeded ${caps.length} cap IDs.`);
