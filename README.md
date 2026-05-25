# CAPTION Ownership System

Minimal black-and-white cap registration and identity-check system for CAPTION.

## What It Does

Each cap has two QR codes:

1. Thank you note QR:
   - Goes to `/register/{cap_id}`
   - Registers the buyer's name and email to the cap.

2. Inside cap QR:
   - Goes to `/verify/{cap_id}`
   - Only checks the cap identity and registered owner.
   - Does not allow public ownership changes.
   - Does not show private email details.

## Run Locally

```powershell
npm start
```

Open:

```text
http://localhost:3000
```

Example registration page:

```text
http://localhost:3000/register/CAP-001-WUEH-0001
```

Example cap identity page:

```text
http://localhost:3000/verify/CAP-001-WUEH-0001
```

## Seed 100 Drop 001 Cap IDs

This creates 20 IDs for each of the first five phrases.

```powershell
npm run seed
```

## Export QR Link CSV

Set your live domain first:

```powershell
$env:BASE_URL="https://wearthecaption.com"
npm run export:links
```

The CSV will be created at:

```text
exports/qr-links.csv
```

Use the `thank_you_note_registration_qr_url` column for the note QR.

Use the `inside_cap_identity_qr_url` column for the QR printed inside the cap.

## Data Storage

For now, the system stores cap data in:

```text
data/caps.json
```

This is enough for a prototype and first influencer test. Before selling at scale, move this data to a real database like Postgres, Supabase, Firebase, or Airtable.

## Privacy Rule

The cap QR should never expose private contact details.

The verify page shows:

- Cap ID
- Drop
- Phrase
- First name plus initial
- Registration status

It does not show:

- Email
- Phone number
- Address
