import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if api_key:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.5-flash")
else:
    model = None
    print("[GEMINI CLIENT] WARNING: No GEMINI_API_KEY found. AI calls will use fallback.")


def ask_gemini(prompt: str) -> str:
    if not model:
        raise Exception("Gemini API key not configured")
    
    response = model.generate_content(
        prompt,
        request_options={"timeout": 10}  # 10 second timeout
    )
    return response.text
