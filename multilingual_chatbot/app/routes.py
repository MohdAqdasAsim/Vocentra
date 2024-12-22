from flask import Blueprint, request, jsonify
from models.mBART_model import MBartModel
from app.utils import send_to_rasa

# Initialize the mBART model
mbart = MBartModel()

# Create Flask Blueprint
api_bp = Blueprint("api", __name__)

@api_bp.route('/chat', methods=['POST'])
def chat():
    """
    Handles chatbot requests. Input: ["lang", "text", "chat-id"].
    """
    data = request.json
    if not isinstance(data, list) or len(data) != 3:
        return jsonify({"error": "Invalid input format. Expected ['lang', 'text', 'chat-id']."}), 400

    src_lang, message, chat_id = data

    try:
        # Step 1: Translate input to English
        translated_to_english = mbart.translate(message, src_lang, "en_XX")

        # Step 2: Send to Rasa
        rasa_response = send_to_rasa(translated_to_english, chat_id)

        # Step 3: Translate Rasa response back to the source language
        translated_back = mbart.translate(rasa_response, "en_XX", src_lang)

        # Final response
        return jsonify([src_lang, translated_back, chat_id])
    except Exception as e:
        return jsonify({"error": str(e)}), 500
