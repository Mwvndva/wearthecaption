const http = require("node:http");
const { URLSearchParams } = require("node:url");
const { readCaps, findCap, registerCap } = require("./store");
const {
  homePage,
  registerPage,
  registeredPage,
  verifyPage,
  notFoundPage
} = require("./views");

const port = Number(process.env.PORT || 3000);

function send(res, status, html) {
  res.writeHead(status, {
    "content-type": "text/html; charset=utf-8",
    "cache-control": "no-store"
  });
  res.end(html);
}

function redirect(res, location) {
  res.writeHead(303, { location });
  res.end();
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function capIdFromPath(pathname, prefix) {
  return decodeURIComponent(pathname.slice(prefix.length)).trim().toUpperCase();
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.replace(/\/+$/, "") || "/";

  try {
    if (req.method === "GET" && pathname === "/") {
      return send(res, 200, homePage(readCaps()));
    }

    if (req.method === "GET" && pathname.startsWith("/register/")) {
      const capId = capIdFromPath(pathname, "/register/");
      return send(res, 200, registerPage(findCap(capId)));
    }

    if (req.method === "POST" && pathname.startsWith("/register/")) {
      const capId = capIdFromPath(pathname, "/register/");
      const params = new URLSearchParams(await readBody(req));
      const owner = {
        name: params.get("name")?.trim(),
        email: params.get("email")?.trim().toLowerCase(),
        instagram: params.get("instagram")?.trim(),
        city: params.get("city")?.trim()
      };

      if (!owner.name || !owner.email) {
        return send(res, 400, registerPage(findCap(capId), "Name and email are required."));
      }

      const result = registerCap(capId, owner);

      if (!result.ok && result.reason === "already_registered") {
        return redirect(res, `/verify/${encodeURIComponent(capId)}`);
      }

      if (!result.ok) {
        return send(res, 404, notFoundPage());
      }

      return redirect(res, `/registered/${encodeURIComponent(capId)}`);
    }

    if (req.method === "GET" && pathname.startsWith("/registered/")) {
      const capId = capIdFromPath(pathname, "/registered/");
      const cap = findCap(capId);
      return send(res, cap ? 200 : 404, cap ? registeredPage(cap) : notFoundPage());
    }

    if (req.method === "GET" && pathname.startsWith("/verify/")) {
      const capId = capIdFromPath(pathname, "/verify/");
      const cap = findCap(capId);
      return send(res, cap ? 200 : 404, cap ? verifyPage(cap) : notFoundPage());
    }

    return send(res, 404, notFoundPage());
  } catch (error) {
    console.error(error);
    return send(res, 500, notFoundPage());
  }
});

server.listen(port, () => {
  console.log(`CAPTION ownership system running at http://localhost:${port}`);
});
