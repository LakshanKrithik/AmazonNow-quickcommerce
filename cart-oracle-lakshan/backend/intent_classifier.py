# intent_classifier.py - Intent classification using Gemini (replaces Bedrock from Project B)
# Maps user text input to a crisis category and target product category

import json
from gemini_client import ask_gemini

VALID_CRISIS_CATEGORIES = [
    "POWER_CUT_CRISIS", "PARTY_CRISIS", "BABY_CRISIS",
    "TRAVEL_CRISIS", "MEDICINE_CRISIS", "RAIN_CRISIS",
    "COOKING_CRISIS", "PET_CRISIS"
]

INTENT_PROMPT = """You are an NLP routing engine for a Quick Commerce app.
Your only job is to map the user's situation into exactly one macro_crisis category and identify the target_category.

Valid macro_crisis categories: POWER_CUT_CRISIS, PARTY_CRISIS, BABY_CRISIS, TRAVEL_CRISIS, MEDICINE_CRISIS, RAIN_CRISIS, COOKING_CRISIS, PET_CRISIS.

Output ONLY a raw JSON object. No markdown, no conversational text, no backticks.
Example: {"macro_crisis": "POWER_CUT_CRISIS", "target_category": "candles"}"""


def classify_intent(transcript: str) -> dict:
    """
    Classify user text into a crisis category and target product category.
    Uses Gemini AI, with a keyword-based fallback if AI fails.
    """
    if not transcript or len(transcript.strip()) < 2:
        return {"macro_crisis": "POWER_CUT_CRISIS", "target_category": "emergency_light"}

    prompt = f"""{INTENT_PROMPT}

User input: "{transcript}"
Return JSON only."""

    try:
        response = ask_gemini(prompt)
        clean = response.strip().replace("```json", "").replace("```", "").strip()
        result = json.loads(clean)

        # Validate the crisis category
        if result.get("macro_crisis") not in VALID_CRISIS_CATEGORIES:
            raise ValueError(f"Invalid crisis category: {result.get('macro_crisis')}")

        if not result.get("target_category") or len(result["target_category"]) < 2:
            raise ValueError("Missing or invalid target_category")

        return result

    except Exception as e:
        print(f"[INTENT CLASSIFIER] AI failed, using fallback: {e}")
        return _fallback_classification(transcript)


def _fallback_classification(transcript: str) -> dict:
    """Keyword-based fallback when AI is unavailable."""
    lower = transcript.lower()

    if any(w in lower for w in ["rain", "storm", "umbrella", "wet", "flood"]):
        return {"macro_crisis": "RAIN_CRISIS", "target_category": "umbrella"}
    elif any(w in lower for w in ["party", "drinks", "ice", "snacks", "guests"]):
        return {"macro_crisis": "PARTY_CRISIS", "target_category": "soft_drinks"}
    elif any(w in lower for w in ["baby", "diaper", "formula", "wipes", "infant"]):
        return {"macro_crisis": "BABY_CRISIS", "target_category": "diapers"}
    elif any(w in lower for w in ["travel", "flight", "train", "luggage", "trip"]):
        return {"macro_crisis": "TRAVEL_CRISIS", "target_category": "travel_adapter"}
    elif any(w in lower for w in ["fever", "medicine", "pain", "headache", "cough", "sick"]):
        return {"macro_crisis": "MEDICINE_CRISIS", "target_category": "painkillers"}
    elif any(w in lower for w in ["power", "electricity", "dark", "blackout", "torch"]):
        return {"macro_crisis": "POWER_CUT_CRISIS", "target_category": "emergency_light"}
    elif any(w in lower for w in ["cook", "oil", "salt", "milk", "kitchen", "gas"]):
        return {"macro_crisis": "COOKING_CRISIS", "target_category": "cooking_oil"}
    elif any(w in lower for w in ["dog", "cat", "pet", "puppy", "kitten", "litter"]):
        return {"macro_crisis": "PET_CRISIS", "target_category": "dog_food"}
    else:
        return {"macro_crisis": "POWER_CUT_CRISIS", "target_category": "emergency_light"}
