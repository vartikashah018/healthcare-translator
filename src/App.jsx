import React, { useState, useEffect, useRef } from "react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "hi", label: "Hindi" },
  { code: "ar", label: "Arabic" },
];

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };
  return (
    <div
      style={{
        height: "100vh",
        background: "#e0f2f1",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          padding: 30,
          borderRadius: 10,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: 320,
        }}
      >
        <h2 style={{ marginBottom: 20, color: "#00796b" }}>Healthcare Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 15,
            borderRadius: 5,
            border: "1px solid #b2dfdb",
            fontSize: 16,
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 20,
            borderRadius: 5,
            border: "1px solid #b2dfdb",
            fontSize: 16,
          }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: 12,
            backgroundColor: "#00796b",
            color: "white",
            border: "none",
            borderRadius: 5,
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

function ChatBubble({ original, translated, onSpeak, isPatient }) {
  return (
    <div
      style={{
        marginBottom: 12,
        maxWidth: "75%",
        alignSelf: isPatient ? "flex-start" : "flex-end",
        background: isPatient ? "#b2dfdb" : "#80cbc4",
        borderRadius: 16,
        padding: 12,
        boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
        color: "#004d40",
        wordBreak: "break-word",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: 6 }}>
        {isPatient ? "Patient" : "Provider"}
      </div>
      <div
        style={{
          fontSize: 14,
          marginBottom: 8,
          whiteSpace: "pre-wrap",
          backgroundColor: "#e0f2f1",
          padding: 8,
          borderRadius: 10,
          color: "#004d40",
        }}
      >
        {original}
      </div>
      <div
        style={{
          fontSize: 13,
          fontStyle: "italic",
          whiteSpace: "pre-wrap",
          color: "#00695c",
        }}
      >
        {translated}
      </div>
      <button
        onClick={onSpeak}
        style={{
          marginTop: 8,
          backgroundColor: "#004d40",
          color: "white",
          border: "none",
          padding: "6px 12px",
          borderRadius: 8,
          cursor: "pointer",
          fontWeight: "bold",
          userSelect: "none",
        }}
        title="Play translated audio"
      >
        🔊 Speak
      </button>
    </div>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  const [patientLang, setPatientLang] = useState("en");
  const [providerLang, setProviderLang] = useState("es");
  const [patientText, setPatientText] = useState("");
  const [providerText, setProviderText] = useState("");

  const [loadingTranslate, setLoadingTranslate] = useState(false);
  const [loadingSpeech, setLoadingSpeech] = useState(false);

  const chatEndRef = useRef(null);
  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleLogin = (username, password) => {
    if (username === "admin" && password === "1234") setLoggedIn(true);
    else alert("Invalid credentials");
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setChatHistory([]);
    setPatientText("");
    setProviderText("");
  };

  async function translateTextGoogle(text, fromLang, toLang) {
    if (!text.trim()) return "";
    setLoadingTranslate(true);
    try {
      const res = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&q=${encodeURIComponent(
          text
        )}`
      );
      const data = await res.json();
      const translatedText = data[0].map((item) => item[0]).join("");
      return translatedText;
    } catch (err) {
      alert("Google Translate API error: " + err.message);
      return "";
    } finally {
      setLoadingTranslate(false);
    }
  }

  function speakText(text, langCode) {
    if (!text || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    const langMap = {
      en: "en-US",
      es: "es-ES",
      fr: "fr-FR",
      hi: "hi-IN",
      ar: "ar-SA",
    };

    const targetLang = langMap[langCode] || "en-US";
    utterance.lang = targetLang;

    const speakWithVoice = () => {
      const voices = window.speechSynthesis.getVoices();

      const matchedVoice = voices.find((v) => v.lang === targetLang);
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      } else {
        console.warn(`No matching voice for ${targetLang}. Using default.`);
      }

      window.speechSynthesis.speak(utterance);
      window.speechSynthesis.onvoiceschanged = null;
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = speakWithVoice;
    } else {
      speakWithVoice();
    }
  }

  function recordAndTranscribeWebSpeech(langCode) {
    return new Promise((resolve) => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Your browser does not support Web Speech API.");
        resolve("");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = langCode;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      recognition.onerror = (event) => {
        alert("Speech recognition error: " + event.error);
        resolve("");
      };

      recognition.start();
    });
  }

  async function handleSend(side) {
    const originalText = side === "patient" ? patientText.trim() : providerText.trim();
    if (!originalText) return;

    const fromLang = side === "patient" ? patientLang : providerLang;
    const toLang = side === "patient" ? providerLang : patientLang;

    const translated = await translateTextGoogle(originalText, fromLang, toLang);
    if (!translated) return;

    setChatHistory((prev) => [
      ...prev,
      { id: Date.now(), side, original: originalText, translated },
    ]);

    if (side === "patient") setPatientText("");
    else setProviderText("");

    speakText(translated, toLang);
  }

  async function handleVoiceInput(side) {
    setLoadingSpeech(true);
    const langCode = side === "patient" ? patientLang : providerLang;
    const transcript = await recordAndTranscribeWebSpeech(langCode);
    setLoadingSpeech(false);
    if (!transcript) return;

    if (side === "patient") setPatientText((t) => (t ? t + " " : "") + transcript);
    else setProviderText((t) => (t ? t + " " : "") + transcript);
  }

  return !loggedIn ? (
    <Login onLogin={handleLogin} />
  ) : (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#e0f7fa",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#004d40",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          paddingBottom: 12,
          borderBottom: "2px solid #004d40",
        }}
      >
        <h1 style={{ fontSize: 26, fontWeight: "bold" }}>Healthcare Translator</h1>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#00796b",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            flex: 1,
            backgroundColor: "white",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            maxHeight: "60vh",
            marginBottom: 24,
          }}
        >
          {chatHistory.length === 0 && (
            <p style={{ textAlign: "center", color: "#00796b" }}>
              No messages yet. Start chatting!
            </p>
          )}
          {chatHistory.map(({ id, side, original, translated }) => (
            <ChatBubble
              key={id}
              isPatient={side === "patient"}
              original={original}
              translated={translated}
              onSpeak={() =>
                speakText(translated, side === "patient" ? providerLang : patientLang)
              }
            />
          ))}
          <div ref={chatEndRef} />
        </div>

        <div
          style={{
            display: "flex",
            gap: 24,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {/* Patient input */}
          <section
            style={{
              flex: "1 1 320px",
              backgroundColor: "#b2dfdb",
              padding: 16,
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label
              htmlFor="patient-lang"
              style={{ marginBottom: 8, fontWeight: "bold", color: "#004d40" }}
            >
              Patient Language
            </label>
            <select
              id="patient-lang"
              value={patientLang}
              onChange={(e) => setPatientLang(e.target.value)}
              style={{
                padding: 8,
                borderRadius: 8,
                border: "1px solid #004d40",
                marginBottom: 12,
                fontSize: 14,
              }}
            >
              {LANGUAGES.map(({ code, label }) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
            <textarea
              rows={4}
              placeholder="Type patient message..."
              value={patientText}
              onChange={(e) => setPatientText(e.target.value)}
              style={{
                padding: 12,
                borderRadius: 10,
                border: "1px solid #004d40",
                resize: "vertical",
                fontSize: 15,
                marginBottom: 12,
              }}
            />
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button
                onClick={() => handleVoiceInput("patient")}
                disabled={loadingSpeech}
                title="Record patient voice"
                style={{
                  backgroundColor: loadingSpeech ? "#004d40" : "#00796b",
                  border: "none",
                  color: "white",
                  padding: "10px 16px",
                  borderRadius: 10,
                  cursor: loadingSpeech ? "wait" : "pointer",
                }}
              >
                🎤
              </button>
              <button
                onClick={() => handleSend("patient")}
                disabled={loadingTranslate || !patientText.trim()}
                style={{
                  backgroundColor: loadingTranslate ? "#004d40" : "#004d40",
                  border: "none",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: 10,
                  cursor: loadingTranslate ? "wait" : "pointer",
                  fontWeight: "bold",
                }}
              >
                {loadingTranslate ? "Translating..." : "Send"}
              </button>
            </div>
          </section>

          {/* Provider input */}
          <section
            style={{
              flex: "1 1 320px",
              backgroundColor: "#80cbc4",
              padding: 16,
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label
              htmlFor="provider-lang"
              style={{ marginBottom: 8, fontWeight: "bold", color: "#004d40" }}
            >
              Provider Language
            </label>
            <select
              id="provider-lang"
              value={providerLang}
              onChange={(e) => setProviderLang(e.target.value)}
              style={{
                padding: 8,
                borderRadius: 8,
                border: "1px solid #004d40",
                marginBottom: 12,
                fontSize: 14,
              }}
            >
              {LANGUAGES.map(({ code, label }) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
            <textarea
              rows={4}
              placeholder="Type provider message..."
              value={providerText}
              onChange={(e) => setProviderText(e.target.value)}
              style={{
                padding: 12,
                borderRadius: 10,
                border: "1px solid #004d40",
                resize: "vertical",
                fontSize: 15,
                marginBottom: 12,
              }}
            />
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button
                onClick={() => handleVoiceInput("provider")}
                disabled={loadingSpeech}
                title="Record provider voice"
                style={{
                  backgroundColor: loadingSpeech ? "#004d40" : "#00796b",
                  border: "none",
                  color: "white",
                  padding: "10px 16px",
                  borderRadius: 10,
                  cursor: loadingSpeech ? "wait" : "pointer",
                }}
              >
                🎤
              </button>
              <button
                onClick={() => handleSend("provider")}
                disabled={loadingTranslate || !providerText.trim()}
                style={{
                  backgroundColor: loadingTranslate ? "#004d40" : "#004d40",
                  border: "none",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: 10,
                  cursor: loadingTranslate ? "wait" : "pointer",
                  fontWeight: "bold",
                }}
              >
                {loadingTranslate ? "Translating..." : "Send"}
              </button>
            </div>
          </section>
        </div>
      </main>
      <footer
        style={{
          marginTop: 24,
          textAlign: "center",
          color: "#004d40",
          fontSize: 14,
        }}
      >
        <p>© 2025 Healthcare Translator. All rights reserved.</p>
        <p>Built with ❤️ by Vartika Shah</p>
      </footer>
    </div>
  );
}
