# gemini_client.py - AI client (now backed by Amazon Bedrock Claude Sonnet 4.5)
# Maintains the same ask_gemini() interface so all existing callers work unchanged.

from bedrock_client import invoke_bedrock


def ask_gemini(prompt: str) -> str:
    """
    Send a prompt to the AI model and get a text response.
    Previously used Google Gemini — now routes to Amazon Bedrock Claude Sonnet 4.5.
    Function name kept for backward compatibility.
    """
    return invoke_bedrock(prompt)
