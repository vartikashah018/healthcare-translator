from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Allow all origins for now (you can restrict later)
CORS(app)

@app.route('/api/detect', methods=['POST'])
def detect_language():
    data = request.json
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "No text provided"}), 400
    
    # Example: fake language detection
    detected_lang = "en" if "hello" in text.lower() else "unknown"
    return jsonify({"language": detected_lang})

@app.route('/api/translate', methods=['POST'])
def translate():
    data = request.json
    text = data.get("text", "")
    target_lang = data.get("target", "en")
    if not text:
        return jsonify({"error": "No text provided"}), 400
    
    # Example: fake translation
    translated_text = f"{text} (translated to {target_lang})"
    return jsonify({"translation": translated_text})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
