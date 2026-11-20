# Recall — Study Flashcards MVP

A mobile-first, no-signup flashcard web app. Decks are stored in the browser's localStorage.

## Included
- Home screen with saved decks, card counts and last-studied dates
- Paste notes/topic with a 5,000-character limit
- Review generated cards; edit, delete and add cards
- Flip-card study with Again / Got it
- Results and a missed-cards-only review
- Responsive layout
- Serverless AI generation endpoint (`/api/generate`) that keeps the API key on the server
- Browser demo fallback when the AI endpoint is not configured

## Run locally
Requires Node.js and the Vercel CLI:

```bash
npm install -g vercel
vercel dev
```

Open the local URL printed by Vercel.

## Enable AI generation
1. Create an API key with your model provider.
2. In Vercel project settings, add `OPENAI_API_KEY` as an environment variable.
3. Optionally set `OPENAI_MODEL` (defaults to `gpt-4o-mini`).
4. Redeploy.

Do not put the API key in `public/index.html` or any browser-side JavaScript.

## Deploy
Import this folder into a Vercel project and deploy. The `api/generate.js` function is deployed with the static frontend.

## MVP notes / limitations
- Decks are saved only in this browser on this device. Clearing browser data can remove them.
- The demo fallback is intentionally simple and is not AI-quality generation.
- No accounts, cloud sync, PDF/photo import, sharing or spaced repetition in this version.
