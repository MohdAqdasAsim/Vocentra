import requests

# LanguageTool API Endpoint
LANGUAGETOOL_API_URL = "https://api.languagetool.org/v2/check"

def grammar_check(text, language):
    """
    Sends a request to the LanguageTool API to check grammar.

    Args:
        text (str): The text to be checked.
        language (str): The language of the text (e.g., "en" for English).

    Returns:
        dict: A dictionary containing the API's response, including suggestions.
    """
    if not text or not language:
        raise ValueError("Both 'text' and 'language' are required.")

    try:
        # Send request to LanguageTool API
        response = requests.post(
            LANGUAGETOOL_API_URL,
            data={
                "text": text,
                "language": language
            }
        )

        # Check for API response status
        if response.status_code != 200:
            raise requests.HTTPError(
                f"LanguageTool API returned an error: {response.status_code}, {response.text}"
            )

        # Parse and return the API response
        return response.json()

    except requests.ConnectionError:
        raise ConnectionError("LanguageTool API is unreachable.")
    except requests.HTTPError as e:
        raise Exception(f"HTTP error occurred: {e}")
    except Exception as e:
        raise Exception(f"An unexpected error occurred: {e}")
