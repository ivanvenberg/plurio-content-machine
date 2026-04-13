# Plurio Content Engine

Transform interview transcripts into polished, Plurio-branded intelligence reports.

## What It Does

1. **Upload** a `.txt` transcript
2. **Claude processes** it → extracts insights, quotes, signals, actions
3. **Email gate** captures leads (HubSpot-style)
4. **PDF download** — beautiful, Plurio-branded, A4 report

---

## Deploy to Vercel in 3 steps

### 1. Clone & install
```bash
npm install
```

### 2. Set environment variable
In Vercel dashboard → Project Settings → Environment Variables:
```
ANTHROPIC_API_KEY = sk-ant-xxxxxxxxxxxxx
```

Or create `.env.local` for local dev:
```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
```

### 3. Deploy
```bash
npx vercel
```
Or push to GitHub and connect via Vercel dashboard for automatic deploys.

---

## Local Development
```bash
npm run dev
# → http://localhost:3000
```

---

## Customization

### Branding
- Colors: `tailwind.config.ts` → `plurio` color keys
- Fonts: `app/globals.css` → Google Fonts import
- Logo: `app/layout.tsx` and `app/page.tsx` → `PlurioLogo` component
- PDF colors/fonts: `components/PlurioPDFDownload.tsx` → constants at top

### Email Gate
The gate currently just requires an email to unlock the report (client-side only).
To wire it to a CRM (HubSpot, Mailchimp, etc.), update `handleUnlock` in `app/gate/page.tsx`:
```ts
await fetch('/api/capture-lead', {
  method: 'POST',
  body: JSON.stringify({ email, company }),
})
```

### PDF Report Sections
The AI prompt is in `app/api/process/route.ts` → `SYSTEM_PROMPT`.
Adjust the schema or instructions to change what the report includes.

---

## File Format Support
Currently: `.txt`, `.md`
To add PDF support: install `pdfjs-dist` and extract text client-side before sending.

---

## Stack
- Next.js 15 (App Router)
- Anthropic Claude claude-opus-4-6 (transcript processing)
- @react-pdf/renderer (PDF generation, client-side)
- Tailwind CSS (styling)
- Vercel (deployment)

---

## Plurio · [plurio.ai](https://plurio.ai)
