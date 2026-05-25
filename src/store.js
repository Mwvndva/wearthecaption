const fs = require("node:fs");
const path = require("node:path");

const dataPath = path.join(__dirname, "..", "data", "caps.json");

function readCaps() {
  return JSON.parse(fs.readFileSync(dataPath, "utf8"));
}

function writeCaps(caps) {
  fs.writeFileSync(dataPath, JSON.stringify(caps, null, 2) + "\n", "utf8");
}

function findCap(capId) {
  return readCaps().find((cap) => cap.capId === capId.toUpperCase());
}

function registerCap(capId, owner) {
  const caps = readCaps();
  const normalizedId = capId.toUpperCase();
  const index = caps.findIndex((cap) => cap.capId === normalizedId);

  if (index === -1) {
    return { ok: false, reason: "not_found" };
  }

  if (caps[index].status === "registered") {
    return { ok: false, reason: "already_registered", cap: caps[index] };
  }

  caps[index] = {
    ...caps[index],
    status: "registered",
    owner: {
      name: owner.name,
      email: owner.email,
      instagram: owner.instagram || "",
      city: owner.city || "",
      registeredAt: new Date().toISOString()
    }
  };

  writeCaps(caps);
  return { ok: true, cap: caps[index] };
}

module.exports = {
  readCaps,
  writeCaps,
  findCap,
  registerCap
};
