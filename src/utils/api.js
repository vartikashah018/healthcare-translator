const API_BASE = "http://127.0.0.1:5000/api";

export async function detectLanguage(text) {
    try {
        const res = await fetch(`${API_BASE}/detect`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });

        if (!res.ok) {
            const err = await res.json();
            return { error: err.error || "Failed to detect language" };
        }

        return await res.json();
    } catch (error) {
        return { error: "Network error while detecting language" };
    }
}

export async function translateText(text, target) {
    try {
        const res = await fetch(`${API_BASE}/translate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, target })
        });

        if (!res.ok) {
            const err = await res.json();
            return { error: err.error || "Failed to translate" };
        }

        return await res.json();
    } catch (error) {
        return { error: "Network error while translating" };
    }
}