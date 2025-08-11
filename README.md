# Healthcare Translation App

A real-time multilingual healthcare translation web app that converts spoken input into text, translates it instantly, and plays back audio in the target language. It helps bridge language gaps between patients and healthcare providers using speech recognition, translation APIs, and text-to-speech.

---

## Demo
[(https://healthcaretranslator1.netlify.app/)]
login creds: username: admin password: 1234

---

## Features

- Real-time speech-to-text transcription
- Instant translation between selected languages
- Audio playback of translated text
- User authentication and protected routes
- Clean and responsive UI

---

## Tech Stack

- **Frontend:** React, Vite
- **Backend:** Python (Flask/FastAPI) or Node.js (your choice)
- **APIs:**
  - Google Translate API (unofficial endpoint)
  - Browser Web Speech API (SpeechRecognition & SpeechSynthesis)
  - Hugging Face API for advanced NLP (optional)

---
## Usage Guide

1. Select source and target languages from the dropdown menus.  
2. Click **Start Speaking** and talk into your microphone.  
3. View the live transcription of your speech on screen.  
4. See the real-time translation of your speech into the target language.  
5. Listen to the translated speech via audio playback.  
6. Click **Stop** to end the current session.  

---

## AI Tools and APIs Used

- **Google Translate API:**  
  Uses Google's unofficial API endpoint to translate text between languages.

- **Web Speech API:**  
  Browser native SpeechRecognition API for live speech-to-text transcription.  
  Browser native SpeechSynthesis API for text-to-speech audio playback.

- **Hugging Face API (Optional):**  
  Provides advanced natural language processing features to enhance translation quality.
