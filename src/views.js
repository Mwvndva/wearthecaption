function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function layout({ title, eyebrow = "CAPTION.", body }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} | CAPTION</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #ffffff;
      --ink: #050505;
      --muted: #6f6f6f;
      --line: #e8e8e8;
      --soft: #f6f6f6;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-height: 100vh;
      background: var(--bg);
      color: var(--ink);
      font-family: Arial, Helvetica, sans-serif;
      letter-spacing: 0;
    }

    main {
      width: min(100%, 560px);
      min-height: 100vh;
      margin: 0 auto;
      padding: 34px 22px;
      display: flex;
      flex-direction: column;
    }

    .brand {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 56px;
    }

    .logo {
      font-size: 20px;
      font-weight: 900;
      color: var(--ink);
      text-decoration: none;
      line-height: 1;
    }

    .handle {
      color: var(--muted);
      font-size: 13px;
    }

    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-bottom: 44px;
    }

    .eyebrow {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--muted);
      margin: 0 0 18px;
    }

    h1 {
      margin: 0;
      font-size: clamp(38px, 11vw, 72px);
      line-height: 0.95;
      font-weight: 900;
      letter-spacing: 0;
    }

    p {
      margin: 18px 0 0;
      color: var(--muted);
      font-size: 16px;
      line-height: 1.55;
    }

    .card {
      margin-top: 28px;
      border: 1px solid var(--line);
      background: var(--soft);
      padding: 20px;
    }

    .cap-id {
      display: inline-flex;
      margin-top: 20px;
      padding: 10px 12px;
      background: var(--ink);
      color: var(--bg);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 1px;
    }

    label {
      display: block;
      margin: 18px 0 7px;
      font-size: 12px;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 700;
    }

    input {
      width: 100%;
      border: 1px solid var(--line);
      background: var(--bg);
      color: var(--ink);
      font: inherit;
      font-size: 17px;
      padding: 15px 14px;
      outline: none;
    }

    input:focus { border-color: var(--ink); }

    button, .button {
      width: 100%;
      border: 1px solid var(--ink);
      background: var(--ink);
      color: var(--bg);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 54px;
      margin-top: 24px;
      padding: 0 18px;
      font: inherit;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      text-decoration: none;
      cursor: pointer;
    }

    .button.secondary {
      background: var(--bg);
      color: var(--ink);
    }

    dl {
      display: grid;
      grid-template-columns: 1fr;
      gap: 14px;
      margin: 28px 0 0;
    }

    dt {
      color: var(--muted);
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }

    dd {
      margin: 5px 0 0;
      font-size: 20px;
      font-weight: 800;
    }

    .footer {
      color: var(--muted);
      font-size: 12px;
      line-height: 1.5;
      border-top: 1px solid var(--line);
      padding-top: 18px;
    }
  </style>
</head>
<body>
  <main>
    <header class="brand">
      <a class="logo" href="/">CAPTION.</a>
      <span class="handle">@wearthecaption</span>
    </header>
    <section class="content">
      <p class="eyebrow">${escapeHtml(eyebrow)}</p>
      ${body}
    </section>
    <footer class="footer">Wear the caption. Black caps with relatable Nairobi statements.</footer>
  </main>
</body>
</html>`;
}

function homePage(caps) {
  const rows = caps
    .map((cap) => `<div class="card">
      <strong>${escapeHtml(cap.phrase)}</strong>
      <p>${escapeHtml(cap.capId)}</p>
      <a class="button secondary" href="/register/${escapeHtml(cap.capId)}">Registration QR link</a>
      <a class="button" href="/verify/${escapeHtml(cap.capId)}">Cap identity QR link</a>
    </div>`)
    .join("");

  return layout({
    title: "Cap identity system",
    eyebrow: "Ownership system",
    body: `<h1>Every cap has an identity.</h1>
      <p>The thank you note QR registers the buyer. The cap QR verifies the registered owner.</p>
      ${rows}`
  });
}

function registerPage(cap, error = "") {
  if (!cap) {
    return notFoundPage();
  }

  if (cap.status === "registered") {
    return layout({
      title: "Already registered",
      eyebrow: "Registered",
      body: `<h1>This CAPTION is already yours.</h1>
        <p>This cap has already been registered. If you need help updating ownership, DM @wearthecaption.</p>
        <span class="cap-id">${escapeHtml(cap.capId)}</span>
        <a class="button secondary" href="/verify/${escapeHtml(cap.capId)}">Check cap identity</a>`
    });
  }

  return layout({
    title: "Register your CAPTION",
    eyebrow: "Register",
    body: `<h1>Register your CAPTION.</h1>
      <p>This connects your cap to your name for future drops, discounts, events, and selected access.</p>
      <span class="cap-id">${escapeHtml(cap.capId)}</span>
      ${error ? `<p>${escapeHtml(error)}</p>` : ""}
      <form method="post" action="/register/${escapeHtml(cap.capId)}">
        <label for="name">Name</label>
        <input id="name" name="name" autocomplete="name" required>
        <label for="email">Email</label>
        <input id="email" name="email" type="email" autocomplete="email" required>
        <label for="instagram">Instagram handle, optional</label>
        <input id="instagram" name="instagram" autocomplete="off" placeholder="@">
        <label for="city">City, optional</label>
        <input id="city" name="city" autocomplete="address-level2" placeholder="Nairobi">
        <button type="submit">Register cap</button>
      </form>`
  });
}

function registeredPage(cap) {
  return layout({
    title: "Registered",
    eyebrow: "Registered",
    body: `<h1>This CAPTION is now yours.</h1>
      <p>Your cap identity has been saved. Keep the cap safe. This ID can be used for future CAPTION access.</p>
      <dl>
        <div><dt>Cap ID</dt><dd>${escapeHtml(cap.capId)}</dd></div>
        <div><dt>Phrase</dt><dd>${escapeHtml(cap.phrase)}</dd></div>
        <div><dt>Owner</dt><dd>${escapeHtml(cap.owner.name)}</dd></div>
      </dl>
      <a class="button" href="/verify/${escapeHtml(cap.capId)}">View cap identity</a>`
  });
}

function verifyPage(cap) {
  if (!cap) {
    return notFoundPage();
  }

  if (cap.status !== "registered") {
    return layout({
      title: "Unregistered",
      eyebrow: "Identity check",
      body: `<h1>Not registered yet.</h1>
        <p>This CAPTION has not been registered. Ask the owner to scan the registration QR on the thank you note.</p>
        <dl>
          <div><dt>Cap ID</dt><dd>${escapeHtml(cap.capId)}</dd></div>
          <div><dt>Phrase</dt><dd>${escapeHtml(cap.phrase)}</dd></div>
          <div><dt>Status</dt><dd>Unregistered</dd></div>
        </dl>`
    });
  }

  const ownerName = cap.owner.name;
  const displayOwner = `${ownerName.split(" ")[0]} ${initials(ownerName).slice(-1)}.`;

  return layout({
    title: "Verified",
    eyebrow: "Identity check",
    body: `<h1>CAPTION verified.</h1>
      <p>This page confirms the registered identity of this cap. Private contact details are hidden.</p>
      <dl>
        <div><dt>Cap ID</dt><dd>${escapeHtml(cap.capId)}</dd></div>
        <div><dt>Drop</dt><dd>${escapeHtml(cap.drop)}</dd></div>
        <div><dt>Phrase</dt><dd>${escapeHtml(cap.phrase)}</dd></div>
        <div><dt>Owner</dt><dd>${escapeHtml(displayOwner)}</dd></div>
        <div><dt>Status</dt><dd>Registered</dd></div>
      </dl>`
  });
}

function notFoundPage() {
  return layout({
    title: "Not found",
    eyebrow: "Not found",
    body: `<h1>Cap ID not found.</h1>
      <p>This CAPTION ID does not exist yet. Check the QR code or DM @wearthecaption.</p>
      <a class="button secondary" href="/">Go home</a>`
  });
}

module.exports = {
  homePage,
  registerPage,
  registeredPage,
  verifyPage,
  notFoundPage
};
