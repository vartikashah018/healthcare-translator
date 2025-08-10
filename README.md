# Healthcare Translation — Vite + React Prototype

This is a lightweight Vite + React scaffold for the Healthcare Translation web app prototype.
It implements a mobile-first UI, client-side audio capture, Web Speech API fallback, dual transcripts,
a "Speak" button using the browser SpeechSynthesis API, and placeholders/hooks for server-side STT / LLM calls.

## Quick start

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```
2. Start dev server:
   ```bash
   npm run dev
   ```
3. Open http://localhost:5173 on your device.

## What this prototype includes
- Mobile-first responsive UI (React + plain CSS)
- Audio capture via `getUserMedia` and chunked recording
- Optional client-side `webkitSpeechRecognition` fallback (where available)
- Live dual transcripts: original and translated
- "Speak" button using browser SpeechSynthesis for translated text
- Server endpoints are **placeholders** — configure your backend to proxy calls to OpenAI / STT providers.

## Environment variables (example)
Create a `.env.local` file at project root with:
```
VITE_API_BASE=http://localhost:3000
```
The server is responsible for storing your OpenAI key and STT provider keys — **never** put secret keys in client-side code.

## Notes & next steps
- This prototype intentionally keeps sensitive operations on the server. Implement server routes to handle:
  - audio uploads / streaming to STT provider (AssemblyAI / Deepgram)
  - calls to OpenAI for transcription normalization and translation
  - optional TTS generation (or use browser SpeechSynthesis)
- For demos, you can test using the Web Speech API (Chrome desktop/Android recommended).
# Healthcare-Translation-Web-App-with-Generative-AI
# Healthcare-Translation-Web-App-with-Generative-AI
