const fs = require("node:fs");
const path = require("node:path");
const { readCaps } = require("./store");

const baseUrl = process.env.BASE_URL || "https://wearthecaption.com";
const outDir = path.join(__dirname, "..", "exports");
const outPath = path.join(outDir, "qr-links.csv");

fs.mkdirSync(outDir, { recursive: true });

const rows = [
  "cap_id,phrase,thank_you_note_registration_qr_url,inside_cap_identity_qr_url",
  ...readCaps().map((cap) => [
    cap.capId,
    `"${cap.phrase.replaceAll('"', '""')}"`,
    `${baseUrl}/register/${encodeURIComponent(cap.capId)}`,
    `${baseUrl}/verify/${encodeURIComponent(cap.capId)}`
  ].join(","))
];

fs.writeFileSync(outPath, rows.join("\n") + "\n", "utf8");
console.log(outPath);
