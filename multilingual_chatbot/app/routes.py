from flask import Blueprint, request, jsonify, current_app as app
from models.mBART_model import MBartModel
from models.blenderbot_model import BlenderbotModel
from .grammar import grammar_check

# Initialize the mBART model
mbart = MBartModel()

# Initialize Blenderbot Model
blenderbot = BlenderbotModel()

# Create Flask Blueprint
api_bp = Blueprint("api", __name__)

@api_bp.route('/chat', methods=['POST'])
def chat():
    """
    Handles chatbot requests with detailed workflow logging and grammar correction.
    """
    data = request.json
    if not isinstance(data, dict) or not all(k in data for k in ["lang", "user_lang", "message", "chat_id"]):
        return jsonify({
            "error": "Invalid input format. Expected {lang, user_lang, message, chat_id}"
        }), 400

    message_lang = data["lang"]
    user_lang = data["user_lang"]
    user_message = data["message"].strip()
    chat_id = data["chat_id"]
    
    try:    
        # Extract corrections (if any) and apply the first correction to the message
        message_grammar_feedback = grammar_check(user_message,message_lang)

        # Step 2: Translate the message to English
        translated_to_english = mbart.translate(
            user_message, 
            message_lang, 
            "en"
        )

        # Step 3: Generate response using Blenderbot
        blenderbot_response = blenderbot.generate_response(chat_id, translated_to_english)

        # Step 4: Translate back to the initial message language
        translated_back = mbart.translate(
            blenderbot_response, 
            "en",
            message_lang
        )

        # Step 5: Translate to User's Language
        user_lang_response = mbart.translate(
            blenderbot_response, 
            "en", 
            user_lang
        )

        return jsonify({
            "lang": message_lang,
            "original_message": user_message,
            "message": translated_back,
            "message_in_user_language": user_lang_response,
            "message_grammar_feedback": message_grammar_feedback,
            "chat_id": chat_id
        })

    except Exception as e:
        app.logger.error(f"Error processing request: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500