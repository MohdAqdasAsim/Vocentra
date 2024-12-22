import requests

RASA_URL = "http://localhost:5005/webhooks/rest/webhook"

def send_to_rasa(message, chat_id):
    """
    Sends a message to Rasa and retrieves the response.
    """
    response = requests.post(
        RASA_URL,
        json={"sender": chat_id, "message": message}
    )
    if response.status_code != 200:
        raise Exception("Failed to communicate with Rasa.")
    return response.json()[0]["text"]